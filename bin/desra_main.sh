#!/usr/bin/env bash
# main.sh  # main script
#	   # get input: jobid
#	   # run receives jobid as parameter
# usage:
#
# main.sh -j jobid -a ref_assembly
# eg:
#   main.sh -j 00001 -a ref_GRCh37.p13
#
# function:
#  checks that jobid exists in jobs table of deSRA database
#  locates jobid, job files: gene_name, sracond1, sracond2, gene database
#  runs desra_go_mb.sh:
#   desra_go_mb.sh -j jobid -e email_address -d blastdb_dir
#
# technical notes:
# create table:
# sqlite> create table jobs(id varchar(100), start varchar(100), stop varchar(100), email_address, status varchar(100) );

while getopts d:j:e:t: o           # opts followed by ":" will have an argument
do      case "$o" in
        d)      blastdb="$OPTARG";;
        j)      job_id="$OPTARG";;
        e)      email_address="$OPTARG";;
				t)      threads="$OPTARG";;
        [?])    echo >&2 "Usage: $0 -j jobid -e email_address -d blastdb_dir -t number_of_threads"
                exit 1;;
        esac
done

if [ -z ${DATA} ]
then
  DATA="/data"
fi

if [ -z ${BIN} ]
then
  BIN=`echo ~/bin`
fi

if [ -z ${JOBS} ]
then
  JOBS="/data/jobs"
fi

if [ -z ${DB} ]
then
  DB="/data/db.sqlite3"
fi

if [ ! -e ${JOBS}/$job_id ]
then
	mkdir -p $JOBS/$job_id
fi

if [ ! -z $threads ]
then
	threads="-t $threads"
else
	threads=""
fi

line=$(echo "select * from jobs WHERE jobid = '$job_id';" | sqlite3 $DB)
# echo "db line is [$line]";
# echo "select * from jobs;" | sqlite3 deSRA

if [ -z "$line" ]
then
	echo "insert into jobs (start,email_address, jobid, status) values (CURRENT_TIMESTAMP, '${email_address}', '${job_id}','submitted');" | sqlite3 $DB
  line=$(echo "select * from jobs WHERE jobid = '$job_id';" | sqlite3 $DB)
fi

if [ ! -z "${line}" ]
then
  echo "db line is [$line]";
  id=`echo "$line" | cut -d\| -f1`;
  echo "id is $id";
  START=`echo "$line" | cut -d\| -f2`
  echo "START is $START"
  STOP=`echo "$line" | cut -d\| -f3`
  echo "STOP is $STOP"
  email_address=`echo "$line" | cut -d\| -f4`
  jobid=`echo "$line" | cut -d\| -f5`
  echo "jobid is $jobid"
  status=`echo "$line" | cut -d\| -f6`
  done_status="DONE"
  echo "status is: $status"
  if [ "${status}" == "${done_status}" ]
  then
    echo "ERROR: status [$status] found for jobid [$jobid] in database, please address and resubmit."
    echo "exiting...."
    exit
  fi
  echo ""
else
  echo "ERROR: jobid [$jobid] is not found in database, please fix and resubmit."
  echo "exiting...."
  exit
fi

sra_list="";
if [ "$job_id" -eq "$jobid" ]
then
    echo "jobid [$jobid] is found in database"

	# cd to jobid directory
    dir="$JOBS/$job_id"
	echo "dir is [$dir]"
	cd $dir

	# get sra accession lists from sra condition files:
	sra_list1=`cat sra_cond1 | tr "\\n" "," | sed -e 's/,$/\n/'`
    echo "sra_list1 is [$sra_list1]"
	sra_list2=`cat sra_cond2 | tr "\\n" "," | sed -e 's/,$/\n/'`
    echo "sra_list2 is [$sra_list2]"

    for gene in `cat gene_name`;
    do
	    echo ""
        echo "gene is [$gene]"

		if [ -e ${blastdb}/$gene ]
		then
			echo "gene dir is [$blastdb/$gene]"

			# get gene_db files from gene_directory
		   	for gene_db in `ls $blastdb/$gene/*.nhr | sed 's/.nhr//'`;
            do
                # run desra_go_mb.sh for the gene database using sra accession lists
                echo "running cmd: desra_go_mb.sh -d $blastdb -s $sra_list1 -g ${gene} $threads"
                return_code=`desra_go_mb.sh -d $blastdb -s $sra_list1 -g ${gene} $threads -c cond1`
                echo "return_code of cmd: [$return_code]"

                echo "running cmd: desra_go_mb.sh -d $blastdb -s $sra_list2 -g ${gene} $threads"
                return_code=`desra_go_mb.sh -d $blastdb -s $sra_list2 -g ${gene} $threads -c cond2`
                echo "return_code of cmd: [$return_code]"
                echo ""
                echo ""
		  	done
		else
	  	    echo "ERROR: gene dir does NOT exist, continuing with next gene"
            echo ""
            echo ""
            echo ""
		fi
    done

		echo "preparing to run: python3 $BIN/desra_calculate_tpm.py -o ${job_id}.txt"
		return_code=`python3 $BIN/desra_calculate_tpm.py -o ${job_id}.txt`

		echo "update jobs SET status='DONE', stop=CURRENT_TIMESTAMP WHERE jobid='$jobid';" | sqlite3 $DB
fi
exit;

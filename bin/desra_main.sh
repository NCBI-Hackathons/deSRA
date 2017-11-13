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
#   desra_go_mb.sh -d gene_database -s comma_separated_sra_list -w working_dir -o sam_file
#
# technical notes:
# create table:
# sqlite> create table jobs(id varchar(100), start varchar(100), stop varchar(100), email_address, status varchar(100) );

while getopts a:d:j:e: o           # opts followed by ":" will have an argument
do      case "$o" in
        a)      assembly="$OPTARG";;
        d)      database_dir="$OPTARG";;
        j)      in_jobid="$OPTARG";;
        e)      email_address="$OPTARG";;
        [?])    echo >&2 "Usage: $0 -a assembly -j jobid -e email_address -d deSRA_database_dir"
                exit 1;;
        esac
done

if [ ! ${BIN} ]
then
  BIN="/home/biodocker/data/bin";
fi

if [ ! ${DATA} ]
then
  DATA="/home/biodocker/data";
fi

echo "assembly is [$assembly]"
blastdb_dir="$DATA/results/blastdb"
echo "blastdb_dir is [$blastdb_dir]"
assembly_dir=`echo $blastdb_dir/$assembly`
echo "assembly_dir is [$assembly_dir]"
database_file="$database_dir/deSRA"
echo "database_file is [$database_file]"

line=$(sqlite3 deSRA "select * from jobs WHERE jobid = '$in_jobid'")
# echo "db line is [$line]";
# echo "select * from jobs;" | sqlite3 deSRA

if [ ${line} ]
then
  echo "db line is [$line]";
  id=`echo $line | cut -d\| -f1`;
  echo "id is $id";
  START=`echo $line | cut -d\| -f2`
  echo "START is $START"
  STOP=`echo $line | cut -d\| -f3`
  echo "STOP is $STOP"
  email_address=`echo $line | cut -d\| -f4`
  jobid=`echo $line | cut -d\| -f5`
  echo "jobid is $jobid"
  status=`echo $line | cut -d\| -f6`
  done_status="DONE"
  echo "status is: $status"
  if [ "$status"=="$done_status" ]
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
if [ "$in_jobid" -eq "$jobid" ]
then
    echo "jobid [$jobid] is found in database"

		# cd to jobid directory
    dir=`echo "$DATA/jobs/$jobid"`
		echo "dir is [$dir]"
		cd $dir

		# get gene_name and sra_condition files:
    ls -l gene_name sra_cond*

		# get sra accession lists from sra condition files:
		sra_list1=`cat sra_cond1 | tr "\\n" "," | sed -e 's/,$/\n/'`
    echo "sra_list1 is [$sra_list1]"
		sra_list2=`cat sra_cond2 | tr "\\n" "," | sed -e 's/,$/\n/'`
    echo "sra_list2 is [$sra_list2]"

    for gene in `cat gene_name`;
    do
			echo ""
      echo "gene is [$gene]"

			# go to gene directory
			gene_dir="$assembly_dir/$gene"

			if [ -e ${gene_dir} ]
			then
					echo "gene_dir is [$gene_dir]"
  				cd $gene_dir

		  	  # get gene_db files from gene_directory
		   	  for gene_db in `ls *.nhr | sed 's/.nhr//'`;
				  	  do
				  	    path_gene_db="$gene_dir/$gene_db"
				   	    # echo "path_gene_db is [$path_gene_db]"
				   	    # echo "gene_db is [$gene_db]"

				  	    # run desra_go_mb.sh for the gene database using sra accession lists
				  	    echo "running cmd: $BIN/desra_go_mb.sh -d $path_gene_db -s $sra_list1 -w $jobid -o $dir/${gene_db}_cond1.bam"
				            return_code=`$BIN/desra_go_mb.sh -d $path_gene_db -s $sra_list1 -w $jobid -o $dir`
				            echo "return_code of cmd: [$return_code]"

				  	    echo "running cmd: $BIN/desra_go_mb.sh -d $path_gene_db -s $sra_list2 -w $jobid -o $dir/${gene_db}_cond2.bam"
				            return_code=`$BIN/desra_go_mb.sh -d $path_gene_db -s $sra_list1 -w $jobid -o $dir`
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
fi

echo "preparing to run: python3 $BIN/desra_calculate_tpm.py"
return_code=`python3 $BIN/desra_calculate_tpm.py`

$stop_date=`date` 2> /dev/null;
stop_seconds=`date -d "$stop_date" +%s`
echo "stop is [$stop_seconds]"

sqlite3 $database_file "update jobs SET status='DONE', stop='$stop_seconds' WHERE jobid='$jobid'"
exit;

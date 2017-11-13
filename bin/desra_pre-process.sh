#!/usr/bin/env bash
# pre-process.sh   # Download fasta files for genes and created blastdb
#
#

while getopts d:g:f: o           # opts followed by ":" will have an argument
do      case "$o" in
        d)      dir="$OPTARG";;
				f)      gff_file="$OPTARG";;
				g)      gene_file="$OPTARG";;
        [?])    echo >&2 "Usage: $0 -d directory -t tsv_file"
                exit 1;;
        esac
done

if [ ! ${BIN} ]
then
  BIN="/home/biodocker/bin";
fi

if [ ! -e "$DB" ]
then
	echo "Creating SQLiteDB"
	echo "create table jobs(id varchar(100), start varchar(100), stop varchar(100), email_address, jobid varchar(100), status varchar(100) );" | sqlite3 $DB
fi

if [ ! -e ${dir} ]
then
	mkdir -p ${dir}
fi
cd ${dir}

if [ ! -e $gff_file ]
then
	gff_file="ref_GRCh38.p7_top_level.gff3.gz"
	if [ ! -e "${gff_file%.gff}/$gff_file" ]
	then
		echo "Creating directory ${gff_file%.gff} for the database "
		mkdir -p ${gff_file%.gff}
		cd ${gff_file%.gff}
		echo "Downloading GFF file from NCBI"
		wget ftp://ftp.ncbi.nlm.nih.gov/genomes/Homo_sapiens/GFF/ref_GRCh38.p7_top_level.gff3.gz
		gunzip $gff_file
		cd ..
	fi
else
	if [ ! -e "${gff_file%.gff}" ]
	then
		echo "Creating directory ${gff_file%.gff} for the database "
		mkdir ${gff_file%.gff}
	fi
	echo "Coping data to directory ${gff_file%.gff}"
	cp $gff_file ${gff_file%.gff}/
	rm -f ${gff_file%.gff}/${gff_file}.tsv
fi

if [ ! -e "${gff_file%.gff}/${gff_file}.tsv" ]
then
	cd ${gff_file%.gff}
	echo "Extracting genes coordinates from GFF file"
	nodejs $BIN/desra_extractColumns.js $gff_file
	cd ..
fi

cd ${gff_file%.gff}

if [ -e "$gene_file" ]
then
	echo "Extracting selected genes"
	grep grep -F -f $gene_file ${gff_file}.tsv > ${gff_file}_toparse.tsv
	tsv_file="${gff_file}_toparse.tsv"
else
	tsv_file="${gff_file}.tsv"
fi

cat ${tsv_file} | while read line;
do
  # echo "$line";
  ACC=`echo $line | awk '{print $1}'`
  # echo "ACC is $ACC"
  START=`echo $line | awk '{print $2}'`
  # echo "START is $START"
  STOP=`echo $line | awk '{print $3}'`
  # echo "STOP is $STOP"
  GID=`echo $line | awk '{print $4}'`
  # echo "GID is $GID"
  GENE_name=`echo $line | awk '{print $5}'`
  mkdir -p ${GENE_name}
	cd ${GENE_name}
  echo "Processing GENE $GENE_name"
  efetch -db nuccore -id $ACC -format fasta -seq_start $START -seq_stop $STOP > ${GENE_name}_${GID}_${START}_${STOP}.fasta
  makeblastdb -in ${GENE_name}_${GID}_${START}_${STOP}.fasta -out ${GENE_name}_${GID}_${START}_${STOP} -title ${GENE_name}_${GID}_${START}_${STOP} -parse_seqids -dbtype nucl
  cd ..
done

echo "DONE"
exit 0

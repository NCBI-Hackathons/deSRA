#!/usr/bin/env bash
# pre-process.sh   # Download fasta files for genes and created blastdb
#
#
gff_file=""
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

if [ ! -e "/data/ncbi" ]
then
  mkdir /data/ncbi  || { echo 'ERROR: Creating dir /data/ncbi' ; exit 1; }
	rm -rf /home/biodocker/.ncbi || { echo 'ERROR: Error removing dir /home/biodocker/.ncbi' ; exit 1; }
	ln -s /data/ncbi /home/biodocker/.ncbi || { echo 'ERROR: Linking /data/ncbi to /home/biodocker/.ncbi' ; exit 1; }
fi

if [ ! -e "$DB" ]
then
	echo "Creating SQLiteDB"
	echo "create table jobs(id integer NOT NULL PRIMARY KEY AUTOINCREMENT, start varchar(100), stop varchar(100), email_address, jobid varchar(100), status varchar(100) );" | sqlite3 $DB
fi

if [ ! -e ${dir} ]
then
	mkdir -p ${dir} || { echo 'ERROR: Creating dir ${dir}' ; exit 1; }
fi
cd ${dir}

if [ -z $gff_file ]
then
	gff_file="ref_GRCh38.p7_top_level.gff3"
	if [ ! -e "${gff_file%.gff3}/$gff_file" ]
	then
		echo "Creating directory ${gff_file%.gff3} for the database "
		mkdir -p ${gff_file%.gff3} || { echo 'ERROR: Creating dir ${gff_file%.gff3}' ; exit 1; }
		cd ${gff_file%.gff3} || { echo 'ERROR: Changing to dir ${gff_file%.gff3}' ; exit 1; }
		echo "Downloading GFF file from NCBI"
		wget ftp://ftp.ncbi.nlm.nih.gov/genomes/Homo_sapiens/GFF/ref_GRCh38.p7_top_level.gff3.gz || { echo 'ERROR: Downloading file ftp://ftp.ncbi.nlm.nih.gov/genomes/Homo_sapiens/GFF/ref_GRCh38.p7_top_level.gff3.gz' ; exit 1; }
		gunzip ${gff_file}.gz || { echo 'ERROR: Gunzipping ${gff_file}.gz' ; exit 1; }
		cd ..
	fi
else
	name=`basename $gff_file`
	if [ ! -e "${gff_file%.gff3}" ]
	then
		echo "Creating directory ${name%.gff3} for the database "
		mkdir ${name%.gff3} || { echo 'ERROR: Changing to dir ${name%.gff3}' ; exit 1; }
	fi
	echo "Coping data to directory ${name%.gff3}"
	cp $gff_file ${name%.gff3}/ || { echo 'ERROR: Coping $gff_file to dir ${gff_file%.gff3}' ; exit 1; }
	rm -f ${name%.gff3}/${gff_file}.tsv || { echo 'ERROR: Removing old ${gff_file%.gff3}/${gff_file}.tsv' ; exit 1; }
	gff_file=$name
fi

if [ ! -e "${gff_file%.gff3}/${gff_file}.tsv" ]
then
	cd ${gff_file%.gff3} || { echo 'ERROR: Changing to dir ${gff_file%.gff3}' ; exit 1; }
	echo "Extracting genes coordinates from GFF file"
	nodejs $BIN/desra_extractColumns.js $gff_file || { echo 'ERROR: Parsing GFF file' ; exit 1; }
	cd ..
fi

cd ${gff_file%.gff3} || { echo 'ERROR: Changing to dir ${gff_file%.gff3}' ; exit 1; }

if [ -e "$gene_file" ]
then
	echo "Extracting selected genes"
	grep -F -f $gene_file ${gff_file}.tsv > ${gff_file}_toparse.tsv || { echo 'ERROR: Selecting genes from $gene_file' ; exit 1; }
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
  efetch -db nuccore -id $ACC -format fasta -seq_start $START -seq_stop $STOP > ${GENE_name}_${GID}_${START}_${STOP}.fasta || { echo 'ERROR: Fetching data from NCBI' ; exit 1; }
  makeblastdb -in ${GENE_name}_${GID}_${START}_${STOP}.fasta -out ${GENE_name}_${GID}_${START}_${STOP} -title ${GENE_name}_${GID}_${START}_${STOP} -parse_seqids -dbtype nucl || { echo 'ERROR: Creating blast db' ; exit 1; }
  cd ..
done

echo "DONE"
exit 0

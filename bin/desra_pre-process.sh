#!/usr/bin/env bash
# pre-process.sh   # Download fasta files for genes and created blastdb
#
#

while getopts d:t: o           # opts followed by ":" will have an argument
do      case "$o" in
        d)      dir="$OPTARG";;
				g)      gff_file="$OPTARG";;
        [?])    echo >&2 "Usage: $0 -d directory -t tsv_file"
                exit 1;;
        esac
done

if [ ! ${BIN} ]
then
  BIN="/home/biodocker/bin";
fi

nodejs $BIN/desra_extractColumns.js $gff_file

if [ -e ${dir} ]
then
  cd ${dir}
fi

cat ${gff_file}.tsv | while read line;
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
  # echo "GENE_name is $GENE_name"
  efetch -db nuccore -id $ACC -format fasta -seq_start $START -seq_stop $STOP > ${GENE_name}_${GID}_${START}_${STOP}.fasta
  makeblastdb -in ${GENE_name}_${GID}_${START}_${STOP}.fasta -out ${GENE_name}_${GID}_${START}_${STOP} -title ${GENE_name}_${GID}_${START}_${STOP} -parse_seqids -dbtype nucl
  cd ..
done

exit 0

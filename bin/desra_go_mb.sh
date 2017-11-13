#!/usr/bin/env bash
# desra_go_mb.sh # magicblast wrapper
#	   # get input: db and comma_separated_sra_list
#	   # run magicblast using db and comma_separated_sra_list
# usage:
#
# go_mb.sh -d database -s comma_separated_sra_list -w workign_dir -o bam_file -t number_of_threads
#

while getopts d:s:t:g: o           # opts followed by ":" will have an argument
do      case "$o" in
        d)      dir="$OPTARG";;
        s)      srr_list="$OPTARG";;
        g)      gene_name="$OPTARG";;
				t)      threads="$OPTARG";;
        [?])    echo >&2 "Usage: $0 -d blastdb_dir -s comma_separated_sra_list -g gene_name -t number_of_threads"
                exit 1;;
        esac
done

threads=""
if [ ! -z $t ]
then
	threads=`echo "-num_threads $t"`
fi

if [ ! -e "$dir/$gene_name" ]
then
	echo "The gene $gene_name is not in the blastdb directory. Check dir: $dir"
	exit -1
fi

for db in `ls $dir/$gene_name/*.nhr | sed 's/.nhr//'`
do
	echo "Aligning gene $gene_name in blast db $db to $srr_list"
	name=`basename $db`
  magicblast $threads -sra_cache -no_unaligned -db $db -sra $srr_list | samtools sort -o ${name}.bam -  || { echo 'ERROR: Running magicblast' ; exit 1; }
  echo "Collecting stats from ${name}.bam"
	samtools flagstat ${name}.bam > ${name}.stats  || { echo 'ERROR: Collecting stats from ${name}.bam' ; exit 1; }
	echo "Indexing ${name}.bam"
  samtools index ${name}.bam || { echo 'ERROR: Indexing ${name}.bam' ; exit 1; }
done

echo "DONE"
exit 0

#!/bin/bash
# go_mb.sh # magicblast wrapper
#	   # get input: db and comma_separated_sra_list
#	   # run magicblast using db and comma_separated_sra_list
# usage:
#
# go_mb.sh -d database -s comma_separated_sra_list -w workign_dir -o bam_file -t number_of_threads
#

while getopts d:s:w:o:t: o           # opts followed by ":" will have an argument
do      case "$o" in
        d)      db="$OPTARG";;
        s)      srr_list="$OPTARG";;
        w)      wdir="$OPTARG";;
        o)      out="$OPTARG";;
				t)      threads="$OPTARG";;
        [?])    echo >&2 "Usage: $0 -d db -s comma_separated_sra_list -w workign_dir -o bam_out -t number_of_threads"
                exit 1;;
        esac
done

db=`echo $db`
# echo "db is $db"
srr_list=`echo $srr_list`
# echo "srr_list is $srr_list"

threads=""
if [ ! -z $t ]
then
	threads=`echo "-num_threads $t"`
fi

# echo "formating magiblast command: magicblast -db $db -sra $srr_list"
cd $wdir
magicblast $threads -no_unaligned -db $db -sra $srr_list | samtools sort -o ${out} -
samtools flagstat ${out} > ${out%.bam}.stats
samtools index ${out}


exit 0

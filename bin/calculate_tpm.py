#!/usr/bin/env python
import os
import sys
import argparse
import pysam
import json
import numpy as np
import scipy.stats as stats


def tpm(genes, samples, scale):
    result = []
    for c in samples:
        print('Processing: ' + c)
        for s in samples[c]:
            T = 0.0
            for g in genes:
                if s in genes[g]['sra']:
                    T += genes[g]['sra'][s]['raw_count'] / (genes[g]['end'] - genes[g]['start'] + 1)
            for g in genes:
                if s in genes[g]['sra']:
                    genes[g]['sra'][s]['TPM'] = (genes[g]['sra'][s]['raw_count'] * scale) / (
                        (genes[g]['end'] - genes[g]['start'] + 1) * T)
                    genes[g][c]['TPM_list'].append(genes[g]['sra'][s]['TPM'])
        for g in genes:
            if c in genes[g]:
                genes[g][c]['TPM'] = np.mean(genes[g][c]['TPM_list'])
    conds = [k for k in samples]
    print('Calculating Pvalues')
    for g in genes:
        if conds[0] in genes[g] and conds[1] in genes[g]:
            t, p = stats.mannwhitneyu(genes[g][conds[0]]['TPM_list'], genes[g][conds[1]]['TPM_list'])
            gene = {}
            gene['name'] = g
            gene['gene_id'] = genes[g]['gene_id']
            gene['start'] = genes[g]['start']
            gene['end'] = genes[g]['end']
            gene['chr'] = ''
            gene['TPM1'] = genes[g][conds[0]]['TPM']
            gene['TPM2'] = genes[g][conds[1]]['TPM']
            gene['PValue'] = p
            gene['BAM1'] = g + '_1_sorted.bam'
            gene['BAM2'] = g + '_2_sorted.bam'
            result.append(gene)
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Calculate TPM values')
    parser.add_argument('-w', help='Working directoy', required=False)
    parser.add_argument('-j', help='Job ID', required=False)
    parser.add_argument('-s', help='TPM scale factor', required=False)
    parser.add_argument('-o', help='Output file', required=True)

    args = parser.parse_args()
    out_name = args.o
    if args.w:
        if os.path.exists(args.w):
            os.chdir(args.w)

    if args.j:
        if not os.path.exists(args.j):
            print('Job ID should be a directory into the working directory')
            sys.exit(-1)
        os.chdir(args.j)

    if args.s:
        scale = float(args.s)
    else:
        scale = 10E6

    bam_files = [name for root, dirs, files in os.walk('./') for name in files if name.endswith(".sam")]

    samples = {}
    genes = {}
    for b in bam_files:
        print('Processing file: ' + b)
        mdata = b.split('_')
        cond = mdata[4].split('.')[0]
        if mdata[0] not in genes:
            genes[mdata[0]] = {}
            genes[mdata[0]]['sra'] = {}
            genes[mdata[0]]['gene_id'] = int(mdata[1])
            genes[mdata[0]]['start'] = int(mdata[2])
            genes[mdata[0]]['end'] = int(mdata[3])
            genes[mdata[0]][cond] = {}
            genes[mdata[0]][cond]['TPM_list'] = []
        else:
            genes[mdata[0]][cond] = {}
            genes[mdata[0]][cond]['TPM_list'] = []
        samfile = pysam.AlignmentFile(b, "r")
        if cond not in samples:
            samples[cond] = []
        for read in samfile.fetch(until_eof=True):
            sra = read.query_name.split('.')[0]
            if sra not in samples[cond]:
                samples[cond].append(sra)
            if sra not in genes[mdata[0]]['sra']:
                genes[mdata[0]]['sra'][sra] = {}
                genes[mdata[0]]['sra'][sra]['raw_count'] = 0
            genes[mdata[0]]['sra'][sra]['raw_count'] += 1

    if genes:
        genes = tpm(genes, samples, scale)
        with open(out_name, 'w') as fout:
            fout.write(json.dumps(genes))

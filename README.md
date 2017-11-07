# deSRA
differential expression of SRA: An automated protocol to extract sequence variation and changes in gene expression from public NGS datasets.

## Awesome Logo

## Link to DOI

### You can make a free DOI with zenodo <link>

## Website (if applicable)

## Intro statement
The differential expression of genes in reaction to an experimental condition can give valuable information on the pathways involved in the reaction. Unfortunately, it currently takes many steps to compare gene expression levels between treatment and control sequencing experiments. This article presents a simple tool to compare expression of genes in selected SRA runs.

## What's the problem?
Often people interested in gene expression lack the technical skills to make use of resourcs such as magicblast or the SRA tool kit.  deSRA is a tool to bridge this gap between advanced bioinformatic tools and users.

## Why should we solve it?

# What is deSRA?
The NCBI Sequence Read Archive SRA) provides next generation sequencing data along with sample and project metadata (NCBI Resource Coordinators 2017). As part of the International Nucleotide Sequence Database Collaboration, the SRA supports access to data from a wide variety of experimental types and sequencing instruments. 

This tool assumes that the user has prepared 2 sets of SRA runs reflecting the different treatment conditions being compared. For example, it the user is interested in how genes vary with treatment for HCV, they may be interested in using a BioProject record that links the runs for an experiment (https://www.ncbi.nlm.nih.gov/bioproject/328986). If the user selects the link for SRA experiments, they can view the results in SRA Run Selector, which displays a table including the SRA run accessions and treatment conditions (https://www.ncbi.nlm.nih.gov/sra?linkname=bioproject_sra_all&from_uid=328986). 

![alt tag](https://files.slack.com/files-tmb/T7QHB9VUG-F7WCF11PW-55ed870e88/info-flow_1024.jpg "Overview Diagram")

Build BLAST database
The accession, start stop positions, and gene ID are pulled from ref_GRCh38.p7_top_level.gff3. Based on those positions, a bash script retrieves the sequences in FASTA format and saves each as an individual BLAST database (Ryan’s script). 

Magic BLAST
Once user enters the list of gene IDs they are interested in, the set of BLAST databases for those genes is mounted into the active Docker run. The user also enters the SRA accessions (SRR numbers) for treatment runs and experiment runs that they want to compare. MagicBLAST is run iteratively for each gene, once for the treatment runs and once for the experiment runs. 
magicblast -sra <accession> -db <database_name> (https://ncbi.github.io/magicblast/)

Comparison of gene expression
MagicBLAST produces a SAM file, which is processed by separate scripts in Docker encoding samtools commands. The SAM file is converted to a BAM file, which is sorted and indexed, and used to generate a pileup. TPM is calculated for the pileups generated from the experimental runs and the control runs, and a volcano plot is used to display the log2 of the TPM ratios.

# How to use deSRA
Access website at ...
You will need gene names and SRR accessions for two alternative conditions. 

## Installation options:

We provide two options for installing deSRA: Docker or directly from Github.

### Requirements

#### Docker

1. Clone BioContainers Sandbox:
    `git clone https://github.com/BioContainers/sandbox`

2. Build Docker images for magicblast
    `docker build -t biocontainers/magicblast sandbox/magicblast/1.3.0/`

3. Build Docker images for Entrez-Direct
 `docker build -t biocontainers/entrez-direct sandbox/entrez-direct/7.50.20171103/`

### Installing ProjectForklift from Github

1. `git clone https://github.com/NCBI-Hackathons/ProjectForklift`

### Configuration

```Examples here```

# Testing

We tested four different tools with <this software>. They can be found in [server/tools/](server/tools/) . 

# Additional Functionality

### DockerFile

<this software> comes with a Dockerfile which can be used to build the Docker image.

  1. `git clone https://github.com/NCBI-Hackathons/<this software>.git`
  2. `cd server`
  3. `docker build --rm -t <this software>/<this software> .`
  4. `docker run -t -i <this software>/<this software>`
  
### Website

There is also a Docker image for hosting the main website. This should only be used for debug purposes.

  1. `git clone https://github.com/NCBI-Hackathons/<this software>.git`
  2. `cd Website`
  3. `docker build --rm -t <this software>/website .`
  4. `docker run -t -i <this software>/website`



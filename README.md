# deSRA
differential expression of SRA: An automated protocol to extract differencess in gene expression from public NGS datasets.

## Background
The future of biomedical research depends on the ability to rapidly access and analyze Next-Generation Sequencing (NGS) data stored at the NCBI’s Sequence Read Archive (SRA). NGS provides an unprecedented level of resolution, allowing researchers to ask previously unanswerable questions such as how cancer pathogenesis might be mediated by very small changes in gene expression.
 
Hosting data and performing analyses on the cloud, in a massively parallel fashion, will greatly accelerate the development of new research breakthroughs and innovative pharmaco-therapeutic strategies. Cloud computing would allow researchers to ask computationally intensive questions, such as how liver cells respond to treatment for hepatitis C virus infection (PMID28360091) or how human and mouse gene expression varies across all published datasets (DOI10.1101/189092)
 
With ~3 million records currently stored in the SRA database, and submissions growing exponentially, the SRA collection represents a treasure-trove of data to be mined by academia and industry.  The information contained in a single SRA dataset is equivalent to hundreds of in vitro experiments worth of work, potentially saving thousands of dollars and research hours. 
 
deSRA facilitates the interrogation of SRA datasets for differential gene expression via dockerized pipeline. deSRA makes it easy for biologists to examine the impact of their genes of interest on health and disease in the cloud through a user friendly web-interface. 

![alt text](https://user-images.githubusercontent.com/12971527/32506375-62c19028-c3b2-11e7-9377-848b3e50016e.jpg "Overview Diagram")

## Website
![alt text](https://user-images.githubusercontent.com/12971527/32568276-c0a25ab8-c48b-11e7-8143-08cebecc6b1c.png "Input page")
![alt text](https://user-images.githubusercontent.com/12971527/32507427-6280a0ba-c3b5-11e7-8ecb-d24365631596.png "Output page")
![alt text](https://user-images.githubusercontent.com/12971527/32507439-6a004156-c3b5-11e7-8298-ced875e54c36.png "alternative graph")

## Introduction
The differential expression of genes in response to an experimental condition can give valuable information on the pathways involved in the reaction. Unfortunately, it currently takes many steps to compare gene expression levels between Next Generation Sequencing (NGS) data sets. This repository presents code for a simple tool to compare the expression of selected genes between sets of NGS runs, as well as a link to a user friendly web interface.

## What's the problem?
The NCBI Sequence Read Archive (SRA) provides NGS data along with sample and project metadata (NCBI Resource Coordinators 2017). As part of the International Nucleotide Sequence Database Collaboration, the SRA supports access to data from a wide variety of experimental types and sequencing instruments. 

deSRA bridges this gap between advanced bioinformatic tools and users.
Often people interested in gene expression lack the technical skills to make use of resources such as magicblast or the SRA tool kit.  

## Why should we solve it?

The amount of NGS data stored in the Sequence Read Archive (SRA) data-base is growing rapidly. However, many researchers who are interested in this data do not have experience with the tools necessary to analyze it effectively. deSRA increases the utility and return on investment of NGS projects by making the data more accessible to a wider range of individuals.

# What is deSRA?

This tool assumes that the user has prepared 2 sets of SRA runs reflecting the different treatment conditions being compared. For example, it the user is interested in how genes vary with treatment for HCV, they may be interested in using a BioProject record that links the runs for an experiment (https://www.ncbi.nlm.nih.gov/bioproject/328986). If the user selects the link for SRA experiments, they can view the results in SRA Run Selector, which displays a table including the SRA run accessions and treatment conditions (https://www.ncbi.nlm.nih.gov/sra?linkname=bioproject_sra_all&from_uid=328986). 

Build BLAST database
The accession, start stop positions, and gene ID are pulled from ref_GRCh38.p7_top_level.gff3. Based on those positions, a bash script retrieves the sequences in FASTA format and saves each as an individual BLAST database (Ryan’s script). 

Magic BLAST
Once user enters the list of gene IDs they are interested in, the set of BLAST databases for those genes is mounted into the active Docker run. The user also enters the SRA accessions (SRR numbers) for treatment runs and experiment runs that they want to compare. MagicBLAST is run iteratively for each gene, once for the treatment runs and once for the experiment runs. 
magicblast -sra <accession> -db <database_name> (https://ncbi.github.io/magicblast/)

Comparison of gene expression
MagicBLAST produces a SAM file, which is processed by separate scripts in Docker encoding samtools commands. The SAM file is converted to a BAM file, which is sorted and indexed, and used to generate a pileup. TPM is calculated for the pileups generated from the experimental runs and the control runs, and a volcano plot is used to display the log2 of the TPM ratios.

# How to use deSRA
Launch a website from Docker image!  

You will need gene names and SRR accessions for two alternative conditions. 

## Installation options:

We provide two options for installing deSRA: Docker or directly from Github.

How to use the command line utility:  

### Requirements

#### Docker

1. Clone BioContainers Sandbox:
    `git clone https://github.com/BioContainers/sandbox`

2. Build Docker images for magicblast
    `docker build -t biocontainers/magicblast sandbox/magicblast/1.3.0/`

3. Build Docker images for Entrez-Direct
 `docker build -t biocontainers/entrez-direct sandbox/entrez-direct/7.50.20171103/`

### Installing deSRA from Github

`git clone https://github.com/NCBI-Hackathons/deSRA`

# Future Development Plans

  1. Accept HUGO gene names in addition to gene IDs
  2. Support organisms other than human

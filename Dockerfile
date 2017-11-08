# Base Image
FROM biocontainers/biocontainers:latest

# Metadata
LABEL base.image="biocontainers:latest"
LABEL version="3"
LABEL software="deSRA"
LABEL software.version="0.0.1"
LABEL description="An automated protocol to extract variation or expression from public NGS datasets"
LABEL website="https://github.com/NCBI-Hackathons/deSRA"
LABEL documentation="https://github.com/NCBI-Hackathons/deSRA"
LABEL license="https://github.com/NCBI-Hackathons/deSRA/blob/master/LICENSE"
LABEL tags="SRA,RNA-seq"

# Maintainer
MAINTAINER Roberto Vera Alvarez <r78v10a07@gmail.com>

USER root

RUN apt-get update && \
    apt-get install -y \
      libncurses5-dev \
      libncursesw5-dev \
			libbz2-dev \
			lzma lzma-dev liblzma-dev \
			libcurl4-gnutls-dev \
			python3 python3-pip \
			nodejs \
			liblwp-protocol-https-perl && \
    apt-get clean && \
    apt-get purge && \
		pip3 install numpy pysam scipy && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

USER biodocker

ENV ZIP=samtools-1.6.tar.bz2
ENV URL=https://github.com/samtools/samtools/releases/download/1.6/
ENV FOLDER=samtools-1.6
ENV DST=/tmp

RUN wget $URL/$ZIP -O $DST/$ZIP && \
    tar xvf $DST/$ZIP -C $DST && \
    rm $DST/$ZIP && \
    cd $DST/$FOLDER && \
		./configure --prefix=/home/biodocker && \
    make && \
    make install && \
    cd / && \
    rm -rf $DST/$FOLDER

ENV ZIP=ncbi-magicblast-1.3.0-x64-linux.tar.gz
ENV URL=ftp://ftp.ncbi.nlm.nih.gov/blast/executables/magicblast/1.3.0/
ENV FOLDER=ncbi-magicblast-1.3.0
ENV INSTALL_FOLDER=/home/biodocker/
ENV DST=/tmp

RUN cd $DST && \
	wget $URL/$ZIP -O $DST/$ZIP && \
	tar xzfv $DST/$ZIP -C $DST && \
	mv $DST/$FOLDER/LICENSE $DST/$FOLDER/README /home/biodocker/bin/ && \
	mv $DST/$FOLDER/bin/* /home/biodocker/bin/ && \
	rm -rf $DST/$FOLDER

ENV ZIP=edirect-7.50.20171103.tar.gz
ENV URL=ftp://ftp.ncbi.nlm.nih.gov/entrez/entrezdirect/versions/7.50.20171103/
ENV FOLDER=edirect
ENV INSTALL_FOLDER=/home/biodocker/
ENV DST=/tmp

RUN cd $DST && \
	wget $URL/$ZIP -O $DST/$ZIP && \
	tar xzfv $DST/$ZIP -C $DST && \
	mv $DST/$FOLDER/* /home/biodocker/bin/ && \
	rm -rf $DST/$FOLDER

ENV URL=https://github.com/NCBI-Hackathons/deSRA
ENV FOLDER=deSRA
ENV DST=/tmp

RUN cd $DST && \
	git clone $URL && \
	mv $DST/$FOLDER/bin/* /home/biodocker/bin/ && \
	mkdir /home/biodocker/web/ && \
	mv $DST/$FOLDER/web/* /home/biodocker/web/ && \
	rm -rf $DST/$FOLDER

WORKDIR /data/

CMD [""]

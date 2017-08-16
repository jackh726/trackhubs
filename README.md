# trackhubs

1. Project Name:
TrackHubs v1.0.0

2. Project repository: 
https://github.com/umms-hackathon/trackhubs.git

3. Team members: 

4. Aim: 
Creating ucsc genome browser hubs using an intuitive UI.

5. Project description: 
Creating an hub usually time consuming and error prune due to the text parsers in track hubs section in ucsc genome browser. 
Here we are going to create a system to allow users to add their own tracks to the genome browser and publish them in a web accessible area.

Basically, we are going to create a three files in a directory structure below.

![Alt text](https://genome.ucsc.edu/images/hubDirectoryImage.jpg?raw=true "Directory Structure")

We will first ask the initial information to the user to create hub.txt file;
 * hub MyHubsNameWithoutSpaces
 * shortLabel My Hub's Name
 * longLabel Name up to 80 characters versus shortLabel limited to 17 characters
 * email myEmail@address
(Other fields in hub can be predifined)

For genome.txt file;

  * genome assembly_database_1
  * trackDb assembly_1_path/trackDb.txt

For trackDb.txt file;

  * track uniqueNameNoSpacesOrDots
  * type track_type
  * bigDataUrl track_data_url
  * shortLabel label 17 chars
  * longLabel long label up to 80 chars

The trackDb.txt file uses stanzas for each track to inform the Browser of the name, type, location, and description of each binary file to display. The trackDb settings allow further display control such as by adding the line color255,0,0 to define a track's color. Each track type (bigBed, bigWig, bam, and vcfTabix) has further customizable trackDb settings. The bigDataUrl can be a relative path to a local file or a publicly-accessibly URL that accepts byte-ranges. The trackDb.txt also allows for advanced track grouping known as composites, superTracks and multiWigs.

And user should add all selected files and choose color to the track. Please check the example trackDb.txt file below;

track  bigWig1
bigDataUrl http://hgdownload.soe.ucsc.edu/goldenPath/hg19/encodeDCC/wgEncodeCshlLongRnaSeq/wgEncodeCshlLongRnaSeqA549CellLongnonpolyaMinusRawSigRep1.bigWig
shortLabel bigWig example
longLabel This bigWig file is an example from the ENCODE RNA-seq CSHL Track
type bigWig
visibility dense

track bigBed1
bigDataUrl http://hgdownload.soe.ucsc.edu/goldenPath/hg19/encodeDCC/wgEncodeCaltechRnaSeq/wgEncodeCaltechRnaSeqGm12891R2x75Il200JunctionsRep1V3.bigBed
shortLabel bigBed example
longLabel This bigBed file is an example from the ENCODE RNA-seq Caltech Track
type bigBed
visibility dense

track bam1
bigDataUrl http://hgdownload.soe.ucsc.edu/goldenPath/hg19/encodeDCC/wgEncodeCshlLongRnaSeq/wgEncodeCshlLongRnaSeqK562CellTotalAlnRep2.bam
#Note: There is a corresponding fileName.bam.bai in the same above directory 
shortLabel BAM example
longLabel This BAM file is an example from the ENCODE RNA-seq CSHL Track
type bam
visibility dense

track vcf1
bigDataUrl http://hgdownload.cse.ucsc.edu/gbdb/hg19/1000Genomes/ALL.chr21.integrated_phase1_v3.20101123.snps_indels_svs.genotypes.vcf.gz
#Note: there is a corresponding fileName.vcf.gz.tbi in the same above directory
shortLabel chr21 VCF example
longLabel This chr21 VCF file is an example from the 1000 Genomes Phase 1 Integrated Variant Calls Track
type vcfTabix
visibility dense




6. Supporting material and links: Supporting material. Sample files, external links.

https://genome.ucsc.edu/goldenpath/help/hgTrackHubHelp.html



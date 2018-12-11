#!/bin/bash
dir="/root/inls641/data/"
dir_in="/root/inls641/data/0113_1217_zip"
mkdir /root/inls641/data/unzipped
dir_out="/root/inls641/data/unzipped"
csv_out="13_17.csv"
# unzip all zip files under directory and save into another dir
find $dir_in -name "*.zip" -exec unzip -o -d $dir_out {} \;
# Find all files end with csv recursively
# find $dir_out -type f -name "*.csv";
# Get first header from first file
#one_csv=$(ls $dir_out | head -1);
#echo $one_csv;
#head -n 1 "$dir_out/$one_csv" >> "$dir$csv_out";
# Append all csvs without first line into csv_out
awk 'FNR!=NR && FNR==1 {next} 1' "$dir_out"/*.csv > "$dir$csv_out"
echo "Finished";

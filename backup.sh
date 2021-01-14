#!/bin/sh
DIR=`date +%m%d%y`
DEST=$DIR
mkdir $DEST
mongodump -h mongodb://localhost:27017 -d test -u '' -p '' -o $DEST
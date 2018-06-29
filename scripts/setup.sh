#!/usr/bin/env bash

# Copy over the files to test
rm -rf root
mkdir -p $PWD/build/root/app/
rsync -a $PWD/. $PWD/build/root/app/ --exclude .git --exclude build --exclude node_modules

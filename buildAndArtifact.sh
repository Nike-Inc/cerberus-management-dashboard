#!/usr/bin/env bash

npm install
npm run build
cd build/
echo "{\"version\":\"$(git describe --tags)\"}" > metadata.json
tar -zcvf ../cerberus-dashboard.tar.gz ./*
cd ../
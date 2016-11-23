#!/usr/bin/env bash

npm install
npm run build
cd build/
tar -zcvf ../cerberus-dashboard.tar.gz ./*

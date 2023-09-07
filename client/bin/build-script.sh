#!/bin/bash
rm -rf $BUILD_PATH
mkdir $BUILD_PATH
cp index.html $BUILD_PATH
npm run 'css:build'
cp -r css/ $BUILD_PATH

mkdir $BUILD_PATH/js
npm run 'js:build' -- --outfile=$BUILD_PATH/js/script.js

cp -r img/ $BUILD_PATH
cp -r webfonts/ $BUILD_PATH

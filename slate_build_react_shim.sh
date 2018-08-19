#!/bin/bash 
cd node_modules/@shopify/slate-tools/lib/tasks 
echo "
_______________________SLATE v0.14 REACT SHIM_____________________
SHIMMING...
  Target: $(pwd)
  
UPDATED:"
sed -i '' 's/.pipe(include()).pipe(gulp.dest(config.dist.assets))/.pipe(include()).pipe(react()).pipe(gulp.dest(config.dist.assets))/' build-js.js
sed -n '15p' build-js.js
sed -i '' "s/var gulp = require('gulp');/var gulp = require('gulp');\\
var react = require('gulp-react')/" build-js.js
echo " 
DONE: 
  Slate now supports react components!
__________________________________________________________________"
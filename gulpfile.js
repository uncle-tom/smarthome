'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
 
gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('fileinclude', function() {
  return gulp.src(['./src/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root'
    }))
    .pipe(gulp.dest('./dist/'))
});
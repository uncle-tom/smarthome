'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
var concat = require('gulp-concat');
 
gulp.task('scripts', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/js'));
});
 
gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('fileinclude', function() {
  return gulp.src(['./src/**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root'
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('develop', gulp.series('scripts', 'sass', 'fileinclude'));
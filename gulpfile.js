'use strict';

const nodemon = require('nodemon');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const runSequence = require('run-sequence');
const babel = require('gulp-babel');
const del = require('del');
const usemin = require('gulp-usemin');
const minifyCss = require('gulp-minify-css');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

gulp.task('clean', () => del('dist'));

gulp.task('clean:tmp', () => del('public/tmp'));

gulp.task('imagemin', () => {
  return gulp.src([
      'public/img/**/*'
    ])
    .pipe(imagemin())
    .pipe(gulp.dest('dist/public/img'));
});

gulp.task('copy', () => {
  return gulp.src([
      'public/favicon.ico',
      'server/views/partials/**/*',
      'server/data/**/*'
    ], {
      base: './'
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('transpile', () => {
  return gulp.src('server/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist/server'));
});

gulp.task('lint', () => {
  return gulp.src(['server/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// sass
gulp.task('sass', cb => {
  return gulp.src('public/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 20 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/tmp'));
});

gulp.task('watch', () => {
  gulp.watch('public/scss/*.scss' , ['sass']);
  gulp.watch('server/**/*.js' , ['lint']);
});

gulp.task('usemin:init', () => {
  return gulp.src('server/views/*.handlebars')
    .pipe(usemin({
      cssHome: [ minifyCss(), rev() ],
      cssLevel: [ minifyCss(), rev() ]
    }))
    .pipe(gulp.dest('dist/server/views/'));
});
gulp.task('usemin:move', () => {
  return gulp.src('dist/server/views/css/**/*')
    .pipe(gulp.dest('dist/public/css'));
});
gulp.task('usemin:clean', () => del('dist/server/views/css'));
gulp.task('usemin', cb => {
  runSequence('usemin:init', 'usemin:move', 'usemin:clean', cb);
});

gulp.task('serve:dev', () => {
  nodemon('-w server server/index.js');
});

// serve dev mode
gulp.task('default', cb => {
  runSequence('lint', 'clean:tmp', 'sass', 'serve:dev', 'watch', cb);
});

// serve prod mode
gulp.task('serve:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  nodemon('-w dist/server dist/server/index.js');
});

// create dist build
gulp.task('build', cb => {
  runSequence('lint', 'clean', 'sass', 'usemin', 'imagemin', 'copy', 'transpile', cb);
});
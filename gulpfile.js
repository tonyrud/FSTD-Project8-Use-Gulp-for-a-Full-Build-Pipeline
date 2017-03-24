'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const gulpConcat = require('gulp-concat')
const gulpUglify = require('gulp-uglify')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const maps = require('gulp-sourcemaps')
const clean = require('gulp-clean')
const imagemin = require('gulp-clean')

const options = {
  directories: {
    build: `./dist`,
    scripts: `./dist/scripts`,
    styles: `./dist/styles`,
    images: `./dist/content`
  }
}

/*  -------------------
  Reload Browser
--------------------- */
// build sass, then reload the page
gulp.task('reload', ['buildSass'], (done) => {
  browserSync.reload()
  done()
})

/*  -------------------
process sass
--------------------- */
gulp.task('styles', () => {
  return gulp.src('./sass/**/*.scss')
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('./dist/styles'))
})

/* -------------------
Browser sync watch files and server start
--------------------- */
gulp.task('gulp-serve', () => {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
  gulp.watch('*.html', ['reload'])
  gulp.watch('sass/*/*.scss', ['reload'])
  gulp.watch('js/*.js', ['reload'])
})

gulp.task('concat', () => {
  return gulp.src([
    './js/*.js',
    './js/circle/*.js'
  ])
  .pipe(maps.init())
  .pipe(gulpConcat('all.js'))
  .pipe(maps.write('./maps'))
  .pipe(gulp.dest('./dist/scripts'))
  // .pipe(gulp.dest('./maps'))
})

gulp.task('minifyScripts', ['concat'], () => {
  return gulp.src(`${options.directories.scripts}/*.js`)
    .pipe(gulpUglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest(options.directories.scripts))
})

gulp.task('clean', () => {
  return gulp.src(`${options.directories.build}/*`, {read: false})
    .pipe(clean())
})

gulp.task('images', () => {
  gulp.src('images/*')
      .pipe(imagemin())
      .pipe(gulp.dest(options.directories.images))
})

gulp.task('build', ['clean', 'scripts', 'styles', 'images'])

gulp.task('scripts', ['concat', 'minifyScripts'])

gulp.task('default', () => {
  gulp.start('gulp-serve')
})

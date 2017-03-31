'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const gulpConcat = require('gulp-concat')
const gulpUglify = require('gulp-uglify')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const maps = require('gulp-sourcemaps')
const clean = require('gulp-clean')
const imagemin = require('gulp-imagemin')
const eslint = require('gulp-eslint')

const options = {
  buildDir: {
    build: `./dist`,
    scripts: `./dist/scripts`,
    styles: `./dist/styles`,
    images: `./dist/content`
  }
}

/*  -------------------
Styles tasks
--------------------- */

gulp.task('styles', () => {
  return gulp.src('./sass/**/*.scss')
    .pipe(maps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('all.min.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('./dist/styles'))
})

/*  -------------------
  Server and browsersync
--------------------- */

gulp.task('serve', ['build'], () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })
})

gulp.task('watch', ['serve'], () => {
  gulp.watch('*.html', ['reload'])
  gulp.watch('sass/*/*.scss', ['reload'])
  gulp.watch('js/*.js', ['reload'])
})

// build sass and scripts, then reload the page
gulp.task('reload', ['styles', 'scripts'], (done) => {
  browserSync.reload()
  done()
})

/*  -------------------
Scripts tasks
--------------------- */

gulp.task('scripts', ['concatScripts', 'minifyScripts'])

gulp.task('concatScripts', () => {
  return gulp.src([
    './js/*.js',
    './js/circle/*.js'
  ])
  .pipe(maps.init())
  .pipe(gulpConcat('all.min.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('./dist/scripts'))
})

gulp.task('lintScripts', ['concatScripts'], () => {
  return gulp.src('./js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
})

gulp.task('minifyScripts', ['lintScripts'], () => {
  return gulp.src(`${options.buildDir.scripts}/*.js`)
    .pipe(gulpUglify())
    .pipe(gulp.dest(options.buildDir.scripts))
})

/*  -------------------
Image tasks
--------------------- */

gulp.task('images', () => {
  return gulp.src('./images/*')
      .pipe(imagemin())
      .pipe(gulp.dest('./dist/content'))
})

/*  -------------------
Project management tasks
--------------------- */

gulp.task('build', ['clean'], () => {
  gulp.start('images')
  gulp.start('scripts')
  gulp.start('styles')
  gulp.src('index.html')
      .pipe(gulp.dest('./dist/'))
  gulp.src('icons/*')
      .pipe(gulp.dest('./dist/icons'))
})

gulp.task('clean', () => {
  return gulp.src(`${options.buildDir.build}/*`, {read: false})
    .pipe(clean())
})

gulp.task('default', () => {
  gulp.start('build')
})

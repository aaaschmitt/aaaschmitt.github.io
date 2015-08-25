var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    react = require('gulp-react'),
    htmlreplace = require('gulp-html-replace'),
    rename = require('gulp-rename'),
    order = require('gulp-order'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    del = require('del'),
    runseq = require('run-sequence');

var main_components = ['bower_components/react/react.js', 'src/main-jsx/**.jsx'],
    loading_components = ['bower_components/jquery-2.1.4.min/index.js', 'src/loading-js/**.js'],
    html_files = ['index.html'],
    css_files = ['src/css/**.less', 'src/css/**.css'],
    assets = ['assets/*'],
    jekyll_assets = ['jekyll/**/*'];

var path = {
  HOME: 'index.html',
  README: 'README.md',
  HTML: html_files,
  MAIN: main_components,
  LOADING: loading_components,
  CSS: css_files,
  ASSETS: assets,
  JEKYLL: jekyll_assets,

  ALL: main_components.concat(html_files, loading_components, css_files, assets, jekyll_assets),

  JS_MAIN_MINIFIED_OUT: 'build.min.js',
  JS_LOADING_OUT: 'loading.min.js',
  CSS_MINIFIED_OUT: 'build.min.css',

  DEST_SRC: 'dist/src',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

/*************
 * DEV BUILD *
 *************/

//clean out dist directory
gulp.task('clean', function(cb) {
  del([
    'dist/**/*'
  ], cb);
});

//compile .jsx to .js
//compile .less to .css
gulp.task('compile', function(){
  gulp.src(path.MAIN)
    .pipe(react())
    .pipe(rename(function(path) {
    	path.extname = ".js"
    }))
    .pipe(gulp.dest(path.DEST_SRC + '/main-js'));

  gulp.src(path.CSS)
    .pipe(less())
    .pipe(rename(function(path) {
      path.extname = ".css"
    }))
    .pipe(gulp.dest(path.DEST_SRC + '/css'));
});

//copy html, jekyll, pure js, and assets to dist
gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
  gulp.src(path.JEKYLL)
    .pipe(gulp.dest(path.DEST));
  gulp.src(path.ASSETS)
    .pipe(gulp.dest(path.DEST + '/assets'));
  gulp.src(path.LOADING)
    .pipe(gulp.dest(path.DEST_SRC + '/loading-js'));
});

//watch all my files for changes for dev build
gulp.task('watch', function(){
  gulp.watch(path.ALL, ['compile', 'copy']);
});
gulp.task('default', function(cb) { runseq('clean', ['compile', 'copy', 'watch'], cb) });


/********************
 * PRODUCTION BUILD *
 ********************/

//concat and minify
gulp.task('build', function(){
  gulp.src(path.MAIN)
    .pipe(react())
    .pipe(order([
      'bower_components/**/*.js',
      'src/main-jsx/**.jsx'
    ], {base: '.'}))
    .pipe(concat(path.JS_MAIN_MINIFIED_OUT))
    .pipe(uglify())
    .pipe(gulp.dest(path.DEST_BUILD));

  gulp.src(path.LOADING)
  .pipe(order([
      'bower_components/**/*.js',
      'src/loading-js/**.js'
    ], {base: '.'}))
  .pipe(concat(path.JS_LOADING_OUT))
  .pipe(uglify())
  .pipe(gulp.dest(path.DEST_BUILD));

  gulp.src(path.CSS)
    .pipe(less())
    .pipe(concat(path.CSS_MINIFIED_OUT))
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.DEST_BUILD));
});

//replace dev scripts and copy index, assets, and README
gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.JS_MAIN_MINIFIED_OUT,
      'css' : 'build/' + path.CSS_MINIFIED_OUT,
      'loading' : 'build/' + path.JS_LOADING_OUT
    }))
    .pipe(gulp.dest(path.DEST));

  gulp.src(path.ASSETS)
    .pipe(gulp.dest(path.DEST + '/assets'))

  gulp.src(path.README)
    .pipe(gulp.dest(path.DEST));
});

//production build
gulp.task('production', ['replaceHTML', 'build']);
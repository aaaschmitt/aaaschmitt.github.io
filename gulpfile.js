var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');
var rename = require('gulp-rename');
var order = require('gulp-order');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

var loading_components = ['bower_components/jquery-2.1.4.min/index.js', 'src/loading-js/**.js'],
    main_components = ['bower_components/react/react.js', 'src/main-jsx/**.jsx'],
    html_files = ['index.html'],
    css_files = ['src/css/**.less', 'src/css/**.css'],
    assets = ['assets/*'];

var path = {
  HOME: 'index.html',
  README: 'README.md',
  HTML: html_files,
  MAIN: main_components,
  LOADING: loading_components,
  CSS: css_files,
  ASSETS: assets,
  ALL: main_components.concat(html_files.concat(loading_components.concat(css_files.concat(assets)))),

  JS_MAIN_MINIFIED_OUT: 'build.min.js',
  JS_LOADING_OUT: 'loading.min.js',
  CSS_MINIFIED_OUT: 'build.min.css',

  DEST_SRC: 'dist/src',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

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

//copy index.html over to dist 
//copy bower over to dist
gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
  gulp.src(path.ASSETS)
    .pipe(gulp.dest(path.DEST + '/assets'));
  gulp.src(path.LOADING)
    .pipe(gulp.dest(path.DEST_SRC + '/loading-js'));
});

//watch all my files for changes
gulp.task('watch', function(){
  gulp.watch(path.ALL, ['compile', 'copy']);
});
gulp.task('default', ['watch', 'compile', 'copy']);

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
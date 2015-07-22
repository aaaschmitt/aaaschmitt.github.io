var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');
var rename = require('gulp-rename');
var order = require('gulp-order');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

var path = {
  HTML: 'index.html',
  README: 'README.md',
  ALL: ['bower_components/jquery-2.1.4.min/index.js', 'bower_components/react/react.min.js', 'src/**.jsx', 'index.html', 'src/css/**.less'],
  BOWER: ['bower_components/jquery-2.1.4.min/index.js', 'bower_components/react/react.min.js'],
  JSX: ['src/**.jsx'],
  LESS: ['src/css/**.less'],
  SCRIPT: ['bower_components/jquery-2.1.4.min/index.js', 'bower_components/react/react.min.js', 'src/**.jsx'],
  JS_MINIFIED_OUT: 'build.min.js',
  CSS_MINIFIED_OUT: 'build.min.css',
  DEST_SRC: 'dist/src',
  DEST_BOWER: 'dist/bower_components',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

//compile .jsx to .js
//compile .less to .css
gulp.task('compile', function(){
  gulp.src(path.JSX)
    .pipe(react())
    .pipe(rename(function(path) {
    	path.extname = ".js"
    }))
    .pipe(gulp.dest(path.DEST_SRC));

  gulp.src(path.LESS)
    .pipe(less())
    .pipe(rename(function(path) {
      path.extname = ".css"
    }))
    .pipe(gulp.dest(path.DEST_SRC + '/css'));
});

//copy index.html over to dist
gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
  gulp.src(path.BOWER)
    .pipe(gulp.dest(path.DEST_BOWER));
});

//watch all my files for changes
gulp.task('watch', function(){
  gulp.watch(path.ALL, ['compile', 'copy']);
});
gulp.task('default', ['watch', 'compile', 'copy']);

//concat and minify
gulp.task('build', function(){
  gulp.src(path.SCRIPT)
    .pipe(react())
    .pipe(order([
      'bower_components/**/*.js',
      'src/**.jsx'
    ], {base: '.'}))
    .pipe(concat(path.JS_MINIFIED_OUT))
    .pipe(uglify())
    .pipe(gulp.dest(path.DEST_BUILD));

  gulp.src(path.LESS)
    .pipe(less())
    .pipe(concat(path.CSS_MINIFIED_OUT))
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.DEST_BUILD));
});

//replace dev scripts and copy index and README
gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.JS_MINIFIED_OUT,
      'css' : 'build/' + path.CSS_MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));

  gulp.src(path.README)
    .pipe(gulp.dest(path.DEST));
});

//production build
gulp.task('production', ['replaceHTML', 'build']);
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');
var rename = require('gulp-rename');
var order = require('gulp-order');

var path = {
  HTML: 'index.html',
  README: 'README.md',
  ALL: ['bower_components/jquery-2.1.4.min/index.js', 'bower_components/jquery-2.1.4.min/index.js', 'src/**.jsx', 'index.html'],
  BOWER: ['bower_components/jquery-2.1.4.min/jquery-2.1.4.min.js', 'bower_components/react/react.min.js'],
  JSX: ['src/**.jsx'],
  SCRIPT: ['bower_components/jquery-2.1.4.min/jquery-2.1.4.min.js', 'bower_components/react/react.min.js', 'src/**.jsx'],
  MINIFIED_OUT: 'build.min.js',
  DEST_SRC: 'dist/src',
  DEST_BOWER: 'dist/bower_components',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

//compile .jsx and change to .js
gulp.task('transform', function(){
  gulp.src(path.JSX)
    .pipe(react())
    .pipe(rename(function(path) {
    	path.extname = ".js"
    }))
    .pipe(gulp.dest(path.DEST_SRC));
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
  gulp.watch(path.ALL, ['transform', 'copy']);
});
gulp.task('default', ['watch', 'transform', 'copy']);

//concat and minify
gulp.task('build', function(){
  gulp.src(path.SCRIPT)
    .pipe(react())
    .pipe(order([
      'bower_components/**/*.js',
      'src/**.jsx'
    ], {base: '.'}))
    .pipe(concat(path.MINIFIED_OUT))
    .pipe(uglify())
    .pipe(gulp.dest(path.DEST_BUILD));
});

//replace dev scripts and copy index and README
gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));

  gulp.src(path.README)
    .pipe(gulp.dest(path.DEST));
});

//production build
gulp.task('production', ['replaceHTML', 'build']);
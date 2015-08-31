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

    //these go into every page, need a dev version and a production build version
var main_js_dev = ['bower_components/react/react.js', 'bower_components/jquery/dist/jquery.js', 
                  'src/main-jsx/**.jsx'],
    main_files_build = ['bower_components/react/react.min.js', 'bower_components/jquery/dist/jquery.min.js', 
                  'src/main-jsx/**.jsx', 'src/main-css/**.css'],
    main_less = [ 'src/main-less/**.css', 'src/main-less/**.less'],

    //assets just get moved to a new folder in the build out
    assets = ['src/assets/*'],

    //need to copy over jekyll files and folders
    jekyll_config = ['src/jekyll/Gemfile', 'src/jekyll/Gemfile.lock', 'src/jekyll/_config.yml'],
    jekyll_html = ['src/jekyll/_includes/**.html', 'src/jekyll/_posts/**.html', 'src/jekyll/_layouts/**.html', 
                      'src/jekyll/Resume/**.html', 'src/jekyll/DataViz/**.html', 'src/jekyll/Guides/**.html'];

var path = {
  HOME: 'index.html',
  README: 'README.md',
  ASSETS: assets,
  JEKYLL_C: jekyll_config,
  JEKYLL_HTML: jekyll_html,

  JS_OUT: 'build.min.js',
  CSS_OUT: 'build.min.css',

  DEST_SRC: 'dist/src',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

//keep track of what files need to go in each page
var pageFileMap = {
    'Home': { 
            js: ['src/jekyll/Home/jsx/**.jsx'], 
            less: ['src/jekyll/Home/less/**.less', 'src/jekyll/Home/less/**.css'], 
            PAGE_OUT: path.DEST
        },
    'Resume': { 
                js: ['bower_components/three.js/build/three.min.js', 'src/jekyll/Resume/jsx/**.jsx'], 
                less: ['src/jekyll/Resume/less/**.less', 'src/jekyll/Resume/less/**.css'], 
                PAGE_OUT: path.DEST + '/Resume'
            },
    'DataViz': { 
                js: [], 
                less: [],
                PAGE_OUT: path.DEST + '/DataViz'
            },
    'Guides': { 
                js: [], 
                less: [], 
                PAGE_OUT: path.DEST + '/Guides'
            }
}

function getAllOtherFiles(pageFileMap) {
    var result = [];
    for (var pageName in pageFileMap) {
        if (pageFileMap.hasOwnProperty(pageName)) {
            var pageProps = pageFileMap[pageName];
            result.push.apply(result, pageProps.js); 
            result.push.apply(result, pageProps.less);  
        }
    }
    return result;
}

//Figure out all of the files to watch
path.ALL = ['index.html'].concat(main_js_dev, main_less, jekyll_config, jekyll_html, assets, getAllOtherFiles(pageFileMap));

console.log(path.ALL);

/*************
 * DEV BUILD *
 *************/

//clean out dist directory
gulp.task('clean', function(cb) {
  del([
    'dist/**/*'
  ], cb);
});

//copy html, jekyll, pure js, and assets to dist
gulp.task('copy', function(){
  gulp.src(path.HOME)
    .pipe(gulp.dest(path.DEST));
  gulp.src(path.JEKYLL_C)
    .pipe(gulp.dest(path.DEST));
  gulp.src(path.JEKYLL_HTML, {base: 'src/jekyll'})
    .pipe(gulp.dest(path.DEST))
  gulp.src(path.ASSETS)
    .pipe(gulp.dest(path.DEST + '/assets'));
});

//compile .jsx to .js
//compile .less to .css
//do it for each file
gulp.task('compile-dev', function() {
    for (var pageName in pageFileMap) {
        if (pageFileMap.hasOwnProperty(pageName)) {
            var pageProps = pageFileMap[pageName];

            gulp.src(main_js_dev.concat(pageProps.js))
                .pipe(react())
                .pipe(order([
                  'bower_components/**/*.js',
                  '**/**.jsx'
                ], {base: '.'}))
                .pipe(concat(path.JS_OUT))
                .pipe(gulp.dest(pageProps.PAGE_OUT));

            gulp.src(pageProps.less.concat(main_less))
                .pipe(less())
                .pipe(concat(path.CSS_OUT))
                .pipe(gulp.dest(pageProps.PAGE_OUT));
        }
    }
});

//watch all my files for changes for dev build
gulp.task('watch', function(){
  gulp.watch(path.ALL, ['copy', 'compile-dev']);
});
gulp.task('default', function(cb) { runseq('clean', [ 'copy', 'compile-dev', 'watch'], cb) });


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

  gulp.src(path.CSS)
    .pipe(less())
    .pipe(concat(path.CSS_MINIFIED_OUT))
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.DEST_BUILD));
});

//replace dev scripts and copy index, assets, jekyll files/folders, and README
gulp.task('replaceHTML', function(){

  gulp.src(path.JEKYLL_F,  {base: 'jekyll'})
    .pipe(htmlreplace({
      'js': 'build/' + path.JS_MAIN_MINIFIED_OUT,
      'css' : 'build/' + path.CSS_MINIFIED_OUT,
    }))
    .pipe(gulp.dest(path.DEST));

  gulp.src(path.HOME)
    .pipe(gulp.dest(path.DEST));

  gulp.src(path.JEKYLL_C)
    .pipe(gulp.dest(path.DEST));


  gulp.src(path.ASSETS)
    .pipe(gulp.dest(path.DEST + '/assets'))

  gulp.src(path.README)
    .pipe(gulp.dest(path.DEST));
});

//production build
gulp.task('production', ['replaceHTML', 'build']);
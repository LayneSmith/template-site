const gulp = require('gulp');
const babelify = require('babelify');
const browsersync = require('browser-sync').create();
const browserify = require('browserify');
const gulpif = require('gulp-if');
const log = require('gulplog');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const $ = require('gulp-load-plugins')(); // Refer to plugins using camelcase like '$.imagemin()'


// Declare fille tree
const tree = {
  html: {
    src: 'src/*.html',
    dist: 'dist/',
  },
  images: {
    src: 'src/images/*',
    dist: 'dist/images',
  },
  js: {
    src: 'src/js/*.js',
    dist: 'dist/js',
  },
  css: {
    src: 'src/scss/*.scss',
    dist: 'dist/css',
  },
};


// BROWSERSYNC
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './dist/',
    },
    port: 3000,
  });
  done();
}


// BROWSERSYNC RELOAD
function browserSyncReload(done) {
  browsersync.reload();
  done();
}


// CLEAR DIST
function clear() {
  return gulp
    .src('dist')
    .pipe($.clean());
}


// HTML FUNCTION
function html() {
  return gulp
    .src(tree.html.src)
    .pipe($.plumber())
    .pipe(gulp.dest(tree.html.dist));
}


// IMAGE FUNCTION
function images() {
  return gulp
    .src(tree.images.src)
    .pipe($.plumber())
    .pipe($.newer('./dist/images'))
    .pipe($.imagemin())
    .pipe(gulp.dest(tree.images.dist));
}


// JS FUNCTION
function js() {
  const b = browserify({
    entries: 'src/js/scripts.js',
    debug: true,
  });

  return b
    .transform(babelify, { presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(source('scripts.js'))
    .pipe(buffer())
    .pipe(gulpif($.options.has('prod'), $.stripDebug()))
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.rename({ extname: '.min.js' }))
    .pipe($.uglify())
    .on('error', log.error)
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(tree.js.dist));
}


function scss() {
  return gulp
    .src(tree.css.src)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 3 versions', '> 0.5%'],
    }))
    .pipe($.cssnano())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(tree.css.dist));
}


function watchFiles() {
  gulp.watch('./src/scss/*', gulp.series(scss, browserSyncReload));
  gulp.watch('./src/js/*', gulp.series(js, browserSyncReload));
  gulp.watch('./src/images/*', gulp.series(images, browserSyncReload));
  gulp.watch('./src/*.html', gulp.series(html, browserSyncReload));
}


// Default task
gulp.task('default', gulp.series(clear, gulp.parallel(html, images, js, scss), gulp.parallel(watchFiles, browserSync)));


// Add AWS publish here
gulp.task('publish', gulp.series(clear, gulp.parallel(html, images, js, scss)));

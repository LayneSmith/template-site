// Load Gulp stuff
const { src, dest, task, watch, series, parallel } = require('gulp');

// CSS related plugins
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// JS related plugins
const uglify = require('gulp-uglify');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const stripDebug = require('gulp-strip-debug');

// Utility plugins
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const options = require('gulp-options');
const gulpif = require('gulp-if');

// Browers related plugins
const browserSync = require('browser-sync' ).create();

const jsSRC = './src/js/';
const jsFront = 'scripts.js';
const jsFiles = [ jsFront ];
const jsURL = './dist/js/';

// Sources and Destinations
const paths = {
  styles: {
    src: 'src/sass/*.scss',
    dest: 'dist/css/',
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/',
  },
  images: {
    src: 'src/images/*',
    dest: 'dist/images/',
  },
  js: {
    src: 'src/js/',
    dest: 'dist/js/',
  },
};

// Tasks
function browserSyncCall() {
  browserSync.init({
    server: {
      baseDir: './dist/',
    },
    browser: 'google chrome',
    notify: false,
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function css(done) {
  src([paths.styles.src])
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
    }))
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({ browsers: ['last 2 versions', '> 5%', 'Firefox ESR'] }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
  done();
}

function js(done) {
  jsFiles.map((entry) => {
    return browserify({
      entries: [paths.js.src + entry],
    })
      .transform(babelify, { presets: ['@babel/preset-env'] })
      .bundle()
      .pipe(source(entry))
      .pipe(rename({ extname: '.min.js' }))
      .pipe(buffer())
      .pipe(gulpif(options.has('production'), stripDebug()))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(dest(paths.js.dest))
      .pipe(browserSync.stream());
  });
  done();
}

function triggerPlumber(srcFile, destFile) {
  return src(srcFile)
    .pipe(plumber())
    .pipe(dest(destFile));
}

function images() {
  return triggerPlumber(paths.images.src, paths.images.dest);
}

function html() {
  return triggerPlumber(paths.html.src, paths.html.dest);
}

function watchFiles() {
  watch(paths.styles.src, series(css, reload));
  watch(paths.js.src, series(js, reload));
  watch(paths.images.src, series(images, reload));
  watch(paths.html.src, series(html, reload));
  src(`${paths.js.dest}scripts.min.js`)
    .pipe(notify({ message: 'Gulp is Watching, Happy Coding!' }));
}

// Initial load
task('css', css);
task('js', js);
task('images', images);
task('html', html);
task('default', parallel(css, js, images, html));
task('watch', parallel(browserSyncCall, watchFiles));

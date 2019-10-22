'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    browserSync = require('browser-sync'),
    path = require('path'),
    exec = require('child_process').exec,
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps');

const SASS_SOURCES = [
    'src/**/*.scss'
];
const SASS_INCLUDE_PATHS = [
    path.join(__dirname, '/node_modules/')
];
const NODE_SASS_OPTIONS = {
    includePaths: SASS_INCLUDE_PATHS,
    outputStyle: "expanded",
    precision: 6
};
const AUTOPREFIXER_OPTIONS = {
    browsers: ['last 2 versions'],
    cascade: false
};
const STATIC_FILES = [
    'src/static/*.html',
    'src/static/*.pdf',
    'src/static/*.css',
    'src/static/*.csv',
];
const FILES_TO_WATCH = [
    '**/*.rst',
    '**/*.html',
    '**/*.tmpl',
    'files/*'
];
const JS_FROM_NODE_MODULES = [
    'node_modules/bootstrap/dist/js/*',
    'node_modules/jquery/dist/*'
];

gulp.task('styles', function () {
    gulp.src(SASS_SOURCES)
        .pipe(sourcemaps.init())
        .pipe(sass(NODE_SASS_OPTIONS).on('error', sass.logError))
        .pipe(autoprefixer(AUTOPREFIXER_OPTIONS))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('files/'))
        .pipe(browserSync.stream());
});

gulp.task('assets-js', function () {
    gulp.src('src/js/*.js')
        .pipe(gulp.dest('files/js/'))
        .pipe(browserSync.stream());
});

gulp.task('assets-js-from-node', function () {
    gulp.src(JS_FROM_NODE_MODULES)
        .pipe(gulp.dest('files/js/'))
        .pipe(browserSync.stream());
});

gulp.task('assets-fonts', function () {
    gulp.src('src/fonts/*')
        .pipe(gulp.dest('files/fonts/'));
});

gulp.task('assets', function () {
    gulp.src(STATIC_FILES)
        .pipe(gulp.dest('files/static/'))
        .pipe(browserSync.stream());
});

// Copy over old placeholder assets
gulp.task('assets-old-css', function () {
    gulp.src('src/static/old/css/*')
        .pipe(gulp.dest('files/static/old/css/'))
        .pipe(browserSync.stream());
});

gulp.task('assets-old-js', function () {
    gulp.src('src/static/old/js/*')
        .pipe(gulp.dest('files/static/old/js/'))
        .pipe(browserSync.stream());
});

gulp.task('assets-old-img', function () {
    gulp.src('src/static/old/img/*')
        .pipe(gulp.dest('files/static/old/img/'))
        .pipe(browserSync.stream());
});

gulp.task('assets-old-html', function () {
    gulp.src('src/static/old/*')
        .pipe(gulp.dest('files/static/old/'))
        .pipe(browserSync.stream());
});

gulp.task('assets-old-pdf', function () {  // Yes, this is copied twice
    gulp.src('src/static/*.pdf')
        .pipe(gulp.dest('files/static/old/'))
        .pipe(browserSync.stream());
});

gulp.task('nikola-build', function (cb) {
    exec('nikola build', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('nikola-clean', function (cb) {
    exec('nikola clean', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('build', [
    'styles',
    'assets',
    // 'assets-js',
    'assets-fonts',
    
    'assets-js-from-node',

    'assets-old-css',
    'assets-old-js',
    'assets-old-img',
    'assets-old-html',
    'assets-old-pdf',

    // 'nikola-build'
]);

gulp.task('clean', ['nikola-clean'], function () {
    del(['files/**']);
});

gulp.task('start', ['build'], function () {

    browserSync({
        server: {
            baseDir: 'output/'
        }
    });

    gulp.watch(SASS_SOURCES, ['styles']);
    // gulp.watch(FILES_TO_WATCH, ['nikola-build']);
});

gulp.task('default', ['build']);

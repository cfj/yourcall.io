var path = require("path");
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var connect = require('gulp-connect');
var fileinclude = require('gulp-file-include');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
    sass: 'src/css',
    js: 'src/js',
    dist: 'dist',
    html: 'src/partials',
    index: 'src/index.html'
};

var filesToMove = [
    './src/images/*.*',
    './src/*.*'
];

gulp.task('copy', function() {
    return gulp.src(filesToMove, { base: './' })
    .pipe(gulp.dest(paths.dist));
});

gulp.task('libscripts', function() {
    return gulp.src(path.join(paths.js, 'lib/*.js'))
    .pipe(gulp.dest(path.join(paths.dist, 'js/lib')));
});

gulp.task('scripts', ['libscripts'] ,function() {
    return gulp.src([path.join(paths.js, '/*.js'), '!/lib/*.js'])
    .pipe(concat('all.min.js'))
    .pipe(ngAnnotate({
        'single_quotes': true,
        'sourcemap': true
    }))
    .pipe(uglify())
    .pipe(gulp.dest(path.join(paths.dist, 'js')));
});

gulp.task('index', function() {
    return gulp.src(paths.index)
    .pipe(minifyhtml({
        conditionals: true
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('html', function() {
    return gulp.src(path.join(paths.html, '/**/*.html'))
    .pipe(minifyhtml())
    .pipe(gulp.dest(path.join(paths.dist, 'partials')));
});

gulp.task('sass', function() {
    return gulp.src(path.join(paths.sass, '*.scss'))
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', '> 1%', 'ie 8', 'ie 9'))
    .pipe(minifycss())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(path.join(paths.dist, 'css')));
});

gulp.task('watch', function() {
    gulp.watch(path.join(paths.js, '/**/*.js'), ['scripts']);

    gulp.watch(path.join(paths.sass, '*.scss'), ['sass']);

    gulp.watch(path.join(paths.html, '**/*.html'), ['html']);

    gulp.watch('src/index.html', ['index']);
});

gulp.task('default', ['html', 'sass', 'scripts', 'watch'], function() {

});
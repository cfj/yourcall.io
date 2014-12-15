var path = require("path");
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var wrap = require('gulp-wrap');

var paths = {
    sass: 'src/css',
    js: 'src/js',
    dist: 'dist',
    html: 'src/partials',
    index: 'src/index.html',
    images: 'src/images'
};

gulp.task('images', function() {
    return gulp.src(path.join(paths.images, '*.*'))
    .pipe(gulp.dest(path.join(paths.dist, 'images')));
});

gulp.task('scripts', function() {
    return gulp.src([path.join(paths.js, '/**/*.js'), '!src/js/lib/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('all.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(wrap('(function(){\'use strict\';<%= contents %>})();'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.join(paths.dist, 'js')));
});

gulp.task('distscripts', ['libscripts'], function() {
   return gulp.src([path.join(paths.js, '/**/*.js'), '!src/js/lib/*.js'])
   .pipe(concat('all.min.js'))
   .pipe(ngAnnotate())
   .pipe(uglify())
   .pipe(gulp.dest(path.join(paths.dist, 'js'))); 
});

gulp.task('index', function() {
    return gulp.src(paths.index)
    .pipe(minifyhtml({
        conditionals: true,
        empty: true
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('html', ['index'], function() {
    return gulp.src(path.join(paths.html, '/**/*.html'))
    .pipe(minifyhtml({
        empty: true
    }))
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

gulp.task('default', ['html', 'sass', 'scripts', 'watch'], function() {});
gulp.task('dist', ['html', 'sass', 'distscripts'], function() {})
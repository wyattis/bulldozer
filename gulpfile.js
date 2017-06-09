"use strict";
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const webpack = require('webpack-stream');


gulp.task('copy', function(){
    
    gulp.src(['src/static/**/*', '!**/*.{scss,sass}'])
        .pipe(gulp.dest('static'));
    
});


gulp.task('webpack', function(){
    
    return gulp.src('src/static/js/bulldozer.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('static/js'));
        
});

gulp.task('sass', function(){
    
    gulp.src('src/static/**/*.{scss,sass}')
        .pipe(sass())
        .pipe(concat('bulldozer.css'))
        .pipe(gulp.dest('static/css'));
    
});


gulp.task('watch', function(){
    
    gulp.watch('src/**/*', ['build']);
    
});


gulp.task('build', ['copy', 'sass']);
gulp.task('default', ['build', 'watch']);
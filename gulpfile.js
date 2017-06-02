"use strict";
let gulp = require('gulp');
let sass = require('gulp-sass');
let concat = require('gulp-concat');


gulp.task('copy', function(){
    
    gulp.src(['src/static/**/*', '!**/*.{scss,sass}'])
        .pipe(gulp.dest('static'));
    
});


gulp.task('sass', function(){
    
    gulp.src('src/static/**/*.{scss,sass}')
        .pipe(sass())
        .pipe(concat('minesweeper.css'))
        .pipe(gulp.dest('static/css'));
    
})


gulp.task('build', ['copy', 'sass']);
gulp.task('default', ['build']);
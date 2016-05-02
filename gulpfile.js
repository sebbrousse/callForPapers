/*
 * Copyright (c) 2016 BreizhCamp
 * [http://breizhcamp.org]
 *
 * This file is part of CFP.io.
 *
 * CFP.io is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    livereload = require('gulp-livereload'),
//imagemin = require('gulp-imagemin'),
    ngAnnotate = require('gulp-ng-annotate'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    rev = require('gulp-rev'),
    connect = require('gulp-connect'),
    proxy = require('proxy-middleware'),
    url = require('url'),
    es = require('event-stream'),
    flatten = require('gulp-flatten'),
    replace = require('gulp-replace'),
    less = require('gulp-less'),
    path = require('path'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps');

/*var KarmaServer = require('karma').Server,
 karmaConfigFile = __dirname + '/karma.conf.js';*/

var devPort = 3000;

var yeoman = {
    app: 'src/main/static/app/',
    dist: 'target/classes/static/app/'
};

var middlewareDef = function() {

    function configureProxy(path) {
        var appBaseUrl = 'http://127.0.0.1:8080',
            options = url.parse(appBaseUrl + path);
        options.route = path;
        return proxy(options);
    }

    return [
        configureProxy('/api'),
        configureProxy('/auth'),
        configureProxy('/_ah')
    ];
};

gulp.task('clean', function() {
    del.sync([yeoman.dist]);
});

gulp.task('test', function() {
    /* new KarmaServer({
     configFile: karmaConfigFile,
     singleRun: true
     }).start();*/
});

gulp.task('tdd', function() {
    /* new KarmaServer({
     configFile: karmaConfigFile
     }).start();*/
});

gulp.task('copy', function() {
    return gulp.src([
            yeoman.app + '*.{ico,png,txt}',
            yeoman.app + '{403,404}.html',
            yeoman.app + 'images/{,*/}*.{gif,webp,png,jpg}',
            yeoman.app + 'lib/**/*'
        ], {base: yeoman.app})
        .pipe(gulp.dest(yeoman.dist));
});

gulp.task('images', function() {
    /* return gulp.src(yeoman.app + 'images/!**').
     pipe(imagemin({optimizationLevel: 5})).
     pipe(gulp.dest(yeoman.dist + 'images'));*/
});

gulp.task('less', function() {
    return gulp.src([yeoman.app + 'styles/app.less', yeoman.app + 'styles/vendor.less'])
        .pipe(less())
        .pipe(gulp.dest(yeoman.dist + 'styles'));
});

gulp.task('lint', function() {
    return gulp.src([
            yeoman.app + 'scripts/**/*.js',
            '!' + yeoman.app + 'scripts/directives/angular-language-picker.templates.js',
            '!' + yeoman.app + 'scripts/directives/tags-input.js',
            '!' + yeoman.app + 'scripts/modules/satellizer*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('fonts', function() {
    return gulp.src(yeoman.app + 'bower_components/**/fonts/*.{woff,woff2,svg,ttf,eot}')
        .pipe(flatten())
        .pipe(gulp.dest(yeoman.dist + 'fonts/'));
});

gulp.task('serve', ['watch', 'tdd', 'lint'], function() {
    connect.server(
        {
            root: [yeoman.app, yeoman.dist],
            port: devPort,
            livereload: true,
            middleware: middlewareDef
        }
    );
});

gulp.task('watch', ['fonts', 'less'], function() {
    livereload.listen();

    var excludedGlob = '!' + yeoman.app + '{bower_components,bower_components/**}';

    gulp.watch([yeoman.app + '**/*.js', excludedGlob], ['lint']).on('change', livereload.changed);
    gulp.watch([yeoman.app + '**/*.html', excludedGlob]).on('change', livereload.changed);
    gulp.watch([yeoman.app + '**/*.less', excludedGlob], ['less']);
    gulp.watch([yeoman.dist + 'styles/*.css']).on('change', livereload.changed);
});

gulp.task('watch:spring', ['fonts', 'less'], function() {

    var excludedGlob = '!' + yeoman.app + '{bower_components,bower_components/**}';

    gulp.watch([yeoman.app + '**/*.js', excludedGlob], ['lint']);
    gulp.watch([yeoman.app + '**/*.less', excludedGlob], ['less']);
});

gulp.task('serve:dist', ['build'], function() {
    connect.server(
        {
            root: [yeoman.dist],
            port: devPort,
            //livereload: true,
            middleware: middlewareDef
        }
    );
});

gulp.task('build', ['usemin']);

gulp.task('usemin', ['images', 'copy', 'fonts', 'less'], function() {

        var minifyHtmlOptions = {empty: true, conditionals: true, loose: true};

        return es.merge(
            gulp.src(yeoman.app + 'index.html')
                .pipe(usemin({
                    vendor_css: ['concat', rev()],
                    app_css: [autoprefixer(), 'concat', rev()],
                    html: [minifyHtml(minifyHtmlOptions)],
                    ie_js: [sourcemaps.init(), uglify(), 'concat', rev(), sourcemaps.write('./')],
                    vendor_js: [sourcemaps.init(), uglify(), 'concat', rev(), sourcemaps.write('./')],
                    modules_js: [sourcemaps.init(), ngAnnotate(), uglify(), 'concat', rev(), sourcemaps.write('./')], // some 3rd party libs need ngAnnotate
                    app_js: [sourcemaps.init(), ngAnnotate(), uglify(), 'concat', rev(), sourcemaps.write('./')]
                })),
            // minify all HTML files in yeoman.app sub-dirs except bower_components
            gulp.src(yeoman.app + '!(bower_components)/{*,**/*}.html')
                .pipe(minifyHtml(minifyHtmlOptions))
        ).pipe(gulp.dest(yeoman.dist));
    }
);

gulp.task('default', ['build']);

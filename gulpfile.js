// PACKAGES //
var gulp = require('gulp');
var sass = require('gulp-sass');
var toc = require('gulp-doctoc');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var exec = require('child_process').exec;

// MONGO //
// only kill mongo if it was used
var usedMongo = false;

// require only one ctrl+c to exit
process.once('SIGINT', function(){
    if (usedMongo) {
        console.log('\nshutting down mongod...');
        exec('pgrep mongod | xargs kill; kill ' + process.pid);
    } else {
        exec('kill ' + process.pid);
    }
});

// call mongod to start mongo database
var startMongo = function () {
    usedMongo = true;
    exec('mongod');
}

// APP SCRIPTS //
// start the database
gulp.task('startdb', function () {
    startMongo();
});

// run node on the server file
gulp.task('runserver', ['startdb'], function () {
    nodemon({script: 'bin/www'});
});

// UPDATING //
// install npm dependencies
gulp.task('install', function () {
    exec('npm install');
});

// copy files from node_modules to lib folder
gulp.task('copylib', function () {
    // angular
    gulp.src('node_modules/angular/angular.min.js')
        .pipe(gulp.dest('client/assets/lib'));
    gulp.src('node_modules/angular/angular.min.js.map')
        .pipe(gulp.dest('client/assets/lib'));
    // angular-route
    gulp.src('node_modules/angular-route/angular-route.min.js')
        .pipe(gulp.dest('client/assets/lib'));
    gulp.src('node_modules/angular-route/angular-route.min.js.map')
        .pipe(gulp.dest('client/assets/lib'));
    // jquery
    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('client/assets/lib'));
    // semantic-ui
    gulp.src('node_modules/semantic-ui-css/semantic.min.js')
        .pipe(gulp.dest('client/assets/lib'));
    gulp.src('node_modules/semantic-ui-css/semantic.min.css')
        .pipe(gulp.dest('client/assets/lib'));
    // sweetlalert
    gulp.src('node_modules/sweetalert/dist/sweetalert.min.js')
        .pipe(gulp.dest('client/assets/lib'));
    gulp.src('node_modules/sweetalert/dist/sweetalert.css')
        .pipe(gulp.dest('client/assets/lib'));
});

// run npm update and copy frontend files to lib folder
gulp.task('update', ['install', 'copylib']);



// DEV ENVIRONMENT //

// compile sass files into compressed css file
gulp.task('js', function () {
    gulp.src('client/app/**/*.js')
    .pipe(concat('projx.min.js'))
    .pipe(gulp.dest('client/assets/js/'));
});

gulp.task('css', function () {
    gulp.src('client/app/**/*.scss')
        .pipe(concat('projx.min.css'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('client/assets/css/'));
});

gulp.task('md', function () {
    gulp.src('README.md')
        .pipe(toc())
        .pipe(gulp.dest('./'));
})

// watch for file changes while developing
gulp.task('watch', function () {
    gulp.watch('client/app/**/*.js', ['js']);
    gulp.watch('client/app/**/*.scss', ['css']);
    gulp.watch('README.md', ['md']);
});

// start watching for file changes and run server
gulp.task('dev', ['js', 'css', 'md', 'watch', 'runserver']);

// DEFAULT //
// set default to dev
gulp.task('default', ['dev']);

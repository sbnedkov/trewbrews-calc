var spawn = require('child_process').spawn;

var gulp = require('gulp');
var server = require( 'gulp-develop-server' );
var bower = require('gulp-bower');

gulp.task('watch-src', function () {
    return gulp.watch(['src/**/*.js', 'public/**/*.js', 'views/**/*.hbs'], ['restart-server']);
});

gulp.task('dev', ['watch-src', 'start-server']);

gulp.task('prod', ['bower'], function () {
    var server = spawn('node', ['./main.js']);

    server.stdout.on('data', function (data) {
        process.stdout.write(data.toString());
    });

    server.stderr.on('data', function (data) {
        process.stderr.write(data.toString());
    });

    server.on('close', function (code) {
        console.log('server process exited with code ' + code);
    });

    return server;
});

gulp.task('start-server', function (cb) {
    server.listen({
        path: './main.js'
    });

    cb(null);
});

gulp.task('restart-server', function (cb) {
    server.listen({
        path: './main.js'
    }, function (err) {
        if (err) {
            server.restart();
        }
        cb();
    });
});

gulp.task('bower', function (cb) {
    return runBower(cb);
});

function runBower () {
    return bower();
}

process.env.NODE_ENV = 'production';

var gulp   = require( 'gulp' ),
    server = require( 'gulp-develop-server' ),
    bs     = require( 'browser-sync' );
 
var options = {
    server: {
        path: './server.js',
        execArgv: [ '--harmony' ]
    },
    bs: {
        proxy: 'http://localhost:8080'
    }
};
 
var pathFile = [
    './server.js',
    './config/*.js',
    './modules/**/server/controllers/*.js',
    './modules/**/server/models/*.js',
    './modules/**/server/routes/*.js',
    './modules/**/client/views/*.html'
];
 
gulp.task( 'server:start', function() {
    server.listen( options.server, function( error ) {
        if( ! error ) bs( options.bs );
    });
});
 
// If server scripts change, restart the server and then browser-reload. 
gulp.task( 'server:restart', function() {
    server.restart( function( error ) {
        if( ! error ) bs.reload();
    });
});
 
gulp.task( 'default', [ 'server:start' ], function() {
    gulp.watch( pathFile, [ 'server:restart' ] );
});
'use strict';

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
var flash = require('connect-flash');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');
var socketio = require('socket.io');

var config = require('./config/database.js');

// configuration ===============================================================
var port = process.env.PORT || config.port[app.settings.env];

var mongooseRedisCache = require("mongoose-redis-cache");
mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
  }
});

mongooseRedisCache(mongoose, {
	host: "localhost",
	port: "6379",
	// pass: "redisPass"
	// options: "redisOptions"
});

require('./config/passport')(passport); // pass passport for configuration

// use 'static' middleware
app.use(bodyParser.json());
app.use(multipartMiddleware);
app.use(express.static(path.join(__dirname, 'modules')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', './');

// required for passport
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  httpOnly: true, // httpOnly prevents browser JavaScript from accessing cookies.
  secure: true, // secure ensures cookies are only used over HTTPS
  ephemeral: false // ephemeral deletes the cookie when the browser is closed.
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Attach Socket.io
var server = http.createServer(app);
var io = socketio.listen(server);
app.set('socketio', io);
app.set('server', server);

// controllers ======================================================================
var EditProfileController = require('./modules/users/server/controllers/edit.profile.server.controller');
var ArticleController = require('./modules/articles/server/controllers/article.server.controller');

// routes ======================================================================
require('./modules/core/server/routes/routes.js')(app, passport, multipartMiddleware, ArticleController, EditProfileController);

// launch ======================================================================
// app.listen(port);
app.get('server').listen(port);
module.exports = app;
console.log('The magic happens on port ' + port);
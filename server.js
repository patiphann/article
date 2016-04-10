'use strict';

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var apiRoutes = express.Router(); 
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
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

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
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
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
  secret: config.secret,
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

// create token
var tokenKey = jwt.sign({ foo: 'bar' }, config.secret);

// routes ======================================================================
// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

require('./modules/core/server/routes/routes.js')(app, passport, apiRoutes, multipartMiddleware, ArticleController, EditProfileController);

// launch ======================================================================
// app.listen(port);
app.get('server').listen(port);
module.exports = app;
console.log('The magic happens on port ' + port);
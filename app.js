var express = require('express');
var request = require('request');
var favicon = require('serve-favicon');
var logger = require('morgan');
var path = require('path');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var spotifyStrategy = require(__dirname + '/models/spotify').getPassportStrategy();
var UserManager = require(__dirname + '/models/userManager');


// Passport session setup.
passport.serializeUser(function(user, done) {
	done(null, user.spotifyId);
});

passport.deserializeUser(function(spotifyId, done) {
	UserManager.find(spotifyId, function(err, user) {
		console.log('app.js...');
		done(err, user);
	});
});

passport.use(spotifyStrategy);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({
	secret: 'whatever',
	saveUninitialized: true,
	resave: true,
}));

// Initialize Passport. Also use passport.session() middleware, to support persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// set global variables
app.locals.title = 'Critify';

var index = require('./routes/index');
var login = require('./routes/login');
var users = require('./routes/users');

app.use(function(req, res, next) {
	console.log('logged in:', req.isAuthenticated());
	console.log(req.user);

	next();
});

app.use('/', index);
app.use('/login', login);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	res.render();
	//next(err);
});

// error handlers
// development error handler - will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}
// production error handler - no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


app.listen(8888);


module.exports = app;
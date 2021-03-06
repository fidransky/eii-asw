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
var mongoose = require('mongoose');
var User = mongoose.model('User');


// Passport session setup.
passport.serializeUser(function(user, done) {
	done(null, user.spotify_id);
});

passport.deserializeUser(function(spotifyId, done) {
	User.findOne({ spotify_id: spotifyId }, function(err, user) {
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
app.locals.appName = 'Critify!';
app.locals.title = '';

var index = require('./routes/index');
var log = require('./routes/login');
var spotifyItem = require('./routes/spotify-item');
var users = require('./routes/users');
var reviews = require('./routes/review');

app.use(function(req, res, next) {
	console.log('logged in:', req.isAuthenticated());
	//console.log('user:', req.user);

	app.locals.loggedUser = req.user;

	next();
});

app.use('/', index);
app.use('/log', log);
app.use('/artist', spotifyItem);
app.use('/album', spotifyItem);
app.use('/track', spotifyItem);
app.use('/:userId', users);
app.use('/:userId/review', reviews);

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


app.listen(process.env.PORT || 3000, function() {
	console.log('app is running');
});


module.exports = app;
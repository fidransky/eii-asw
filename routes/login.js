var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var passport = require('passport');
var Spotify = require(__dirname + '/../models/spotify');
var UserManager = require(__dirname + '/../models/userManager');


// GET login page
router.get('/', passport.authenticate('spotify', {
	scope: ['user-read-private', 'user-read-email'],
}), function(req, res) {
	// The request will be redirected to spotify for authentication, so this function will not be called.
});

// GET login callback
router.get('/callback', passport.authenticate('spotify', {
	failureRedirect: '/login',
}), function(req, res) {
	res.redirect('/users/detail');
});

// GET logout
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// GET refresh token
router.get('/refresh_token', function(req, res) {
	// requesting access token from refresh token
	Spotify.getRefreshToken(req.query.refresh_token, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var access_token = body.access_token;
			res.send({
				'access_token': access_token
			});
		}
	});
});


module.exports = router;
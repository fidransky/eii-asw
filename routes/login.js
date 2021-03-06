var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var passport = require('passport');
var spotify = require(__dirname + '/../models/spotify');

// GET login page
router.get('/in', passport.authenticate('spotify', {
	scope: ['user-read-private', 'user-read-email'],
}), function(req, res) {
	// The request will be redirected to spotify for authentication, so this function will not be called.
});

// GET login callback
router.get('/callback', passport.authenticate('spotify', {
	failureRedirect: '/log/in',
}), function(req, res) {
	res.redirect('/'+ req.user.spotify_id);
});

// GET logout
router.get('/out', function(req, res) {
	req.logout();
	res.redirect('/');
});

// GET refresh token
router.get('/refresh_token', function(req, res) {
	// requesting access token from refresh token
	spotify.getRefreshToken(req.query.refresh_token, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var access_token = body.access_token;
			res.send({
				'access_token': access_token
			});
		}
	});
});

module.exports = router;
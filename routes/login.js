var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var spotify = require(__dirname + '/../models/spotify');
var passport = require('passport');
var spotifyStrategy = require(__dirname + '/../models/spotify').getPassportStrategy();


// Passport session setup.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(spotifyStrategy);


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
/*
var generateRandomString = function(length) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

var stateKey = 'spotify_auth_state';
*/


/* GET login page. */
router.get('/', passport.authenticate('spotify', {
	scope: ['user-read-private', 'user-read-email'],
}), function(req, res) {
	// The request will be redirected to spotify for authentication, so this function will not be called.
});
/*
router.get('/', function(req, res) {
	var state = generateRandomString(16);
	res.cookie(stateKey, state);

	res.redirect(spotify.getLoginUrl(state));
});
*/

/* GET login callback. */
router.get('/callback', passport.authenticate('spotify', {
	failureRedirect: '/login',
}), function(req, res) {
	res.redirect('/users/detail');
});
/*
router.get('/callback', function(req, res) {
	// your application requests refresh and access tokens after checking the state parameter
	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		console.log('state_mismatch');
	} else {
		res.clearCookie(stateKey);

		spotify.getAccessToken(code, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				var access_token = body.access_token,
					refresh_token = body.refresh_token;

				// we can also pass the token to the browser to make requests from there
				res.redirect('/users/detail?' + querystring.stringify({
					access_token: access_token,
					refresh_token: refresh_token
				}));

			} else {
				console.log('invalid_token');
			}
		});
	}
});
*/

/* GET logout */
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

/* GET refresh token. */
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
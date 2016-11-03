var express = require('express');
var router = express.Router();
var UserManager = require(__dirname + '/../models/userManager'); 
var Spotify = require(__dirname + '/../models/spotify');
var spotifyApi = Spotify.getApi();


router.get('/detail', Spotify.ensureAuthenticated, function(req, res, next) {
	/*
	spotifyApi.setAccessToken(req.query.access_token);

	spotifyApi.getMe().then(function(data) {
		console.log(data.body);
	}, function(err) {
		console.log('error:', err);
	});
	*/

	res.render('user-detail', {
		user: req.user,
	});
});


module.exports = router;
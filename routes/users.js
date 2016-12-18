var express = require('express');
var router = express.Router();
var UserManager = require(__dirname + '/../models/userManager'); 
var Spotify = require(__dirname + '/../models/spotify');
var spotifyApi = Spotify.getApi();

/* GET user detail page. */
router.get('/detail', Spotify.ensureAuthenticated, function(req, res, next) {
	spotifyApi.setAccessToken(req.user.access_token);

	res.render('user-detail');
});

module.exports = router;
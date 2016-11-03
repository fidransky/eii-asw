var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var UserManager = require(__dirname + '/../models/userManager'); 
var Spotify = require(__dirname + '/../models/spotify');
var spotifyApi = Spotify.getApi();


router.get('/', function(req, res, next) {
	var dbFqn = 'mongodb://localhost:27017/myDB';

	(function() {
		mongoose.connect(dbFqn);

		var db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function() {
			// we're connected!
		});
	})();

	MongoClient.connect(dbFqn, function(err, db) {
		if (!err) {
			// we're connected!

			var collection = db.collection('user');

			db.close();
		}
	});

	res.render('users');
});

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
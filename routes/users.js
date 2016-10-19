var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var dbFqn = 'mongodb://localhost:27017/myDB';


router.get('/', function(req, res) {
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


module.exports = router;
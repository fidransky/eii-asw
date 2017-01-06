var express = require('express');
var router = express.Router();
var async = require('async');
var spotify = require(__dirname + '/../models/spotify');
var spotifyApi = spotify.getApi();
var mongoose = require('mongoose');
var Review = mongoose.model('Review');

/* GET spotify item. */
router.get('/:spotifyItemId', function(req, res, next) {
	var spotifyItemType = req.baseUrl.substring(1);

	var spotifyItemPromise;
	switch (spotifyItemType) {
		case 'artist':
			spotifyItemPromise = spotifyApi.getArtist(req.params.spotifyItemId);
			break;
		case 'album':
			spotifyItemPromise = spotifyApi.getAlbum(req.params.spotifyItemId);
			break;
		case 'track':
			spotifyItemPromise = spotifyApi.getTrack(req.params.spotifyItemId);
			break;
	}

	async.parallel({
		spotifyItem: function(cb) {
			return spotifyItemPromise.then(function(data) {
				return cb(null, data.body);
			});
		},
		reviews: function(cb) {
			return Review.find({
				spotify_item_type: spotifyItemType,
				spotify_item_id: req.params.spotifyItemId,
			}, cb);
		},

	}, function(err, results) {
		console.log(results.spotifyItem);

		res.render('spotify-item', results);
	});
});

module.exports = router;
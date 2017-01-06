var express = require('express');
var router = express.Router({mergeParams: true});
var async = require('async');
var spotify = require(__dirname + '/../models/spotify');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Review = mongoose.model('Review');

/* GET user detail page. */
router.get('/', function(req, res, next) {
	async.parallel({
		user: function(cb) {
			return User.findOne({ spotify_id: req.params.userId }, cb);
		},
		reviews: function(cb) {
			return Review.find({
				author: req.params.userId,
			}).sort({
				created_at: -1,
			}).exec(cb);
		},

	}, function(err, results) {
		res.render('user-detail', results);
	});
});

module.exports = router;
var express = require('express');
var router = express.Router({mergeParams: true});
var async = require('async');
var spotify = require(__dirname + '/../models/spotify');
var mongoose = require('mongoose');
var UserManager = require(__dirname + '/../models/userManager');
var Review = mongoose.model('Review');

/* GET user detail page. */
router.get('/', function(req, res, next) {
	async.parallel({
		user: function(cb) {
			return UserManager.find(req.params.userId, function(err, users) {
				return cb(err, users[0]);
			});
		},
		reviews: function(cb) {
			return Review.find({
				author: req.params.userId,
			}, cb);
		},
	}, function(err, results) {
		res.render('user-detail', results);
	});
});

module.exports = router;
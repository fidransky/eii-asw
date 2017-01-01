var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Review = mongoose.model('Review');

/* GET home page. */
router.get('/', function(req, res, next) {
	Review.find({}, function(err, reviews) {
		if (err) throw err;

		res.render('review/list', {
			user: {
				username: 'none',
			},
			reviews: reviews,
		});
	});
});

module.exports = router;
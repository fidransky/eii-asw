var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Review = mongoose.model('Review');

/* GET home page. */
router.get('/', function(req, res, next) {
	Review.find({}).sort({
		created_at: -1,
	}).limit(8).exec(function(err, reviews) {
		if (err) throw err;

		res.render('index', {
			reviews: reviews,
		});
	});
});

module.exports = router;
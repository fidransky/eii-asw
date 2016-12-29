var express = require('express');
var router = express.Router();
var db = require(__dirname + '/../models/db');
var mongoose = require('mongoose');
var Review = mongoose.model('Review');
var Comment = mongoose.model('Comment');
var Reaction = mongoose.model('Reaction');
var spotify = require(__dirname + '/../models/spotify');
var spotifyApi = spotify.getApi();

/* GET list reviews page. */
router.get('/', function(req, res, next) {
	Review.find({}, function(err, reviews) {
		if (err) throw err;

		res.render('review/list', {
			reviews: reviews,
		});
	});
});

/* GET view review page. */
router.get('/view/:id', function(req, res, next) {
	Review.find({
		_id: req.params.id,
	}, function(err, reviews) {
		if (err) throw err;

		console.log(reviews[0]);

		res.render('review/view', {
			review: reviews[0],
		});
	});
});

router.post('/view/:id', function(req, res, next) {
	var commentData = req.body;

	var comment = Comment({
		author: commentData.author,
		title: commentData.title,
		text: commentData.text,
		reactions: [],
	});

	Review.find({
		_id: req.params.id,
	}, function(err, reviews) {
		if (err) throw err;

		var review = reviews[0];
		review.comments.push(comment);

		// save the review
		review.save(function(err) {
			if (err) throw err;
		});

		res.redirect('/review/view/' + review.id);
	});
});

/* GET add review page. */
router.get('/add', function(req, res, next) {
	var term = req.query.q;
	if (term) {
		var types = req.query.types;

		spotifyApi.search(term, types, { limit: 4 }).then(function(data) {
			console.log(data.body.albums.items);

			res.render('review/add', {
				types: types,
				term: term,
				data: data.body,
			});
		});

	} else {
		res.render('review/add', {
			types: [],
			term: '',
			data: [],
		});
	}
});

router.post('/add', function(req, res, next) {
	var reviewData = req.body;

	var review = Review({
		spotify_item_type: reviewData.spotifyItemType,
		spotify_item_id: reviewData.spotifyItemId,
		title: reviewData.title,
		text: reviewData.text,
		rating: reviewData.rating,
		comments: [],
		reactions: [],
	});

	// save the review
	review.save(function(err) {
		if (err) throw err;
	});

	res.redirect('/review');
});

module.exports = router;
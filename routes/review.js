var express = require('express');
var router = express.Router({mergeParams: true});
var async = require('async');
var spotify = require(__dirname + '/../models/spotify');
var spotifyApi = spotify.getApi();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Review = mongoose.model('Review');
var Comment = mongoose.model('Comment');
var Reaction = mongoose.model('Reaction');

var countReactions = function(entity) {
	entity.reactions.ups = entity.reactions.filter(function(reaction) {
		return reaction.type === 'up';
	}).length;
	entity.reactions.downs = entity.reactions.filter(function(reaction) {
		return reaction.type === 'down';
	}).length;

	return entity;
};

/* GET list reviews page. */
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
		res.render('review/list', results);
	});
});

/* GET add review page. */
router.get('/add', spotify.ensureAuthenticated, function(req, res, next) {
	var term = req.query.q;

	if (term) {
		var types = req.query.types;

		spotifyApi.search(term, types, { limit: 4 }).then(function(data) {
			var selectedType;
			if (data.body.artists && data.body.artists.total > 0) {
				selectedType = 'artists';
			} else if (data.body.albums && data.body.albums.total > 0) {
				selectedType = 'albums';
			} else if (data.body.tracks && data.body.tracks.total > 0) {
				selectedType = 'tracks';
			}

			res.render('review/add', {
				types: types,
				term: term,
				selectedType: selectedType,
				data: data.body,
			});
		});

	} else {
		res.render('review/add', {
			types: [],
			term: '',
			selectedType: null,
			data: null,
		});
	}
});

router.post('/add', spotify.ensureAuthenticated, function(req, res, next) {
	var reviewData = req.body;

	var review = Review({
		author: req.user ? req.user.spotify_id : null,
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

	res.redirect('/'+ req.user.spotify_id +'/reviews');
});

/* GET view review page. */
router.get('/:id', function(req, res, next) {
	Review.find({
		_id: req.params.id,
	}, function(err, reviews) {
		if (err) throw err;

		var review = reviews[0];
		review = countReactions(review);
		review.comments = review.comments.map(function(comment) {
			return countReactions(comment);
		});

		res.render('review/view', {
			review: review,
		});
	});
});

router.post('/:id/reaction', spotify.ensureAuthenticated, function(req, res, next) {
	var reactionData = req.body;

	var reaction = Reaction({
		author: req.user ? req.user.spotify_id : null,
		type: reactionData.type,
	});

	Review.find({
		_id: req.params.id,
	}, function(err, reviews) {
		if (err) throw err;

		var review = reviews[0];
		review.reactions.push(reaction);

		// save the review
		review.save(function(err) {
			if (err) throw err;
		});

		res.redirect('/'+ req.user.spotify_id +'/reviews/' + review.id + '#reactions');
	});
});

router.post('/:id/comment', spotify.ensureAuthenticated, function(req, res, next) {
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

		res.redirect('/'+ req.user.spotify_id +'/reviews/' + review.id + '#comments');
	});
});

router.post('/:id/comment/:commentId/reaction', spotify.ensureAuthenticated, function(req, res, next) {
	var reactionData = req.body;

	var reaction = Reaction({
		author: req.user ? req.user.spotify_id : null,
		type: reactionData.type,
	});

	Review.find({
		_id: req.params.id,
	}, function(err, reviews) {
		if (err) throw err;

		var review = reviews[0];
		var comment = review.comments.id(req.params.commentId);
		comment.reactions.push(reaction);

		// save the comment
		review.save(function(err) {
			if (err) throw err;
		});

		res.redirect('/'+ req.user.spotify_id +'/reviews/' + req.params.id + '#comments');
	});
});

module.exports = router;
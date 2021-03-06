var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = require(__dirname + '/comment').schema;
var reactionSchema = require(__dirname + '/reaction').schema;

// review schema
var reviewSchema = new Schema({
	author: { type: String, required: true },
	spotify_item_type: { type: String, required: true },
	spotify_item_id: { type: String, required: true },
	title: String,
	text: { type: String, required: true },
	rating: { type: Number, min: 1, max: 5 },
	created_at: Date,
	comments: [commentSchema],
	reactions: [reactionSchema],
});

reviewSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();

	// if created_at doesn't exist, add to that field
	if (!this.created_at) {
		this.created_at = currentDate;
	}

	next();
});

// create model
var Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
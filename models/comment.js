var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reactionSchema = require(__dirname + '/reaction').schema;

// comment schema
var commentSchema = new Schema({
	author: { type: String, required: true },
	title: String,
	text: { type: String, required: true },
	created_at: Date,
	reactions: [reactionSchema],
});

commentSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();

	// if created_at doesn't exist, add to that field
	if (!this.created_at) {
		this.created_at = currentDate;
	}

	next();
});

// create model
var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
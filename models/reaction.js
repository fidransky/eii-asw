var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// reaction schema
var reactionSchema = new Schema({
	author: { type: String, required: true },
	type: { type: String, required: true },
	created_at: Date,
});

reactionSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();

	// if created_at doesn't exist, add to that field
	if (!this.created_at) {
		this.created_at = currentDate;
	}

	next();
});

// create model
var Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;
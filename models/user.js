var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// user schema
var userSchema = new Schema({
	spotifyId: { type: String, required: true, unique: true },
	created_at: Date,
	updated_at: Date
});

// on every save, add the date
userSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();

	// change the updated_at field to current date
	this.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!this.created_at) {
		this.created_at = currentDate;
	}

	next();
});

// create model
var User = mongoose.model('User', userSchema);


module.exports = User;
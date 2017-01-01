var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reviewSchema = require(__dirname + '/review').schema;

// user schema
var userSchema = new Schema({
	spotify_id: { type: String, required: true, unique: true },
	username: String,
	name: String,
	mail: String,
	profile_url: String,
	country: String,
	access_token: { type: String, required: true },
	created_at: Date,
	updated_at: Date,
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
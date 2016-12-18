require(__dirname + '/db');
var mongoose = require('mongoose');
var User = mongoose.model('User');


var manager = {};

manager.save = function(data) {
	var user = User(data);

	// save the user
	user.save(function(err) {
		if (err) throw err;

		return user;
	});	
};

manager.findOrCreate = function(userData, accessToken, callback) {
	User.find({ spotify_id: userData.id }, function(err, user) {
		if (err || user.length === 0) {
			user = User({
				spotify_id: userData.id,
				username: userData.username,
				name: userData.displayName,
				mail: userData.emails[0].value,
				profile_url: userData.profileUrl,
				country: userData.country,
				access_token: accessToken,
			});

			// save the user
			user.save(function(err) {
				if (err) throw err;
			});
		}

		callback(null, user);
	});
};

// get all the users
manager.findAll = function() {
	User.find({}, function(err, users) {
		if (err) throw err;

		return users;
	});
};

// get user by Spotify ID
manager.find = function(spotifyId, callback) {
	User.find({ spotify_id: spotifyId }, function(err, user) {
		if (err) throw err;

		callback(null, user);
	});
};

// get user by ID
manager.findById = function(id) {
	User.find({ id: id }, function(err, user) {
		if (err) throw err;

		return user;
	});
};

// get user by username
manager.findByUsername = function(username) {
	User.find({ username: username }, function(err, user) {
		if (err) throw err;

		return user;
	});
};

manager.update = function(spotifyId, data) {
	User.findOneAndUpdate({ spotify_id: spotifyId }, data, function(err, user) {
		if (err) throw err;

		return user;
	});
};

manager.delete = function(spotifyId) {
	User.findOneAndRemove({ spotify_id: spotifyId }, function(err, user) {
		if (err) throw err;

		return true;
	});
};


module.exports = manager;
var User = require(__dirname + '/user');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_DSN || 'mongodb://localhost/critify');


var manager = {};

manager.save = function(data) {
	var user = User(data);

	// save the user
	user.save(function(err) {
		if (err) throw err;

		return user;
	});	
};

manager.findOrCreate = function(spotifyId, data, callback) {
	User.find({ spotifyId: spotifyId }, function(err, user) {
		if (err || user.length === 0) {
			user = User({
				spotifyId: spotifyId,
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
	User.find({ spotifyId: spotifyId }, function(err, user) {
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
	User.findOneAndUpdate({ spotifyId: spotifyId }, data, function(err, user) {
		if (err) throw err;

		return user;
	});
};

manager.delete = function(spotifyId) {
	User.findOneAndRemove({ spotifyId: spotifyId }, function(err, user) {
		if (err) throw err;

		return true;
	});
};


module.exports = manager;
var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost/quickDB');


var userTasksSchema = mongoose.Schema({ 
	username: String,
	email: String,
	password: String,
});

var model = {};


model.registerUser = function(userData, cb) {
    //redisUserTask.set(userData.username, userData.email);

	var user = new userTasks(userData);
	user.save(cb);
};

model.loginUser = function(userData, cb) {	
	userTasks.findOne({username: userData.username, password: userData.password}, cb);
};

			
module.exports = {
	getUserTasksModel: function() {
		return connection.model('userTasks', userTasksSchema);
	}
};
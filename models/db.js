var mongoose = require('mongoose');

var dsn = process.env.MONGODB_DSN || 'mongodb://localhost/critify';

// Start connection
mongoose.connect(dsn);
 
// When successfully connected
mongoose.connection.on('connected', function () {  
	console.log('Mongoose default connection open to ' + dsn);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
	console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
	console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {
	mongoose.connection.close(function () { 
		console.log('Mongoose default connection disconnected through app termination'); 
		process.exit(0);
	});
});

// Import schemas
require(__dirname + '/reaction');
require(__dirname + '/comment');
require(__dirname + '/review');
require(__dirname + '/user');

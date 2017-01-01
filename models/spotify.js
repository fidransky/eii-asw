var request = require('request');
var querystring = require('querystring');
var SpotifyWebApi = require('spotify-web-api-node');
var SpotifyStrategy = require(__dirname + '/../node_modules/passport-spotify/lib/passport-spotify/index').Strategy;
var UserManager = require(__dirname + '/userManager');


var scope = 'user-read-private user-read-email';
var client_id = 'd9fcafc0362941b98aca40d58b8cf310';
var client_secret = 'e055dbaa51f54eeba717388d6cad9caa';
var redirect_uri = 'http://localhost:3000/log/callback';


module.exports = {
	getApi: function() {
		return new SpotifyWebApi({
			clientId: client_id,
			clientSecret: client_secret,
			redirectUri: redirect_uri,
		});
	},
	getPassportStrategy: function() {
		return new SpotifyStrategy({
			clientID: client_id,
			clientSecret: client_secret,
			callbackURL: redirect_uri,
		}, function(accessToken, refreshToken, profile, done) {
			UserManager.findOrCreate(profile, accessToken, function(err, user) {
				return done(err, user[0]);
			});
		});
	},
	getLoginUrl: function(state) {
		return 'https://accounts.spotify.com/authorize?' + querystring.stringify({
			response_type: 'code',
			client_id: client_id,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state
		});
	},
	getAccessToken: function(code, callback) {
		request.post({
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: redirect_uri,
				grant_type: 'authorization_code',
			},
			headers: {
				'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
			},
			json: true
		}, callback);
	},
	getRefreshToken: function(refreshToken, callback) {
		request.post({
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
			},
			form: {
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			},
			json: true
		}, callback);
	},
	// Simple route middleware to ensure user is authenticated.
	//   Use this route middleware on any resource that needs to be protected.  If
	//   the request is authenticated (typically via a persistent login session),
	//   the request will proceed. Otherwise, the user will be redirected to the
	//   login page.
	ensureAuthenticated: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}

		res.redirect('/log/in');
	},
};
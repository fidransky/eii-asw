var express = require('express');
var router = express.Router();
var spotify = require(__dirname + '/../models/spotify');
var spotifyApi = spotify.getApi();

/* GET search page. */
router.get('/', spotify.ensureAuthenticated, function(req, res, next) {
	var term = req.query.q;
	if (term) {
		var types = req.query.types;

		spotifyApi.search(term, types, { limit: 4 }).then(function(data) {
			console.log(data.body);

			res.render('search', {
				types: types,
				term: term,
				data: data.body,
			});
		});
	} else {
		res.render('search', {
			types: [],
			term: '',
			data: [],
		});
	}
});

module.exports = router;
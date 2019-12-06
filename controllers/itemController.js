var Item = require('../models/item');
var Category = require('../models/category');

var async = require('async');

exports.index = function(req, res) {
	async.parallel({
		item_count: function(callback) {
			Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
		}
	}, function(err, results) {
		res.render('index', { title: 'Local Library Home', error: err, data: results });
	});
};
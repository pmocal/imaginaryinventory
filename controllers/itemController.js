var Item = require('../models/item');
var Category = require('../models/category');

var async = require('async');

exports.index = function(req, res) {
	async.parallel({
		item_count: function(callback) {
			Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
		},
		category_count: function(callback) {
			Category.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
		},
		items_per_category_count: function(callback) {
			Category.countDocuments({status:'Available'}, callback);
		},
	}, function(err, results) {
		res.render('index', { title: 'Store Overview', error: err, data: results });
	});
};

exports.item_list = function(req, res, next) {
	Item.find()
		.exec(function(err, list_items) {
			if (err) {
				return next(err);
			}
			res.render('item_list', { title: 'Item List', item_list: list_items});
		})
}

//display detail page for a specific author
exports.item_detail = function(req, res, next) {
	Item.findById(req.params.id)
		.exec(function(err, item) {
			if (err) {
				return next(err);
			}
			res.render('item_detail', { title: 'Item Detail', item: item });
		})
};

exports.item_create_get = function(req, res, next) {
	Category.find()
		.exec(function(err, list_categories) {
			if (err) { return next(err) };
			res.render('item_form', { title: 'Create item', categories: list_categories });
		})
};
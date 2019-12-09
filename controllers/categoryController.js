var async = require('async')
var Category = require('../models/category')
var Item = require('../models/item')

//const validator = require('express-validator');

exports.category_list = function(req, res, next) {
	Category.find()
		.exec(function (err, list_categories) {
			if (err) { return next(err); }
			res.render('category_list', { title: 'Category list', category_list: list_categories})
		});
};

//display detail page for a specific author
exports.category_detail = function(req, res, next) {
	async.parallel({
		category: function(callback) {
			Category.findById(req.params.id)
				.exec(callback)
		},
		categories_items: function(callback) {
			Item.find({ 'category': req.params.id }, 'name description')
			.exec(callback)
		},
	}, function(err, results) {
		if (err) { return next(err); } //error in API usage
		if (results.category==null) {
			var err = new Error('Category not found');
			err.status = 404;
			return next(err);
		}
		res.render('category_detail', { title: 'Category Detail', category: results.category, category_items: results.categories_items});
	});
};

exports.category_create_get = function(req, res, next) {
	res.render('category_form', { title: 'Category Create' });
};
var async = require('async')
var Category = require('./models/category')

var async = require('async');
const validator = require('express-validator');

exports.category_list = function(req, res, next) {
	Category.find()
		.exec(function (err, list_categories) {
			if (err) { return next(err); }
			res.render('category_list', { title: 'Category list', category_list: list_categories})
		});
};
var async = require('async')
var Category = require('../models/category')
var Item = require('../models/item')

const validator = require('express-validator');

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
	res.render('category_form', { title: 'Create Category' });
};

exports.category_create_post = [
	//validate that name field not empty
	validator.body('name', 'Category name required').isLength({ min: 1 }).trim(),
	//sanitize name field
	validator.sanitizeBody('name').escape(),
	//process request after validation & sanitization
	(req, res, next) => {
		//Extract the validation errors from a request
		const errors = validator.validationResult(req);
		//create genre object with escaped & trimmed data
		var category = new Category(
			{ name: req.body.name }
		);

		if (!errors.isEmpty()) {
			//errors, render the form again
			res.render('category_form', { title: 'Create Category', category: category, errors: errors.array()});
			return;
		}
		else {
			//data from form is valid
			//check if genre with same name exists
			Category.findOne({ 'name': req.body.name })
				.exec( function(err, found_category) {
					if (err) { return next(err); }
					if (found_category) {
						//genre exists, redirect to its detail page
						res.redirect(found_category.url);
					}
					else {
						category.save(function (err) {
							if (err) { return next(err); }
							//genre saved, redirect to genre detail
							res.redirect(category.url);
						});
					}
				});
		}
	}
];

exports.category_delete_get = function(req, res, next) {
	async.parallel({
		category: function(callback) {
			Category.findById(req.params.id)
			.exec(callback)
		},
		category_items: function(callback) {
			Item.find({ 'category': req.params.id }, "name description")
			.exec(callback)
		},
	}, function(err, results) {
		if (err) { return next(err); } //error in API usage
		if (results.category==null) {
			var err = new Error('Category not found');
			err.status = 404;
			return next(err);
		}
		res.render('category_delete',
			{ title: 'Category Delete form', category: results.category, category_items: results.category_items });
	});
};

exports.category_delete_post = function(req, res, next) {
	async.parallel({
		category: function(callback) {
			Category.findById(req.params.id)
			.exec(callback)
		},
		category_items: function(callback) {
			Item.find({ 'category' : req.params.id })
			.exec(callback)
		},
	}, function(err, results) {
		if (err) { return next(err); }
		if (results.category == null) {
			var err = new Error('Category not found');
			err.status = 404;
			return next(err);
		} else if (results.category_items.length > 0) {
			var err = new Error('Category has items');
			err.status = 404;
			return next(err);
		} else{
			Category.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
				if (err) { return next(err); }
				// Success - go to author list
				res.redirect('/store/categories');
			})
		}

	});
};

exports.category_delete_get = function(req, res, next) {
	async.parallel({
		category: function(callback) {
			Category.findById(req.params.id)
			.exec(callback)
		},
		category_items: function(callback) {
			Item.find({ 'category': req.params.id }, "name description")
			.exec(callback)
		},
	}, function(err, results) {
		if (err) { return next(err); } //error in API usage
		if (results.category==null) {
			var err = new Error('Category not found');
			err.status = 404;
			return next(err);
		}
		res.render('category_delete',
			{ title: 'Category Delete form', category: results.category, category_items: results.category_items });
	});
};

exports.category_update_get = function(req, res, next) {
	Category.findById(req.params.id)
		.exec(function (err, category){
			if (err) { return next(err); }
			res.render("category_form", { title: "update category", category: category });
		})
}

exports.category_update_post = [
	//validate that name field not empty
	validator.body('name', 'Category name required').isLength({ min: 1 }).trim(),
	//sanitize name field
	validator.sanitizeBody('name').escape(),
	//process request after validation & sanitization
	(req, res, next) => {
		//Extract the validation errors from a request
		const errors = validator.validationResult(req);
		//create genre object with escaped & trimmed data
		var category = new Category(
			{
				name: req.body.name,
				_id:req.params.id
			}
		);

		if (!errors.isEmpty()) {
			//errors, render the form again
			res.render('category_form', { title: 'update Category', category: category, errors: errors.array()});
			return;
		}
		else {
			//data from form is valid
			//check if genre with same name exists
			Category.findOne({ 'name': req.body.name })
				.exec( function(err, found_category) {
					if (err) { return next(err); }
					if (found_category) {
						res.redirect(found_category.url);
					}
					else {
						Category.findByIdAndUpdate(req.params.id, category, {}, function (err, thecategory) {
							if (err) { return next(err); }
							//genre saved, redirect to genre detail
							res.redirect(thecategory.url);
						});
					}
				});
		}
	}
];
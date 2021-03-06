var Item = require('../models/item');
var Category = require('../models/category');
const { check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
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
		res.render('index', { title: 'Overview', error: err, data: results });
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
		.populate('category')
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

exports.item_create_post = [
	// Validate fields.
	check('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
	check('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
	check('price', 'Price must not be empty.').isLength({ min: 1 }).trim(),
	check('numInStock', 'Number in stock must not be empty').isLength({ min: 1 }).trim(),

	// Sanitize fields (using wildcard).
	sanitizeBody('category').escape(),
	sanitizeBody('name').escape(),
	sanitizeBody('description').escape(),
	sanitizeBody('price').escape(),
	sanitizeBody('numInStock').escape(),
	
	// Process request after validation and sanitization.
	(req, res, next) => {
		
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a Book object with escaped and trimmed data.
		var item = new Item(
		  { name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			numInStock: req.body.numInStock
		   });

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render('item_form', { title: 'Create Item', item: item, errors: errors.array() });
		}
		else {
			// Data from form is valid. Save book.
			item.save(function (err) {
				if (err) { return next(err); }
				   //successful - redirect to new book record.
				   res.redirect(item.url);
				});
		}
	}
];

exports.item_delete_get = function(req, res, next) {
	Item.findById(req.params.id)
		.populate('category')
		.exec(function(err, item) {
			if (err) {
				return next(err);
			}
			if (item==null) {
				var err = new Error('Item not found');
				err.status = 404;
				return next(err);
			}
			res.render('item_delete', { title: 'Item Delete', item: item });
		})
}

exports.item_delete_post = function(req, res, next) {
	Item.findByIdAndRemove(req.params.id)
		.exec(function(err, item) {
			if (err) {
				return next(err);
			}
			if (item==null) {
				var err = new Error('Item not found');
				err.status = 404;
				return next(err);
			} else{
			Item.findByIdAndRemove(req.params.id, function deleteItem(err) {
				if (err) { return next(err); }
				res.redirect('/store/items');
			})
		}
		})
}

exports.item_update_get = function(req, res, next) {
	async.parallel({
		item: function(callback) {
			Item.findById(req.params.id, callback);
		},
		list_categories: function(callback) {
			Category.find({}, callback);
		},
	}, function(err, results) {
		if (err) {
			return next(err);
		}
		if (results.item == null) {
			var err = new Error('Item not found');
			err.status = 404;
			return next(err);
		}
		res.render('item_form', { title: 'Item Update', item: results.item, categories: results.list_categories });
	});
}

exports.item_update_post = [
	// Validate fields.
	check('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
	check('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
	check('price', 'Price must not be empty.').isLength({ min: 1 }).trim(),
	check('numInStock', 'Number in stock must not be empty').isLength({ min: 1 }).trim(),

	// Sanitize fields (using wildcard).
	sanitizeBody('category').escape(),
	sanitizeBody('name').escape(),
	sanitizeBody('description').escape(),
	sanitizeBody('price').escape(),
	sanitizeBody('numInStock').escape(),
	
	// Process request after validation and sanitization.
	(req, res, next) => {
		
		// Extract the validation errors from a request.
		const errors = validationResult(req);

		// Create a Book object with escaped and trimmed data.
		var item = new Item(
		  { name: req.body.name,
			description: req.body.description,
			category: req.body.category,
			price: req.body.price,
			numInStock: req.body.numInStock,
			_id: req.params.id
		   });

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render('book_form', { title: 'Create Item', item: item, errors: errors.array() });
		}
		else {
			// Data from form is valid. Save book.
			Item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
				if (err) { return next(err); }
				   //successful - redirect to new book record.
				   res.redirect(theitem.url);
				});
		}
	}
];
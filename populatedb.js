#! /usr/bin/env node

console.log('This script populates your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
		console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
		return
}
*/
var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')

var mongoose = require('mongoose');
const mongoDb = "mongodb+srv://" + process.env.DB_USER + ":" + 
  process.env.DB_PASS + "@" + process.env.DB_HOST + "/express-auth?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var items = [];

function itemCreate(name, description, category, price, numInStock, cb) {

	var item = new Item({
		name: name,
		description: description,
		category: category,
		price: price,
		numInStock: numInStock
	});
			 
	item.save(function (err) {
		if (err) {
			cb(err, null)
			return
		}
		console.log('New Item: ' + item);
		items.push(item)
		cb(null, item)
	}  );
}

function categoryCreate(name, description, cb) {
	var category = new Category({ name: name, description: description });
			 
	category.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New Category: ' + category);
		categories.push(category)
		cb(null, category);
	}   );
}

function createCategories(cb) {
		async.series([
				function(callback) {
					categoryCreate('babyfood', "", callback);
				},
				function(callback) {
					categoryCreate('italian', "", callback);
				},
				function(callback) {
					categoryCreate('householdsupplies', "", callback);
				},
				function(callback) {
					categoryCreate('dairy', "", callback);
				},
				function(callback) {
					categoryCreate('cereal', "", callback);
				}
				],
				// optional callback
				cb);
}


function createItems(cb) {
		async.parallel([
				function(callback) {
					itemCreate('applesauce', "", categories[0], "$2", 5, callback);
				},
				function(callback) {
					itemCreate("pasta", "", categories[1], "$1", 15, callback);
				},
				function(callback) {
					itemCreate('lysol', 'surface cleaner', categories[2], "$0.50", 20, callback);
				},
				function(callback) {
					itemCreate('milk', 'cow milk', categories[3], "$1", 8, callback)
				},
				function(callback) {
					itemCreate('lucky charms', '', categories[4], "$1.50", 1, callback)
				},
				function(callback) {
					itemCreate('cocoa puffs', '', categories[4], "$2.50", 10, callback)
				}
				],
				// optional callback
				cb);
}

async.series([
		createCategories,
		createItems
],
// Optional callback
function(err, results) {
		if (err) {
				console.log('FINAL ERR: '+err);
		}
		else {
				console.log('Items: '+items);
				
		}
		// All done, disconnect from database
		mongoose.connection.close();
});





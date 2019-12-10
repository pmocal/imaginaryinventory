var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema(
	{
		name: {type: String, required: true},
		description: {type: String}
	}
);

CategorySchema
.virtual('url')
.get(function() {
	return '/store/categories/' + this._id;
});

//Export model
module.exports = mongoose.model('Category', CategorySchema);
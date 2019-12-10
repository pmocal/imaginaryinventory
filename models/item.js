var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema(
	{
		name: {type: String, required: true},
		description: {type: String},
		category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
		price: {type: String, required: true},
		numInStock: {type: Number, required: true}
	}
);

ItemSchema
.virtual('url')
.get(function() {
	return '/store/item/' + this._id;
});

//Export model
module.exports = mongoose.model('Item', ItemSchema);
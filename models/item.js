var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    price: {type: String, required: true},
    numInStock: {type: Number, required: true}
  }
);

// Virtual for book's URL
ItemSchema
.virtual('url')
.get(function () {
  return '/store/item/' + this._id;
});

//Export model
module.exports = mongoose.model('Item', ItemSchema);
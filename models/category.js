var Schema = mongoose.Schema;

var CategorySchema = new Schema(
	{
		name: {type: String, required: true},
		description: {type: String, required: true}
	}
);

CategorySchema
.virtual('url')
.get(function() {
	return '/inventory/category/' + this._id;
});

//Export model
module.exports = mongoose.model('Category', CategorySchema);
const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
	name: String,
	images: String,
	price: Number,
	description: String,
	admin: String,
	type: String,
	isFavorite: Boolean,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

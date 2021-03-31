const mongoose = require("mongoose");
const { Schema } = mongoose;

const addOnsSchema = new Schema({
	type: String,
	images: String,
	name: String,
	price: Number,
	admin: String,
});

const AddOn = mongoose.model("AddOn", addOnsSchema);

module.exports = AddOn;

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const User = require("./user.js");

const cartSchema = new Schema({
	orders: Array,
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	status: String,
	totalPrice: Number,
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

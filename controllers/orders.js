// const PendingOrder = require("../schemas/pendingOrder.js");
// const User = require("../schemas/user.js");

// module.exports.addToCart = async (req, res) => {
// 	await PendingOrder.findOne({ _id: req.body.id }, async (err, doc) => {
// 		if (err) throw err;
// 		if (doc) res.send({ msg: "Order already exists" });
// 		if (!doc) {
// 			const newPendingOrder = new PendingOrder({
// 				pendingOrder: req.body.order,
// 				user: req.body.id,
// 			});
// 			await newPendingOrder.save();
// 			res.send("New order is pending");
// 		}
// 	});
// };

// module.exports.cart = async (req, res) => {
// 	const pendingOrders = await PendingOrder.find({ user: req.body.id });
// 	res.send(pendingOrders);
// };

const User = require("../schemas/user.js");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.VERIFICATION_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);

module.exports.login = (req, res, next) => {
	passport.authenticate("local", (err, user) => {
		if (err) throw err;
		if (!user) res.send({ msg: "No user found" });
		else {
			req.logIn(user, (error) => {
				if (error) throw error;
				res.send(req.user);
			});
		}
	})(req, res, next);
};

module.exports.forverification = async (req, res) => {
	await User.findOne({ username: req.body.username }, async (err, doc) => {
		if (err) throw err;
		if (doc) {
			res.send({ msg: "User already exists" });
		} else if (!doc) {
			if (req.body.phoneNumber.startsWith("+63")) {
				console.log("hi");
				await client.verify
					.services(serviceId)
					.verifications.create({ to: req.body.phoneNumber, channel: "sms" })
					.then((verification) => res.send(verification.status));
			} else {
				res.send({ msg: "Please enter a valid phone number." });
			}
		}
	});
};
module.exports.verify = async (req, res) => {
	await client.verify
		.services(serviceId)
		.verificationChecks.create({
			to: req.body.phoneNumber,
			code: req.body.verificationCode,
		})
		.then((verification_check) => res.send(verification_check.status));
};
module.exports.register = async (req, res) => {
	await User.findOne({ username: req.body.username }, async (err, doc) => {
		if (err) throw err;
		if (doc) res.send({ msg: "User already exists" });
		if (!doc) {
			await client.verify
				.services(serviceId)
				.verifications.create({ to: req.body.phoneNumber, channel: "sms" })
				.then((verification) => console.log(verification.status));
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			const newUser = new User({
				username: req.body.username,
				password: hashedPassword,
				phoneNumber: req.body.phoneNumber,
				orders: [],
				lastOrderTime: "",
			});
			await newUser.save();
			res.send({ msg: "User created" });
		}
	});
};

module.exports.checkOut = async (req, res) => {
	await User.findOne({ _id: req.body.id }, async (err, user) => {
		if (user) {
			const date = new Date();
			// const months = [
			// 	"Jan.",
			// 	"Feb.",
			// 	"Mar.",
			// 	"Apr.",
			// 	"May.",
			// 	"Jun.",
			// 	"Jul.",
			// 	"Aug.",
			// 	"Sep.",
			// 	"Oct.",
			// 	"Nov.",
			// 	"Dec.",
			// ];

			const currentMonth = date.getMonth() + 1;
			let currentMinutes = date.getMinutes();
			if (date.getMinutes() < 10) {
				currentMinutes = `0${date.getMinutes()}`;
			}
			const am = { time: "AM" };
			// For heroku timezone adjustment
			let currentHours = date.getHours() + 8;
			if (currentHours > 23) {
				currentHours = currentHours - 24;
			}
			if (currentHours > 12) {
				am.time = "PM";
				currentHours = currentHours - 12;
			}

			//
			// PH Timezone
			// if (currentHours > 12) {
			// 	am.time = "PM";
			// 	currentHours = date.getHours() - 12;
			// }
			//
			console.log(currentHours);
			const currentTime = `${date.getFullYear()}-${currentMonth}-${date.getDate()}-${currentHours}:${currentMinutes} ${
				am.time
			}`;
			let lastOrderTime = currentTime;
			if (user.lastOrderTime < currentTime && user.lastOrderTime !== "") {
				lastOrderTime = user.lastOrderTime;
			}
			console.log(currentTime);
			await user.updateOne({
				orders: [
					...user.orders,
					{
						...req.body.orders,
						status: "Waiting for approval",
						totalPrice: req.body.totalPrice,
						orderTime: currentTime,
					},
				],
				lastOrderTime: lastOrderTime,
			});
			console.log(lastOrderTime);
			await user.save();
			res.send({ ...req.body.orders, status: "Waiting for approval" });
		}
	});
};

module.exports.getUsers = async (req, res) => {
	await User.find({}, async (err, users) => {
		if (users) {
			res.send(users);
		} else {
			res.send({ msg: "No user found" });
		}
	});
};

module.exports.getUser = async (req, res) => {
	await User.findById({ _id: req.body.id }, async (err, user) => {
		if (user) {
			res.send(user);
		} else {
			res.send({ msg: "No user found" });
		}
	});
};
module.exports.confirmDelivery = async (req, res) => {
	await User.findById({ _id: req.body.userId }, async (err, user) => {
		if (user) {
			const newOrders = user.orders.map((order) => {
				const container = { ...order };
				if (req.body.orderId === order._id) {
					container.status = "Delivered";
				}
				return container;
			});
			let orderTimes = [];
			if (user.orders.length > 1) {
				orderTimes = user.orders
					.sort(function(a, b) {
						if (a.orderTime < b.orderTime) {
							return -1;
						} else if (a.orderTime > b.orderTime) {
							return 1;
						} else {
							return 0;
						}
					})
					.map((order) => {
						const container = {};
						container.orderTime = order.orderTime;
						return container;
					})
					.filter((filtered) => {
						return filtered.status !== "Delivered" || "Cancelled";
					});
				user.orders = newOrders;
				user.lastOrderTime = orderTimes[1].orderTime;
				await user.save();
				res.send({ msg: "Order has been delivered" });
			} else {
				user.orders = newOrders;
				user.lastOrderTime = "";
				await user.save();

				res.send({ msg: "Order has been delivered" });
			}
		} else {
			res.send({ msg: "No user found" });
		}
	});
};
module.exports.confirmPreparing = async (req, res) => {
	await User.findById({ _id: req.body.userId }, async (err, user) => {
		if (user) {
			const newOrders = user.orders.map((order) => {
				const container = { ...order };
				if (req.body.orderId === order._id) {
					container.status = "Out for delivery";
				}
				return container;
			});
			console.log(newOrders);
			await user.updateOne({
				orders: newOrders,
			});
			await user.save();
			console.log(user);
			res.send({ msg: "Order is now out for delivery" });
		} else {
			res.send({ msg: "No user found" });
		}
	});
};
module.exports.approveOrder = async (req, res) => {
	await User.findById({ _id: req.body.userId }, async (err, user) => {
		if (user) {
			const newOrders = user.orders.map((order) => {
				const container = { ...order };
				if (req.body.orderId === order._id) {
					container.status = "Order being prepared";
				}
				return container;
			});
			console.log(newOrders);
			await user.updateOne({
				orders: newOrders,
			});
			await user.save();
			console.log(user);
			res.send({ msg: "Order is now being prepared" });
		} else {
			res.send({ msg: "No user found" });
		}
	});
};
module.exports.cancelOrder = async (req, res) => {
	await User.findById({ _id: req.body.userId }, async (err, user) => {
		if (user) {
			const newOrders = user.orders.map((order) => {
				const container = { ...order };
				if (req.body.orderId === order._id) {
					container.status = "Cancelled";
				}
				return container;
			});
			let orderTimes = [];
			if (user.orders.length > 1) {
				orderTimes = user.orders
					.sort(function(a, b) {
						if (a.orderTime < b.orderTime) {
							return -1;
						} else if (a.orderTime > b.orderTime) {
							return 1;
						} else {
							return 0;
						}
					})
					.map((order) => {
						const container = {};
						container.orderTime = order.orderTime;
						return container;
					});
				user.orders = newOrders;
				user.lastOrderTime = orderTimes[1].orderTime;
				await user.save();
			} else {
				user.orders = newOrders;
				user.lastOrderTime = "";
				await user.save();
			}

			res.send({ msg: "Order has been cancelled" });
		} else {
			res.send({ msg: "No user found" });
		}
	});
};

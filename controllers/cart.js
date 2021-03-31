const Cart = require("../schemas/cart.js");
const User = require("../schemas/user.js");

module.exports.addToCart = async (req, res) => {
	await Cart.findOne({ user: req.body.id }, async (err, cart) => {
		const allItems = Object.assign([...req.body.menu, ...req.body.addOns]);
		const menu = [];
		allItems.map((item) => {
			menu.push({
				name: item.name,
				images: item.images,
				qty: 0,
				price: item.price,
			});
		});

		const menuItems = menu.map((item) => {
			const container = { ...item };
			req.body.order.map((order) => {
				if (item.name === order.name) {
					container.qty = container.qty + 1;
					container.price = container.qty * order.price;
				}
			});
			return container;
		});

		const totalOrders = menuItems.filter((filtered) => {
			return filtered.qty > 0;
		});

		if (!cart) {
			const newCart = await new Cart({
				status: req.body.status,
				orders: totalOrders,
				totalPrice: req.body.totalPrice,
				user: req.body.id,
			}).save();
			res.send(newCart);
		}
	});
};

module.exports.updateCart = async (req, res) => {
	await Cart.findOne({ user: req.body.id }, async (err, cart) => {
		const allItems = Object.assign([...req.body.menu, ...req.body.addOns]);
		const menu = [];
		allItems.map((item) => {
			menu.push({
				name: item.name,
				images: item.images,
				qty: 0,
				price: item.price,
			});
		});
		const pastCart = menu.map((item) => {
			const container = { ...item };
			req.body.previousOrders.map((previousOrder) => {
				if (item.name === previousOrder.name) {
					container.qty = previousOrder.qty;
					container.price = previousOrder.qty * item.price;
				}
			});
			return container;
		});

		const updatedCart = pastCart.map((inCart) => {
			const container = { ...inCart };
			req.body.order.map((item) => {
				if (item.name === inCart.name) {
					container.qty++;
					container.price = container.qty * item.price;
				}
			});
			return container;
		});

		const finalCart = updatedCart.filter((filtered) => {
			return filtered.qty > 0;
		});
		const finalPrice = finalCart
			.map((item) => {
				const container = item.price;
				return container;
			})
			.reduce((accumulator, currentValue) => {
				return accumulator + currentValue;
			});
		if (cart) {
			await cart.updateOne({
				totalPrice: finalPrice,
				orders: finalCart,
			});
			await cart.save();
			res.send(cart);
		}
	});
};
module.exports.cart = async (req, res) => {
	await Cart.findOne({ user: req.body.id }, async (err, cart) => {
		if (cart) {
			res.send(cart);
		} else {
			res.send({ msg: "No cart found" });
		}
	});
};

module.exports.updateItems = async (req, res) => {
	await Cart.findOne({ user: req.body.id }, async (err, cart) => {
		const updatedOrders = req.body.items;
		let finalPrice = 0;
		if (updatedOrders.some((el) => el.qty >= 1)) {
			finalPrice = updatedOrders
				.map((item) => {
					const container = item.price;
					return container;
				})
				.reduce((accumulator, currentValue) => {
					return accumulator + currentValue;
				});
		}
		const finalOrders = updatedOrders.filter((filtered) => {
			return filtered.qty !== 0;
		});

		await cart.updateOne({
			orders: finalOrders,
			totalPrice: finalPrice,
		});
		await cart.save();
		res.send(cart);
	});
};

module.exports.deleteCart = async (req, res) => {
	await Cart.findByIdAndDelete(req.params.id, async (err, deleted) => {
		if (err) {
			console.log(deleted);
		} else {
			res.send({ msg: "Cart successfully removed" });
		}
	});
};

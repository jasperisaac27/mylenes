const Product = require("../schemas/product.js");

module.exports.createProduct = async (req, res) => {
	await Product.findOne({ name: req.body.name }, async (err, doc) => {
		if (err) throw err;
		if (doc) res.send({ msg: "Product already exists" });
		if (!doc) {
			if (!req.files) {
				return res.send({ msg: "You are missing an image" });
			}
			const imageFile = req.files.file;
			const imageNums = [];
			const randomNum = Math.ceil(Math.random() * 100000000000000);
			for (
				let rand = randomNum;
				!imageNums.includes(rand);
				imageNums.push(rand)
			) {
				const newImageName = rand.toString() + imageFile.name.toString();
				imageFile.mv(
					`${__dirname}/../public/images/uploads/${newImageName}`,
					async function(error) {
						if (error) {
							res.send({ msg: "There is an error in storing the image" });
						}
						const newProduct = new Product({
							name: req.body.name,
							images: newImageName,
							price: req.body.price,
							description: req.body.description,
							admin: req.body.admin,
							type: req.body.type,
							isFavorite: req.body.isFavorite,
						});
						await newProduct.save();
						res.send({ msg: "Product added" });
					}
				);
			}
		}
	});
};

module.exports.homePage = async (req, res) => {
	const Products = await Product.find({});
	const favorites = Products.filter((product) => {
		return product.isFavorite !== false;
	});
	res.send(favorites);
};
module.exports.menuPage = async (req, res) => {
	const Products = await Product.find({});
	res.send(Products);
};

module.exports.editProductsPage = async (req, res) => {
	const foundProduct = await Product.findById({ _id: req.body.id });
	res.send(foundProduct);
};

module.exports.editProduct = async (req, res) => {
	const foundProduct = await Product.findByIdAndUpdate({ _id: req.body.id });
	if (req.files) {
		const imageFile = req.files.file;
		const imageNums = [];
		const randomNum = Math.ceil(Math.random() * 100000000000000);
		for (
			let rand = randomNum;
			!imageNums.includes(rand);
			imageNums.push(rand)
		) {
			const newImageName = rand.toString() + imageFile.name.toString();
			imageFile.mv(
				`${__dirname}/../public/images/uploads/${newImageName}`,
				async function(error) {
					if (error) {
						res.send({ msg: "There is an error in storing the image" });
					}
					await foundProduct.updateOne(
						{
							name: req.body.name,
							price: req.body.price,
							images: newImageName,
							admin: req.body.admin,
							description: req.body.description,
							type: req.body.type,
							isFavorite: req.body.isFavorite,
						},
						function(err, response) {
							if (errr) {
								res.send({ msg: "Error in updating in database" });
							}
							res.send({ msg: "Successfully edited!" });
						}
					);
				}
			);
			// 	}
			// );
		}
	} else if (!req.files) {
		return res.send({ msg: "You are missing an image" });
	}
};

module.exports.deleteProduct = async (req, res) => {
	await Product.findByIdAndDelete({ _id: req.body.id });
	res.send({ msg: "Item successfully deleted." });
};

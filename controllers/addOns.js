const AddOn = require("../schemas/addOn.js");

module.exports.createAddOn = async (req, res) => {
	await AddOn.findOne({ name: req.body.name }, async (err, doc) => {
		if (err) throw err;
		if (doc) res.send({ msg: "Add-on already exists" });
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
						const newAddOn = new AddOn({
							type: req.body.type,
							images: newImageName,
							name: req.body.name,
							price: req.body.price,
							admin: req.body.admin,
						});
						await newAddOn.save();
						res.send({ msg: "Add-on added" });
					}
				);
			}
		}
	});
};

module.exports.addOnsPage = async (req, res) => {
	await AddOn.find({}, async (err, addOns) => {
		res.send(addOns);
	});
};

module.exports.editAddOnsPage = async (req, res) => {
	const foundAddOn = await AddOn.findById({ _id: req.body.id });
	res.send(foundAddOn);
};

module.exports.editAddOn = async (req, res) => {
	const foundAddOn = await AddOn.findByIdAndUpdate({ _id: req.body.id });
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
					await foundAddOn.updateOne(
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
							if (err) {
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

module.exports.deleteAddOn = async (req, res) => {
	await AddOn.findByIdAndDelete({ _id: req.body.id });
	res.send({ msg: "Item successfully deleted." });
};

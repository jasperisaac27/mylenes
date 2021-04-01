// Imports
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import Axios from "axios";
//----------------End of imports---------------------

const CreateProduct = (props) => {
	const history = useHistory();
	const { currentUser, product, setProduct, showNavbar, setShowNavbar } = props;
	const [loadImage, setLoadImage] = useState(true);
	const [file, setFile] = useState("");
	const { name, price, description, admin, type, isFavorite } = product;
	if (!showNavbar) {
		setShowNavbar(true);
	}

	const handleChange = (e) => {
		const newFile = e.target.files[0];
		setFile(newFile);
		setLoadImage(true);
	};
	const createProduct = async () => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("name", name);
		formData.append("price", price);
		formData.append("description", description);
		formData.append("admin", admin);
		formData.append("type", type);
		formData.append("isFavorite", isFavorite);
		await Axios.post("/createproduct", formData, product)
			.then((res) => {
				if (res.data.msg === "Product added") {
					history.push("/menu");
				} else {
					console.log(res);
				}
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		if (loadImage) {
			setProduct({ ...product, admin: currentUser });
			setLoadImage(false);
		}

		if (product.type === "") {
			setProduct({ ...product, type: "Main" });
		}
	}, [product, loadImage]);

	// if (isLoggedin && currentUser === "admin") {
	return (
		<>
			<div id="addPage" style={{ color: "black" }}>
				<h1>Create a Product:</h1>
				<Form id="createAddOnForm">
					<Form.Group controlId="exampleForm.ControlInput1">
						<Form.Label>Product Name</Form.Label>
						<Form.Control
							type="text"
							name="name"
							onChange={(e) => {
								setProduct({ ...product, name: e.target.value });
							}}
						/>
					</Form.Group>
					<Form.Group>
						<FormControl
							type="file"
							id="exampleFormControlFile1"
							label="Add an Image"
							name="image"
							onChange={handleChange}
						/>
					</Form.Group>
					<label htmlFor="productPrice">Price</label>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text>₱</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							type="text"
							id="productPrice"
							name="price"
							onChange={(e) => {
								setProduct({ ...product, price: e.target.value });
							}}
						/>
					</InputGroup>
					<Form.Group controlId="exampleForm.ControlInput1">
						<Form.Label>Description</Form.Label>
						<Form.Control
							type="text"
							as="textarea"
							name="description"
							onChange={(e) => {
								setProduct({ ...product, description: e.target.value });
							}}
						/>
					</Form.Group>
					<Form.Group controlId="exampleForm.ControlInput1">
						<Form.Label>Type</Form.Label>
						<Form.Control
							type="text"
							as="select"
							name="type"
							onChange={(e) => {
								setProduct({ ...product, type: e.target.value });
							}}
						>
							<option value="Main">Main</option>
							<option value="Sides">Sides</option>
							<option value="Drinks">Drinks</option>
						</Form.Control>
					</Form.Group>
					<Form.Group controlId="exampleForm.ControlInput1">
						<Form.Label>Favorite</Form.Label>
						<Form.Control
							type="text"
							as="select"
							name="isFavorite"
							defaultValue="No"
							onChange={(e) => {
								if (e.target.value === "Yes") {
									setProduct({ ...product, isFavorite: true });
								}
								if (e.target.value === "No") {
									setProduct({ ...product, isFavorite: false });
								}
							}}
						>
							<option value="No">No</option>
							<option value="Yes">Yes</option>
						</Form.Control>
					</Form.Group>

					<Button variant="success" onClick={createProduct}>
						Add Product
					</Button>
				</Form>
			</div>
		</>
	);
	// } else {
	// 	return <Redirect to="/login"></Redirect>;
	// }
};

export default CreateProduct;

// Imports
import React, { useState, useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import Axios from "axios";
//----------------End of imports---------------------

const EditProduct = (props) => {
	const history = useHistory();
	const {
		currentUser,
		isLoggedin,
		product,
		setProduct,
		showNavbar,
		setShowNavbar,
	} = props;
	const { name, price, description, admin, type, isFavorite } = product;
	const [file, setFile] = useState("");
	const [loadImage, setLoadImage] = useState(false);
	const [load, setLoad] = useState(false);
	const { id } = useParams();
	if (!showNavbar) {
		setShowNavbar(true);
	}

	if (!load) {
		Axios.post("/editproducts", {
			id: id,
		})
			.then((res) => {
				setProduct({ ...product, ...res.data });
				setLoad(true);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const handleChange = (e) => {
		const newFile = e.target.files[0];
		setFile(newFile);
		setLoadImage(true);
	};

	const editProduct = async () => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("name", name);
		formData.append("price", price);
		formData.append("description", description);
		formData.append("admin", admin);
		formData.append("type", type);
		formData.append("isFavorite", isFavorite);
		formData.append("id", id);
		await Axios.put("/editproduct", formData)
			.then((res) => {
				if (res.data.msg) {
					history.push("/menu");
				} else {
					console.log(res);
				}
			})
			.catch((err) => console.log(err));
	};

	const deleteProduct = async () => {
		const result = window.confirm("Proceed to delete?");
		if (result) {
			await Axios.delete("/delete", {
				data: { id: id },
			})
				.then((res) => {
					history.push("/menu");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	useEffect(() => {
		if (loadImage) {
			setProduct({ ...product, admin: currentUser });
			setLoadImage(false);
		}
	}, [product, loadImage]);

	if (isLoggedin && currentUser.username === "admin") {
		return (
			<>
				<div id="editPage" style={{ color: "black" }}>
					<h1>Edit Product:</h1>
					<Form id="editProductForm">
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Product Name</Form.Label>
							<Form.Control
								type="text"
								name="name"
								value={product.name}
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
								value={product.price}
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
								value={product.description}
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
								value={product.type}
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
								value={product.isFavorite === true ? "Yes" : "No"}
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

						<Button className="buttons" variant="success" onClick={editProduct}>
							Confirm Edit
						</Button>
						<Button
							className="buttons"
							variant="danger"
							onClick={deleteProduct}
						>
							Delete Item
						</Button>
					</Form>
				</div>
			</>
		);
	} else {
		return <Redirect to="/login" />;
	}
};

export default EditProduct;

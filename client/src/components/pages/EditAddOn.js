// Imports
import React, { useState, useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import Axios from "axios";
//----------------End of imports---------------------

const EditAddon = (props) => {
	const history = useHistory();
	const {
		currentUser,
		isLoggedin,
		addOn,
		setAddOn,
		showNavbar,
		setShowNavbar,
	} = props;
	const { name, price, description, admin, type } = addOn;
	const [file, setFile] = useState("");
	const [loadImage, setLoadImage] = useState(false);
	const [load, setLoad] = useState(false);
	const { id } = useParams();
	if (!showNavbar) {
		setShowNavbar(true);
	}

	if (!load) {
		Axios.post("/editaddons", {
			id: id,
		})
			.then((res) => {
				setAddOn({ ...addOn, ...res.data });
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

	const editAddOn = async () => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("name", name);
		formData.append("price", price);
		formData.append("description", description);
		formData.append("admin", admin);
		formData.append("type", type);
		formData.append("id", id);
		await Axios.put("/editaddon", formData)
			.then((res) => {
				if (res.data.msg) {
					console.log(res.data.msg);
					history.push("/menu");
				} else {
					console.log(res);
				}
			})
			.catch((err) => console.log(err));
	};

	const deleteAddOn = async () => {
		const result = window.confirm("Proceed to delete?");
		if (result) {
			await Axios.delete("/delete", {
				data: { id: id },
			})
				.then((res) => {
					console.log(res.data.msg);
					history.push("/menu");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	useEffect(() => {
		if (loadImage) {
			setAddOn({ ...addOn, admin: currentUser });
			setLoadImage(false);
		}
	}, [addOn, loadImage]);

	if (isLoggedin && currentUser.username === "admin") {
		return (
			<>
				<div id="editPage" style={{ color: "black" }}>
					<h1>Edit Add-On:</h1>
					<Form id="editAddOnForm">
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Add-On Name</Form.Label>
							<Form.Control
								type="text"
								name="name"
								value={addOn.name}
								onChange={(e) => {
									setAddOn({ ...addOn, name: e.target.value });
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
						<label htmlFor="add-on-price">Price</label>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text>₱</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl
								type="text"
								id="add-on-price"
								name="price"
								value={addOn.price}
								onChange={(e) => {
									setAddOn({ ...addOn, price: e.target.value });
								}}
							/>
						</InputGroup>
						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label>Type</Form.Label>
							<Form.Control
								type="text"
								as="select"
								name="type"
								value={addOn.type}
								onChange={(e) => {
									setAddOn({ ...addOn, type: e.target.value });
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
								value={addOn.isFavorite === true ? "Yes" : "No"}
								onChange={(e) => {
									if (e.target.value === "Yes") {
										setAddOn({ ...addOn, isFavorite: true });
									}
									if (e.target.value === "No") {
										setAddOn({ ...addOn, isFavorite: false });
									}
								}}
							>
								<option value="No">No</option>
								<option value="Yes">Yes</option>
							</Form.Control>
						</Form.Group>

						<Button className="buttons" variant="success" onClick={editAddOn}>
							Confirm Edit
						</Button>
						<Button className="buttons" variant="danger" onClick={deleteAddOn}>
							Delete Add-On
						</Button>
					</Form>
				</div>
			</>
		);
	} else {
		return <Redirect to="/login" />;
	}
};

export default EditAddon;

// Imports
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import Axios from "axios";
//----------------End of imports---------------------

const CreateAddOn = (props) => {
	const history = useHistory();
	const { currentUser, addOn, setAddOn, showNavbar, setShowNavbar } = props;
	const [loadImage, setLoadImage] = useState(true);
	const [file, setFile] = useState("");
	const { type, name, price, admin } = addOn;

	if (!showNavbar) {
		setShowNavbar(true);
	}
	const handleChange = (e) => {
		const newFile = e.target.files[0];
		setFile(newFile);
		setLoadImage(true);
	};

	const createAddOn = async () => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", type);
		formData.append("name", name);
		formData.append("price", price);
		formData.append("admin", admin);

		await Axios.post("/createaddon", formData, addOn)
			.then((res) => {
				if (res.data.msg === "Product added") {
					history.push("/menu");
				} else {
					console.log(res.data.msg);
				}
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		if (loadImage) {
			setAddOn({ ...addOn, admin: currentUser });
			setLoadImage(false);
		}
		if (addOn.type === "") {
			setAddOn({ ...addOn, type: "Sides" });
		}
	}, [addOn, loadImage]);
	return (
		<>
			<div id="addPage" style={{ color: "black" }}>
				<h1>Create an Add-on:</h1>
				<Form id="createAddOnForm">
					<Form.Group controlId="exampleForm.ControlInput1">
						<Form.Label>Add-on Name</Form.Label>
						<Form.Control
							type="text"
							name="name"
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
					<label htmlFor="addOnPrice">Price</label>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text>₱</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							type="text"
							id="addOnPrice"
							name="price"
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
							name="isFavorite"
							defaultValue="Sides"
							onChange={(e) => {
								setAddOn({ ...addOn, type: e.target.value });
							}}
						>
							<option value="Sides">Sides</option>
							<option value="Drinks">Drinks</option>
						</Form.Control>
					</Form.Group>
					<Button variant="success" onClick={createAddOn}>
						Add
					</Button>
				</Form>
			</div>
		</>
	);
	// } else {
	// 	return <Redirect to="/login"></Redirect>;
	// }
};

export default CreateAddOn;

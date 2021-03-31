import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import Axios from "axios";

const Product = (props) => {
	const { id } = useParams();
	const history = useHistory();
	const itemId = id;
	const { isLoggedin, images, setImages, showNavbar, setShowNavbar } = props;
	const [load, setLoad] = useState(false);
	if (!showNavbar) {
		setShowNavbar(true);
	}

	if (!load) {
		Axios.post("http://localhost:4000/menu")
			.then((res) => {
				setImages(res.data);
				setLoad(true);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const addToCart = (e) => {
		e.preventDefault();

		if (isLoggedin) {
			history.push(`/product/${id}`);
		} else if (!isLoggedin) {
			const result = window.confirm("Log in first!");
			if (result) {
				history.push("/login");
			}
		}
	};
	if (images) {
		return images.map((image) => {
			if (image._id === itemId) {
				return (
					<section className="saying_block">
						<img src={`/images/uploads/${image.images}`} alt="" />
						<div className="saying_content">
							<div className="text_box">
								<h2>{image.name}</h2>
								<h3>₱{image.price}</h3>
								<h4>{image.description}</h4>
								<Button onClick={addToCart}>Add to Cart</Button>
							</div>
						</div>
					</section>
				);
			}
		});
	} else {
		return <>Go back! </>;
	}
};

export default Product;

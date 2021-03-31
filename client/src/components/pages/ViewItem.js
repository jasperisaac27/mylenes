// Imports
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./ViewItem.css";
import "./Menu.css";
import Axios from "axios";

//----------------End of imports---------------------

const ViewItem = (props) => {
	const history = useHistory();
	const {
		isLoggedin,
		currentUser,
		addOns,
		viewProduct,
		showNavbar,
		setShowNavbar,
		cart,
		menu,
		setCart,
		setAddedToCart,
	} = props;
	const [total, setTotal] = useState(viewProduct.price);
	const [order, setOrder] = useState([viewProduct]);
	const [load, setLoad] = useState(false);
	if (!showNavbar) {
		setShowNavbar(true);
	}

	if (!load) {
		Axios.post("/cart", {
			id: currentUser._id,
		})
			.then((response) => {
				setCart(response.data);
			})
			.catch((err) => {
				console.log(err);
			});

		setLoad(true);
	}

	const addToCart = async (e) => {
		e.preventDefault();
		if (cart.orders) {
			await Axios.put("/updatecart", {
				previousOrders: cart.orders,
				previousTotal: cart.totalPrice,
				id: currentUser._id,
				order: order,
				status: "pending",
				totalPrice: total,
				menu: menu,
				addOns: addOns,
			})
				.then((res) => {
					console.log("Order added to cart");
					document.querySelector(".modal__close").click();
					document.querySelector("#Menu").style.filter = "blur(0px)";
					document.querySelector(".navbar").style.filter = "blur(0px)";
					setTotal(viewProduct.price);
					setLoad(false);
					setAddedToCart(true);
					history.push("/menu");
					// history.push({ pathname: "/menu", state: { setAddedToCart: true } });
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			await Axios.post("/addtocart", {
				id: currentUser._id,
				order: order,
				status: "pending",
				totalPrice: total,
				menu: menu,
				addOns: addOns,
			})
				.then((res) => {
					console.log("Order added to cart");
					document.querySelector(".modal__close").click();
					document.querySelector("#Menu").style.filter = "blur(0px)";
					document.querySelector(".navbar").style.filter = "blur(0px)";
					setTotal(viewProduct.price);
					setLoad(false);
					setAddedToCart(true);
					history.push("/menu");
					// history.push({ pathname: "/menu", state: { setAddedToCart: true } });
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	return (
		<form id="view-item">
			<div className="container">
				<div className="control-group">
					<h4 className="control-name">{viewProduct.name}</h4>
					<h4 className="control-price">₱{viewProduct.price}</h4>
				</div>
				{addOns.map((item) => {
					return (
						<div className="control-group" key={item._id}>
							<div id="item-addon" className="control-name">
								<h4>Add-Ons</h4>
								<label i className="control control--checkbox">
									{item.name} - ₱{item.price}
									<input
										type="checkbox"
										onClick={(e) => {
											if (e.target.checked) {
												setOrder([...order, item]);
												setTotal(total + item.price);
											} else {
												setTotal(total - item.price);
												setOrder(
													order.filter((filtered) => {
														return filtered.name !== item.name;
													})
												);
											}
										}}
									/>
									<div className="control__indicator" />{" "}
								</label>
							</div>
						</div>
					);
				})}

				<div className="control-group">
					<h3 className="control-name">Total</h3>
					<div>
						<h2 className="control-price">₱{total}</h2>
						{isLoggedin ? (
							<button className="control-button" onClick={addToCart}>
								Add to Cart
							</button>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		</form>
	);
};

export default ViewItem;

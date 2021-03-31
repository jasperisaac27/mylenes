// Imports
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Orders from "./Orders.js";
import Axios from "axios";
import "./Cart.css";

//----------------End of imports---------------------

const Cart = (props) => {
	const { isLoggedin, currentUser, cart, setCart, addOns, menu } = props;
	const [forEdit, setForEdit] = useState([]);
	const [edit, setEdit] = useState(false);
	const [removeCart, setRemoveCart] = useState({});
	const [load, setLoad] = useState(false);
	const [selectCart, setSelectCart] = useState(true);
	const [loadPage, setLoadPage] = useState(false);
	const domCart = document.querySelector("#cart");
	const cartLoader = document.querySelector(".cartLoader");
	const cartSelector = document.querySelector("#my-cart");
	const ordersSelector = document.querySelector("#my-orders");

	const getCart = async () => {
		await Axios.post("/cart", {
			id: currentUser._id,
		})
			.then((response) => {
				if (response.data.msg === "No cart found") {
					setCart("No cart found");
					setLoadPage(true);
				} else {
					setCart(response.data);
					setForEdit([]);
					setLoadPage(true);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	if (!load) {
		getCart();
		setLoad(true);
	}

	const deleteCart = async () => {
		await Axios.delete(`/deletecart/${removeCart._id}`)
			.then((res) => {
				setRemoveCart({});

				console.log(res.data.msg);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const updateItems = async (e) => {
		const result = window.confirm("Proceed to delete?");
		if (result) {
			await Axios.put("/updateitems", {
				id: currentUser._id,
				items: forEdit,
				addOns: addOns,
				menu: menu,
			})
				.then((res) => {
					console.log(res);
					if (res) {
						setLoad(false);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const qtyAdder = (item) => {
		forEdit.map((quantity) => {
			if (item.name === quantity.name) {
				setForEdit([
					...forEdit.filter((filtered) => {
						return filtered.name !== item.name;
					}),
					{
						...quantity,
						qty: quantity.qty + 1,
						price: (item.price / item.qty) * (quantity.qty + 1),
					},
				]);
			}
		});
	};

	const qtyLesser = (item) => {
		forEdit.map((quantity) => {
			if (item.name === quantity.name) {
				if (quantity.qty >= 1) {
					setForEdit([
						...forEdit.filter((filtered) => {
							return filtered.name !== item.name;
						}),
						{
							...quantity,
							qty: quantity.qty - 1,
							price: (item.price / item.qty) * (quantity.qty - 1),
						},
					]);
				}
			}
		});
	};

	const checkOut = async (e) => {
		e.preventDefault();
		const result = window.confirm("Proceed to checkout?");
		if (result) {
			await Axios.put("/checkout", {
				id: currentUser._id,
				orders: cart,
				totalPrice: cart.totalPrice + 50,
			})
				.then((res) => {
					setRemoveCart(res.data);
					setLoad(false);
					setSelectCart(false);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	useEffect(() => {
		if (removeCart.status === "Waiting for approval") {
			deleteCart();
		}
		if (loadPage) {
			domCart.style.display = "block";
			cartLoader.style.display = "none";
			setLoadPage(false);
		}
		if (!selectCart && cartSelector && ordersSelector) {
			cartSelector.style.backgroundColor = "rgb(210, 72, 7, 0.6)";
			ordersSelector.style.backgroundColor = "rgb(210, 72, 7)";
		} else if (selectCart && cartSelector && ordersSelector) {
			cartSelector.style.backgroundColor = "rgb(210, 72, 7)";
			ordersSelector.style.backgroundColor = "rgb(210, 72, 7, 0.6)";
		}

		// if (!selectCart && document.querySelector("#cart .card")) {
		// 	document.querySelector("#cart .card").style.maxWidth = "800px";
		// } else if (selectCart && document.querySelector("#cart .card")) {
		// 	document.querySelector("#cart .card").style.maxWidth = "950px";
		// }
	});

	let totalItems = 0;
	if (isLoggedin) {
		if (cart.orders && cart.orders.length) {
			totalItems = cart.orders
				.map((order) => {
					const container = order.qty;
					return container;
				})
				.reduce((accumulator, currentValue) => {
					return accumulator + currentValue;
				});
		}

		return (
			<>
				<div className="cartLoader" />
				<div
					onLoad={() => {
						setLoadPage(true);
					}}
					id="cart"
					style={{ display: "none" }}
				>
					<div className="selector">
						<div className="selector-options">
							<button
								onClick={() => {
									setSelectCart(true);
								}}
								id="my-cart"
								className="btn"
							>
								Cart
							</button>

							<button
								onClick={() => {
									setSelectCart(false);
								}}
								id="my-orders"
								className="btn"
							>
								Orders
							</button>
						</div>
					</div>

					<div className="card">
						{selectCart ? (
							cart !== "No cart found" ? (
								<div id="cart-summary" className="row">
									<div className="col-md-8 cart">
										<div className="title">
											<div className="row">
												<div className="col">
													<h4>
														<b>Shopping Cart</b>
													</h4>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-2" />
											<div className="col">Item</div>
											<div className="col">Qty</div>
											<div className="col">Price</div>
										</div>
										{cart.orders &&
											cart.orders.map((item) => {
												return (
													<>
														<div className="row">
															<div className="row main align-items-center">
																<div className="col-2">
																	<img
																		className="img-fluid"
																		src={`/images/uploads/${item.images}`}
																	/>
																</div>

																<div className="col">
																	<div className="row text-muted">
																		{item.name}
																	</div>
																</div>
																<div className="col">
																	<div className="row qty">
																		{edit ? (
																			<button
																				className="hiddenBtn"
																				onClick={(e) => {
																					e.preventDefault();
																					qtyLesser(item);
																				}}
																			>
																				-
																			</button>
																		) : (
																			""
																		)}
																		{/* {edit ? (
												<div className="border">0</div>
											) : (
												<div className="border">{item.qty}</div>
											)} */}

																		{edit ? (
																			forEdit.map((quantity) => {
																				if (item.name === quantity.name) {
																					return (
																						<div className="border">
																							{quantity.qty}
																						</div>
																					);
																				}
																			})
																		) : (
																			<div className="border">{item.qty}</div>
																		)}

																		{edit ? (
																			<button
																				className="hiddenBtn"
																				onClick={(e) => {
																					e.preventDefault();
																					qtyAdder(item);
																				}}
																			>
																				+
																			</button>
																		) : (
																			""
																		)}
																	</div>
																</div>

																{edit ? (
																	forEdit.map((quantity) => {
																		if (item.name === quantity.name) {
																			return (
																				<div className="col">
																					₱{quantity.price}
																				</div>
																			);
																		}
																	})
																) : (
																	<div className="col">
																		<div>₱{item.price}</div>
																	</div>
																)}
															</div>
														</div>
													</>
												);
											})}
										{edit ? (
											<div>
												{" "}
												<button
													className="editBtn"
													onClick={(e) => {
														e.preventDefault();
														setEdit(false);
													}}
												>
													Cancel
												</button>
												<button
													className="confirmBtn"
													onClick={(e) => {
														e.preventDefault();
														updateItems();
														setEdit(false);
													}}
												>
													Confirm Edit
												</button>
											</div>
										) : (
											<button
												className="editBtn"
												onClick={(e) => {
													e.preventDefault();
													setEdit(true);
													setForEdit([...cart.orders]);
												}}
											>
												Edit Cart
											</button>
										)}
									</div>
									<div className="col-md-4 summary">
										<div className="sum">
											<div>
												<h5>
													<b>Summary</b>
												</h5>
											</div>
											<hr />
											<div className="row">
												{totalItems > 1 ? (
													<div className="col items" style={{ paddingLeft: 0 }}>
														{`Items	 : ${totalItems}`}
													</div>
												) : (
													<div className="col items" style={{ paddingLeft: 0 }}>
														{`Item : ${totalItems}`}
													</div>
												)}
												<div className="col text-right">
													₱{`${cart.totalPrice}`}
												</div>
											</div>
											<div className="row">
												<div className="col items">Delivery fee</div>
												<div className="col text-right">₱50</div>
											</div>
											<div
												className="row"
												style={{
													borderTop: "1px solid rgba(0,0,0,.1)",
													padding: "2vh 0",
												}}
											>
												<div className="col">TOTAL PRICE</div>
												<div className="col text-right">{`₱${cart.totalPrice +
													50} `}</div>
											</div>
											{edit ? (
												""
											) : (
												<button
													className="checkOutBtn"
													onClick={(e) => {
														checkOut(e);
													}}
												>
													CHECKOUT
												</button>
											)}
										</div>
									</div>
								</div>
							) : (
								<div id="empty-cart" className="row">
									<div className="container">
										<div className="control-group">
											<h2>Your cart is empty!</h2>
										</div>
									</div>
								</div>
							)
						) : (
							<div id="cart-orders" className="row">
								<div className="col-md-12 cart">
									<Orders {...props} />
								</div>
							</div>
						)}
					</div>
					{/* ) : (
						<div id="emptyCart" className="userPage">
							<h1>Cart</h1>
							<div className="container">
								<div className="control-group">
									<h2 id="emptyCart">Your cart is empty!</h2>
								</div>
							</div>
						</div>
					)} */}
				</div>
			</>
		);
		// } else if (isLoggedin && cart.totalPrice === 0) {
		// 	return (
		// 		<>
		// 			<div id="emptyCart" className="userPage">
		// 				<h1>Cart</h1>
		// 				<div className="container">
		// 					<div className="control-group">
		// 						<h2 id="emptyCart">Your cart is empty!</h2>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</>
		// 	);
	} else if (!isLoggedin) {
		return <Redirect to="/login" />;
	}
};

export default Cart;

// Imports
import React, { useState } from "react";
import { Redirect, useHistory, useParams, useLocation } from "react-router-dom";
import Axios from "axios";
import "./Order.css";
//----------------End of imports---------------------

const Order = (props) => {
	const history = useHistory();
	const location = useLocation();
	const { orderId } = useParams();
	const { currentUser, isLoggedin } = props;
	const [user, setUser] = useState({});
	const [load, setLoad] = useState(false);
	const orderStatus = { msg: "row status-for-delivery" };

	const getUser = async () => {
		await Axios.post("/getuser", {
			id: location.state.user._id,
		})
			.then((response) => {
				if (response.data.msg === "No user found") {
					setUser("No userfound");
				} else {
					setUser(response.data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	if (!load) {
		getUser();
		setLoad(true);
	}

	const confirmDelivery = async (id) => {
		const result = window.confirm("Is order delivered?");
		if (result) {
			await Axios.put("/confirmdelivery", {
				userId: id,
				orderId: orderId,
			})
				.then((response) => {
					if (response.data.msg === "No user found") {
						// console.log(response.data.msg);
					} else {
						// console.log(response.data);

						history.push("/admin/orders");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
	const confirmPreparing = async (id) => {
		const result = window.confirm("Proceed to deliver?");
		if (result) {
			await Axios.put("/confirmpreparing", {
				userId: id,
				orderId: orderId,
			})
				.then((response) => {
					if (response.data.msg === "No user found") {
						// console.log(response.data.msg);
					} else {
						// console.log(response.data);
						history.push("/admin/orders");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
	const approveOrder = async (id) => {
		const result = window.confirm("Approve order?");
		if (result) {
			await Axios.put("/approveorder", {
				userId: id,
				orderId: orderId,
			})
				.then((response) => {
					if (response.data.msg === "No user found") {
						// console.log(response.data);
					} else {
						// console.log(response.data);

						history.push("/admin/orders");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
	const cancelOrder = async (id) => {
		const result = window.confirm("Proceed to delete?");
		if (result) {
			await Axios.put("/cancelorder", {
				userId: id,
				orderId: orderId,
			})
				.then((response) => {
					if (response.data.msg === "No user found") {
						// console.log(response.data.msg);
					} else {
						// console.log(response.data);

						history.push("/admin/orders");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	if (isLoggedin && user.orders) {
		return (
			<>
				<div id="order">
					<div className="order-status">
						{user.orders.map((order) => {
							if (order._id === orderId) {
								switch (order.status) {
									case "Out for delivery":
										orderStatus.msg = "row status-for-delivery";
										break;
									case "Order being prepared":
										orderStatus.msg = "row status-preparing";
										break;
									case "Waiting for approval":
										orderStatus.msg = "row status-waiting";
										break;
									case "Delivered":
										orderStatus.msg = "row status-delivered";
										break;
									case "Cancelled":
										orderStatus.msg = "row status-cancelled";
										break;
									default:
										orderStatus.msg = "row status-waiting";
								}
								return (
									<ul>
										<li className="user-order">
											<div className="card">
												<div className="user-order-id">
													Order ID. : {order._id}
												</div>
												<div className="row summary details">
													<div className="col-5">
														<div className="row">Time Ordered: </div>

														<div className="row">Total Price: </div>
														<div className="row">Status: </div>
													</div>
													<div className="col-7">
														<div className="row">
															<div className="order-time">
																{order.orderTime}
															</div>
														</div>
														<div className="row">
															₱{order.totalPrice} (50 delivery fee included)
														</div>
														<div className={orderStatus.msg}>
															<div>{order.status}</div>
														</div>
													</div>
												</div>
												<div className="row summary">
													<div className="col-12"> Items:</div>
												</div>
												<div className="row summary items">
													{order.orders.map((item) => {
														return (
															<>
																<div className="col">
																	<img
																		src={`/images/uploads/${item.images}`}
																		alt=""
																	/>
																	<div>
																		{item.qty}x {item.name}
																	</div>
																</div>
															</>
														);
													})}
												</div>
												{currentUser.username === "admin" &&
													order.status === "Out for delivery" && (
														<div className="row summary">
															<div className="col update-status">
																<button
																	className="btn"
																	onClick={() => {
																		confirmDelivery(user._id);
																	}}
																>
																	Confirm
																</button>

																<button
																	className="btn"
																	onClick={() => {
																		history.goBack();
																	}}
																>
																	Back
																</button>
															</div>
														</div>
													)}
												{currentUser.username === "admin" &&
													order.status === "Order being prepared" && (
														<div className="row summary">
															<div className="col update-status">
																<button
																	className="btn"
																	onClick={() => {
																		confirmPreparing(user._id);
																	}}
																>
																	Confirm
																</button>
																<button
																	className="btn"
																	onClick={() => {
																		history.goBack();
																	}}
																>
																	Back
																</button>
															</div>
														</div>
													)}
												{currentUser.username === "admin" &&
													order.status === "Waiting for approval" && (
														<div className="row summary">
															<div className="col update-status">
																<button
																	className="btn"
																	onClick={() => {
																		approveOrder(user._id);
																	}}
																>
																	Approve
																</button>
																<button
																	className="btn"
																	onClick={() => {
																		cancelOrder(user._id);
																	}}
																>
																	Delete
																</button>
																<button
																	className="btn"
																	onClick={() => {
																		history.goBack();
																	}}
																>
																	Back
																</button>
															</div>
														</div>
													)}
											</div>
										</li>
									</ul>
								);
							}
						})}
					</div>
				</div>
			</>
		);
	} else if (!isLoggedin) {
		return <Redirect to="/login" />;
	} else {
		return "";
	}
};

export default Order;

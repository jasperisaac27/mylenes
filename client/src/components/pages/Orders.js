// Imports
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import "./Orders.css";
//----------------End of imports---------------------

const Orders = (props) => {
	const history = useHistory();
	const { currentUser, isLoggedin } = props;
	const [user, setUser] = useState({});
	const [isMobile, setIsMobile] = useState(false);
	const [load, setLoad] = useState(false);

	const getUser = async () => {
		await Axios.post("/getuser", {
			id: currentUser._id,
		})
			.then((response) => {
				if (response.data.msg === "No user found") {
					setUser("No user found");
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
	const setMobile = () => {
		if (window.innerWidth <= 950) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	};
	useEffect(() => {
		window.addEventListener("resize", setMobile);
		setMobile();
		return () => window.removeEventListener("resize", setMobile);
	});

	if (isLoggedin && user._id === currentUser._id) {
		return (
			<>
				<div id="ordersLoader" />
				<div id="user-orders">
					{user.orders.length ? (
						<>
							<h2 id="history-title">History of Orders</h2>
							<div className="order-status">
								{user.orders.map((order) => {
									if (order.status === "Out for delivery") {
										return (
											<ul className="out-for-delivery">
												<li
													onClick={() => {
														history.push({
															pathname: `/user/${user.username}/order/${
																order._id
															}`,
															state: { user: user },
														});
													}}
													className="user-order"
												>
													<div className="row summary">
														<div className="row labels">
															<div className="col-6">
																<div className="order-label-id">Order ID</div>
															</div>
															<div className="col-3">
																<div className="order-label-time">
																	Time Ordered
																</div>
															</div>

															<div className="col-3">
																<div className="order-label-status">Status</div>
															</div>
														</div>
														<div className="row info">
															<div className="col-6">
																<div className="user-order-id">{order._id}</div>
															</div>
															<div className="col-3">
																<div className="order-time">
																	{order.orderTime}
																</div>
															</div>

															<div className="col-3 status-for-delivery">
																<div>{order.status}</div>
															</div>
														</div>
													</div>
													<div className="row summary">
														<div className="row labels">
															<div className="col-6" />
															<div className="col">
																<div className="order-label-price">Price</div>
															</div>
															<div className="col">
																<div className="order-label-price">
																	Delivery
																</div>
															</div>
															<div className="col-3">
																<div className="order-label-price">Total </div>
															</div>
														</div>
														<div className="row info">
															<div className="col-6" />
															<div className="col">
																<div>₱{order.totalPrice - 50}</div>
															</div>
															<div className="col">
																<div>₱50</div>
															</div>
															<div className="col-3">
																<div>₱{order.totalPrice}</div>
															</div>
														</div>
													</div>
													{/* <div className="col-5" />
												<div className="col-7">
													<div className="row" />
													<div className="row status-for-delivery" />
												</div> */}
												</li>
											</ul>
										);
									}
								})}
							</div>

							<div className="order-status">
								{user.orders.map((order) => {
									if (order.status === "Order being prepared") {
										return (
											<ul className="order-being-prepared">
												<li
													onClick={() => {
														history.push({
															pathname: `/user/${user.username}/order/${
																order._id
															}`,
															state: { user: user },
														});
													}}
													className="user-order"
												>
													<div className="row summary">
														<div className="row labels">
															<div className="col-6">
																<div className="order-label-id">Order ID</div>
															</div>
															<div className="col-3">
																<div className="order-label-time">
																	Time Ordered
																</div>
															</div>

															<div className="col-3">
																<div className="order-label-status">Status</div>
															</div>
														</div>
														<div className="row info">
															<div className="col-6">
																<div className="user-order-id">{order._id}</div>
															</div>
															<div className="col-3">
																<div className="order-time">
																	{order.orderTime}
																</div>
															</div>

															<div className="col-3 status-preparing">
																<div>{order.status}</div>
															</div>
														</div>
													</div>
													<div className="row summary">
														<div className="row labels">
															<div className="col-6" />
															<div className="col">
																<div className="order-label-price">Price</div>
															</div>
															<div className="col">
																<div className="order-label-price">
																	Delivery
																</div>
															</div>
															<div className="col-3">
																<div className="order-label-price">Total </div>
															</div>
														</div>
														<div className="row info">
															<div className="col-6" />
															<div className="col">
																<div>₱{order.totalPrice - 50}</div>
															</div>
															<div className="col">
																<div>₱50</div>
															</div>
															<div className="col-3">
																<div>₱{order.totalPrice}</div>
															</div>
														</div>
													</div>
												</li>
											</ul>
										);
									}
								})}
							</div>

							<div className="order-status">
								{user.orders.map((order) => {
									if (order.status === "Waiting for approval") {
										return (
											<ul className="waiting-for-approval">
												<li
													onClick={() => {
														history.push({
															pathname: `/user/${user.username}/order/${
																order._id
															}`,
															state: { user: user },
														});
													}}
													className="user-order"
												>
													{/* <div className="user-order-id">
												Tracking No. : {order._id}
											</div> */}
													<div className="row summary">
														<div className="row labels">
															<div className="col-6">
																<div className="order-label-id">Order ID</div>
															</div>
															<div className="col-3">
																<div className="order-label-time">
																	Time Ordered
																</div>
															</div>

															<div className="col-3">
																<div className="order-label-status">Status</div>
															</div>
														</div>
														<div className="row info">
															<div className="col-6">
																<div className="user-order-id">{order._id}</div>
															</div>
															<div className="col-3">
																<div className="order-time">
																	{order.orderTime}
																</div>
															</div>

															<div className="col-3 status-waiting">
																<div>{order.status}</div>
															</div>
														</div>
													</div>
													<div className="row summary">
														<div className="row labels">
															<div className="col-6" />
															<div className="col">
																<div className="order-label-price">Price</div>
															</div>
															<div className="col">
																<div className="order-label-price">
																	Delivery
																</div>
															</div>
															<div className="col-3">
																<div className="order-label-price">Total </div>
															</div>
														</div>
														<div className="row info">
															<div className="col-6" />
															<div className="col">
																<div>₱{order.totalPrice - 50}</div>
															</div>
															<div className="col">
																<div>₱50</div>
															</div>
															<div className="col-3">
																<div>₱{order.totalPrice}</div>
															</div>
														</div>
													</div>
												</li>
											</ul>
										);
									}
								})}
							</div>

							<div className="order-status">
								{user.orders.map((order) => {
									if (order.status === "Delivered") {
										return (
											<ul className="order-delivered">
												<li
													onClick={() => {
														history.push({
															pathname: `/user/${user.username}/order/${
																order._id
															}`,
															state: { user: user },
														});
													}}
													className="user-order"
												>
													<div className="row summary">
														<div className="row labels">
															<div className="col-6">
																<div className="order-label-id">Order ID</div>
															</div>
															<div className="col-3">
																<div className="order-label-time">
																	Time Ordered
																</div>
															</div>

															<div className="col-3">
																<div className="order-label-status">Status</div>
															</div>
														</div>
														<div className="row info">
															<div className="col-6">
																<div className="user-order-id">{order._id}</div>
															</div>
															<div className="col-3">
																<div className="order-time">
																	{order.orderTime}
																</div>
															</div>

															<div className="col-3 status-delivered">
																<div>{order.status}</div>
															</div>
														</div>
													</div>
													<div className="row summary">
														<div className="row labels">
															<div className="col-6" />
															<div className="col">
																<div className="order-label-price">Price</div>
															</div>
															<div className="col">
																<div className="order-label-price">
																	Delivery
																</div>
															</div>
															<div className="col-3">
																<div className="order-label-price">Total </div>
															</div>
														</div>
														<div className="row info">
															<div className="col-6" />
															<div className="col">
																<div>₱{order.totalPrice - 50}</div>
															</div>
															<div className="col">
																<div>₱50</div>
															</div>
															<div className="col-3">
																<div>₱{order.totalPrice}</div>
															</div>
														</div>
													</div>
												</li>
											</ul>
										);
									}
								})}
							</div>

							<div className="order-status">
								{user.orders.map((order) => {
									if (order.status === "Cancelled") {
										return (
											<ul className="order-cancelled">
												<li
													onClick={() => {
														history.push({
															pathname: `/user/${user.username}/order/${
																order._id
															}`,
															state: { user: user },
														});
													}}
													className="user-order"
												>
													{/* <div className="user-order-id">
														Tracking No. : {order._id}
													</div> */}
													<div className="row summary">
														<div className="row labels">
															<div className="col-6">
																<div className="order-label-id">Order ID</div>
															</div>
															<div className="col-3">
																<div className="order-label-time">
																	Time Ordered
																</div>
															</div>

															<div className="col-3">
																<div className="order-label-status">Status</div>
															</div>
														</div>
														<div className="row info">
															<div className="col-6">
																<div className="user-order-id">{order._id}</div>
															</div>
															<div className="col-3">
																<div className="order-time">
																	{order.orderTime}
																</div>
															</div>

															<div className="col-3 status-cancelled">
																<div>{order.status}</div>
															</div>
														</div>
													</div>
													<div className="row summary">
														<div className="row labels">
															<div className="col-6" />
															<div className="col">
																<div className="order-label-price">Price</div>
															</div>
															<div className="col">
																<div className="order-label-price">
																	Delivery
																</div>
															</div>
															<div className="col-3">
																<div className="order-label-price">Total </div>
															</div>
														</div>
														<div className="row info">
															<div className="col-6" />
															<div className="col">
																<div>₱{order.totalPrice - 50}</div>
															</div>
															<div className="col">
																<div>₱50</div>
															</div>
															<div className="col-3">
																<div>₱{order.totalPrice}</div>
															</div>
														</div>
													</div>
												</li>
											</ul>
										);
									}
								})}
							</div>
						</>
					) : (
						<h2 id="no-orders">You have no orders.</h2>
					)}
				</div>
			</>
		);
	} else {
		return "";
	}
};

export default Orders;

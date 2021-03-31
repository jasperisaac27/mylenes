// Imports
import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Axios from "axios";
import "./AdminOrders.css";
//----------------End of imports---------------------

const Admin = (props) => {
	const history = useHistory();
	const { currentUser, isLoggedin } = props;
	const [load, setLoad] = useState(false);
	const [users, setUsers] = useState([]);

	const getUsers = async () => {
		await Axios.get("/getusers")
			.then((res) => setUsers(res.data))
			.catch((e) => console.log(e));
	};
	if (!load) {
		getUsers();
		setLoad(true);
	}

	const [status, setStatus] = useState("Out for delivery");
	const [isMobile, setIsMobile] = useState(false);

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

	if (isLoggedin && currentUser.username === "admin") {
		return (
			<div id="admin-users">
				{!isMobile && (
					<div id="status-clicker">
						<button
							className="status-button"
							onClick={() => {
								setStatus("Out for delivery");
							}}
							style={
								status === "Out for delivery"
									? { backgroundColor: "rgb(210, 72, 7)" }
									: { backgroundColor: "rgb(210, 72, 7, 0.6)" }
							}
						>
							For Delivery
							{status === "Out for delivery" && isMobile && (
								<i class="fas fa-arrow-down" />
							)}
						</button>
						<button
							className="status-button"
							onClick={() => {
								setStatus("Order being prepared");
							}}
							style={
								status === "Order being prepared"
									? { backgroundColor: "rgb(210, 72, 7)" }
									: { backgroundColor: "rgb(210, 72, 7, 0.6)" }
							}
						>
							Preparing
						</button>
						<button
							className="status-button"
							onClick={() => {
								setStatus("Waiting for approval");
							}}
							style={
								status === "Waiting for approval"
									? { backgroundColor: "rgb(210, 72, 7)" }
									: { backgroundColor: "rgb(210, 72, 7, 0.6)" }
							}
						>
							For Approval
						</button>
						<button
							className="status-button"
							onClick={() => {
								setStatus("Delivered");
							}}
							style={
								status === "Delivered"
									? { backgroundColor: "rgb(210, 72, 7)" }
									: { backgroundColor: "rgb(210, 72, 7, 0.6)" }
							}
						>
							Delivered
						</button>
						<button
							className="status-button"
							onClick={() => {
								setStatus("Cancelled");
							}}
							style={
								status === "Cancelled"
									? { backgroundColor: "rgb(210, 72, 7)" }
									: { backgroundColor: "rgb(210, 72, 7, 0.6)" }
							}
						>
							Cancelled
						</button>
					</div>
				)}
				{isMobile && (
					<select
						name="status"
						id="status-dropdown"
						onChange={(e) => {
							setStatus(e.target.value);
						}}
						defaultValue={status}
					>
						<option value="Out for delivery">For Delivery</option>
						<option value="Order being prepared">Preparing</option>
						<option value="Waiting for approval">For Approval</option>
						<option value="Delivered">Delivered</option>
						<option value="Cancelled">Cancelled</option>
					</select>
				)}
				{/* {users &&
					console.log(
						users
							.map((user) => {
								return user;
							})
							.sort(function(a, b) {
								const timeA = a.orderTime.toUpperCase();
								const timeB = b.orderTime.toUpperCase();
								if (timeA < timeB) {
									return -1;
								}
								if (timeA > timeB) {
									return 1;
								}
								return 0;
							})
					)} */}
				{users
					.sort(function(a, b) {
						const timeA = a.lastOrderTime.toUpperCase();
						const timeB = b.lastOrderTime.toUpperCase();
						if (timeA < timeB) {
							return -1;
						}
						if (timeA > timeB) {
							return 1;
						}
						return 0;
					})
					.map((user) => {
						if (
							user.orders.length &&
							user.orders.some((item) => item.status === status)
						) {
							return (
								<div className="simpleMenu">
									<div className="simpleMenu-container">
										<div className="course">
											<div className="course-info">
												{status === "Out for delivery" && (
													<div className="order-status">
														{user.orders.some(
															(order) => order.status === "Out for delivery"
														) && (
															<h2 className="user-id">User: {user.username}</h2>
														)}
														{user.orders.map((order) => {
															if (order.status === "Out for delivery") {
																return (
																	<ul className="out-for-delivery">
																		<li className="user-order">
																			<div className="user-order-id">
																				Order ID: {order._id}
																			</div>
																			<div className="row">
																				<div className="col label">
																					<div>Time Ordered: </div>
																				</div>
																				<div className="col info">
																					<div>{order.orderTime}</div>
																				</div>
																			</div>
																			<div className="row">
																				<div className="col label">
																					<div>Total Price: </div>
																				</div>
																				<div className="col info">
																					<div>₱{order.totalPrice}</div>
																				</div>
																			</div>
																			<button
																				className="btn"
																				onClick={() => {
																					history.push({
																						pathname: `/user/${
																							user.username
																						}/order/${order._id}`,
																						state: { user: user },
																					});
																				}}
																			>
																				View
																			</button>
																		</li>
																	</ul>
																);
															}
														})}
													</div>
												)}
												{status === "Order being prepared" && (
													<div className="order-status">
														{user.orders.some(
															(order) => order.status === "Order being prepared"
														) && (
															<h2 className="user-id">User: {user.username}</h2>
														)}
														{user.orders.map((order) => {
															if (order.status === "Order being prepared") {
																return (
																	<ul className="order-being-prepared">
																		<li className="user-order">
																			<div className="user-order-id">
																				Order ID: {order._id}
																			</div>
																			<div className="row">
																				<div className="col label">
																					<div>Time Ordered: </div>
																				</div>
																				<div className="col info">
																					<div>{order.orderTime}</div>
																				</div>
																			</div>
																			<div className="row">
																				<div className="col label">
																					<div>Total Price: </div>
																				</div>
																				<div className="col info">
																					<div>₱{order.totalPrice}</div>
																				</div>
																			</div>
																			<button
																				className="btn"
																				onClick={() => {
																					history.push({
																						pathname: `/user/${
																							user.username
																						}/order/${order._id}`,
																						state: { user: user },
																					});
																				}}
																			>
																				View
																			</button>
																		</li>
																	</ul>
																);
															}
														})}
													</div>
												)}
												{status === "Waiting for approval" && (
													<div className="order-status">
														{user.orders.some(
															(order) => order.status === "Waiting for approval"
														) && (
															<h2 className="user-id">User: {user.username}</h2>
														)}
														{user.orders.map((order) => {
															if (order.status === "Waiting for approval") {
																return (
																	<ul className="waiting-for-approval">
																		<li className="user-order">
																			<div className="user-order-id">
																				Order ID: {order._id}
																			</div>
																			<div className="row">
																				<div className="col label">
																					<div>Time Ordered: </div>
																				</div>
																				<div className="col info">
																					<div>{order.orderTime}</div>
																				</div>
																			</div>
																			<div className="row">
																				<div className="col label">
																					<div>Total Price: </div>
																				</div>
																				<div className="col info">
																					<div>₱{order.totalPrice}</div>
																				</div>
																			</div>
																			<button
																				className="btn"
																				onClick={() => {
																					history.push({
																						pathname: `/user/${
																							user.username
																						}/order/${order._id}`,
																						state: { user: user },
																					});
																				}}
																			>
																				View
																			</button>
																		</li>
																	</ul>
																);
															}
														})}
													</div>
												)}
												{status === "Delivered" && (
													<div className="order-status">
														{user.orders.some(
															(order) => order.status === "Delivered"
														) && (
															<h2 className="user-id">User: {user.username}</h2>
														)}
														{user.orders.map((order) => {
															if (order.status === "Delivered") {
																return (
																	<ul className="order-delivered">
																		<li className="user-order">
																			<div className="user-order-id">
																				Order ID: {order._id}
																			</div>
																			<div className="row">
																				<div className="col label">
																					<div>Time Ordered: </div>
																				</div>
																				<div className="col info">
																					<div>{order.orderTime}</div>
																				</div>
																			</div>
																			<div className="row">
																				<div className="col label">
																					<div>Total Price: </div>
																				</div>
																				<div className="col info">
																					<div>₱{order.totalPrice}</div>
																				</div>
																			</div>
																			<button
																				className="btn"
																				onClick={() => {
																					history.push({
																						pathname: `/user/${
																							user.username
																						}/order/${order._id}`,
																						state: { user: user },
																					});
																				}}
																			>
																				View
																			</button>
																		</li>
																	</ul>
																);
															}
														})}
													</div>
												)}
												{status === "Cancelled" && (
													<div className="order-status">
														{user.orders.some(
															(order) => order.status === "Cancelled"
														) && (
															<h2 className="user-id">User: {user.username}</h2>
														)}
														{user.orders.map((order) => {
															if (order.status === "Cancelled") {
																return (
																	<ul className="order-cancelled">
																		<li className="user-order">
																			<div className="user-order-id">
																				Order ID: {order._id}
																			</div>
																			<div className="row">
																				<div className="col label">
																					<div>Time Ordered: </div>
																				</div>
																				<div className="col info">
																					<div>{order.orderTime}</div>
																				</div>
																			</div>
																			<div className="row">
																				<div className="col label">
																					<div>Total Price: </div>
																				</div>
																				<div className="col info">
																					<div>₱{order.totalPrice}</div>
																				</div>
																			</div>
																			<button
																				className="btn"
																				onClick={() => {
																					history.push({
																						pathname: `/user/${
																							user.username
																						}/order/${order._id}`,
																						state: { user: user },
																					});
																				}}
																			>
																				View
																			</button>
																		</li>
																	</ul>
																);
															}
														})}
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							);
						}
					})}
			</div>
		);
	} else {
		return <Redirect to="/login" exact />;
	}
};

export default Admin;

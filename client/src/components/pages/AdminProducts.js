// Imports
import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import "./AdminProducts.css";
import Axios from "axios";

//----------------End of imports---------------------

const AdminProducts = (props) => {
	const { isLoggedin, currentUser, menu, setMenu, addOns, setAddOns } = props;
	const [load, setLoad] = useState(false);

	if (!load) {
		Axios.all([Axios.post("/menu"), Axios.post("/addons")])
			.then((res) => {
				setMenu(res[0].data);
				setAddOns(res[1].data);
			})
			.catch((err) => console.log(err));
		setLoad(true);
	}

	const domProducts = document.querySelector("#admin-products");
	const productsLoader = document.querySelector("#admin-products-loader");

	useEffect(() => {
		if (menu && domProducts && productsLoader) {
			domProducts.style.display = "block";
			productsLoader.style.display = "none";
		}
	});

	if (isLoggedin && currentUser.username === "admin") {
		return (
			<>
				<div id="admin-products-loader" />
				<div id="admin-products">
					<div className="row adder">
						<Link className="btn" to="/createproduct">
							Add Products
						</Link>
						<Link className="btn" to="/createaddon">
							Add Add-on
						</Link>
					</div>

					<div className="row">
						<div className="col-4 admin-favorites">
							<h3>Favorites</h3>
							{menu &&
								menu.map((order) => {
									if (order.isFavorite) {
										return (
											<>
												<div className="row">
													<div className="col">
														<img
															src={`/images/uploads/${order.images}`}
															alt=""
														/>
													</div>
													<div className="col product-info">
														<div>{order.name}</div>
														<Link
															to={`/edit/product/${order._id}`}
															className="btn"
														>
															Edit
														</Link>
													</div>
												</div>
											</>
										);
									}
								})}
						</div>
						<div className="col-4 admin-regulars">
							<h3>Regulars</h3>
							{menu &&
								menu.map((order) => {
									if (order.isFavorite === false) {
										return (
											<>
												<div className="row">
													<div className="col">
														<img
															src={`/images/uploads/${order.images}`}
															alt=""
														/>
													</div>
													<div className="col product-info">
														<div>{order.name}</div>
														<Link
															to={`/edit/product/${order._id}`}
															className="btn"
														>
															Edit
														</Link>
													</div>
												</div>
											</>
										);
									}
								})}
						</div>

						<div className="col-4 admin-add-ons">
							<h3>Add-ons</h3>
							{menu &&
								addOns.map((addOn) => {
									return (
										<>
											<div className="row">
												<div className="col">
													<img src={`/images/uploads/${addOn.images}`} alt="" />
												</div>
												<div className="col product-info">
													<div>{addOn.name}</div>
													<Link to={`/edit/addon/${addOn._id}`} className="btn">
														Edit
													</Link>
												</div>
											</div>
										</>
									);
								})}
						</div>
					</div>
				</div>
			</>
		);
	} else {
		return <Redirect to="/login" />;
	}
};

export default AdminProducts;

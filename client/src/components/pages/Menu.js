// Imports
import React, { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import ViewItem from "./ViewItem.js";
import "./Menu.css";
import Axios from "axios";

//----------------End of imports---------------------

const Menu = (props) => {
	const {
		currentUser,
		menu,
		showNavbar,
		setShowNavbar,
		setCart,
		setMenu,
		setAddOns,
	} = props;
	const [viewProduct, setViewProduct] = useState("");
	const [locationKeys, setLocationKeys] = useState([]);
	const [addedToCart, setAddedToCart] = useState(false);
	const history = useHistory();
	const [load, setLoad] = useState(false);
	const [loaded, setLoaded] = useState(false);

	if (!load) {
		Axios.all([
			Axios.post("/cart", {
				id: currentUser._id,
			}),
			Axios.post("/menu"),
			Axios.post("/addons"),
		])
			.then((res) => {
				setCart(res[0].data);
				setMenu(res[1].data);
				setAddOns(res[2].data);
				setLoaded(true);
			})
			.catch((err) => console.log(err));
		setLoad(true);
	}

	if (!showNavbar) {
		setShowNavbar(true);
	}

	const modalToggler = () => {
		document.getElementsByTagName("BODY")[0].style.overflow = "hidden";
		document.querySelector("#Menu").style.filter = "blur(5px)";
		document.querySelector(".navbar").style.filter = "blur(5px)";
	};
	const undoModalToggler = () => {
		document.getElementsByTagName("BODY")[0].style.overflow = "initial";
		document.querySelector("#Menu").style.filter = "blur(0px)";
		document.querySelector(".navbar").style.filter = "blur(0px)";
	};

	const domMenu = document.querySelector("#Menu");
	const menuLoader = document.querySelector("#menuLoader");

	useEffect(() => {
		if (loaded) {
			domMenu.style.visibility = "visible";
			domMenu.style.opacity = "1";
			menuLoader.style.display = "none";
			setLoaded(false);
		}
		if (viewProduct) {
			modalToggler();
		} else {
			undoModalToggler();
		}
	});

	useEffect(() => {
		return history.listen((location) => {
			if (history.action === "PUSH") {
				setLocationKeys([location.key]);
			}

			if (history.action === "POP") {
				if (locationKeys[1] === location.key) {
					setLocationKeys(([_, ...keys]) => keys);

					// Handle forward event
				} else {
					setLocationKeys((keys) => [location.key, ...keys]);
					setViewProduct("");
					// Handle back event
				}
			}
		});
	}, [locationKeys]);

	return (
		<>
			<div id="menuLoader" />
			<div id="Menu">
				<h2 className="menuClass">Favorites</h2>
				<Row id="Favorites">
					{menu.map((item) => {
						if (item.isFavorite === true) {
							return (
								<Col md="2" key={item._id}>
									<div className="productCard">
										<div className="page-inner">
											<div className="row">
												<div className="el-wrapper">
													<div className="box-up">
														<img
															className="img"
															src={`/images/uploads/${item.images}`}
															alt=""
														/>
														<div className="img-info">
															<div
																className="info-inner"
																style={{
																	color: "black",
																	backgroundColor: "white",
																	borderRadius: "5px",
																}}
															>
																<span
																	className="p-name"
																	style={{ color: "black" }}
																>
																	{item.name}
																</span>
																<span
																	className="p-description"
																	style={{ fontSize: "15px" }}
																>
																	{item.description}
																</span>
																<span
																	className="p-price"
																	style={{ color: "black" }}
																>
																	starting at ₱{item.price}
																</span>
															</div>
														</div>
													</div>

													<a
														className="simpleMenu-price"
														href="#details"
														onClick={() => {
															modalToggler();
															setViewProduct(item);
														}}
													>
														<button
															className="btn"
															style={
																currentUser.username === "admin"
																	? { width: "80px" }
																	: { width: "150px" }
															}
														>
															View
														</button>
													</a>
												</div>
											</div>
										</div>
									</div>
									<div className="simpleMenu">
										<div className="simpleMenu-container">
											<div className="course">
												<div className="course-preview">
													<img src={`/images/uploads/${item.images}`} alt="" />
												</div>
												<div className="course-info">
													<div />
													<h2>{item.name}</h2>
													<h6> starting at ₱{item.price}</h6>
													<a
														className="simpleMenu-price"
														href="#details"
														onClick={() => {
															modalToggler();
															setViewProduct(item);
														}}
													>
														<button
															className="btn"
															style={
																currentUser.username === "admin"
																	? { width: "75px", display: "inline-block" }
																	: { width: "150px" }
															}
														>
															View
														</button>
													</a>
												</div>
											</div>
										</div>
									</div>
								</Col>
							);
						} else {
							return "";
						}
					})}
				</Row>
				<h2 className="menuClass">Regulars</h2>
				<Row id="Regulars">
					{menu.map((item) => {
						if (item.isFavorite === false) {
							return (
								<Col md="2" key={item._id}>
									<div className="productCard">
										<div className="page-inner">
											<div className="row">
												<div className="el-wrapper">
													<div className="box-up">
														<img
															className="img"
															src={`/images/uploads/${item.images}`}
															alt=""
														/>
														<div className="img-info">
															<div
																className="info-inner"
																style={{
																	color: "black",
																	backgroundColor: "white",
																	borderRadius: "5px",
																}}
															>
																<span
																	className="p-name"
																	style={{ color: "black" }}
																>
																	{item.name}
																</span>
																<span
																	className="p-description"
																	style={{ color: "black" }}
																>
																	{item.description}
																</span>
																<span
																	className="p-price"
																	style={{ color: "black" }}
																>
																	starting at ₱{item.price}
																</span>
															</div>
															{/* <div className="a-size">
												Available sizes :{" "}
												<span className="size">S , M , L , XL</span>
											</div> */}
														</div>
													</div>
													<a
														className="simpleMenu-price"
														href="#details"
														onClick={() => {
															modalToggler();
															setViewProduct(item);
														}}
													>
														<button
															className="btn"
															style={
																currentUser.username === "admin"
																	? { width: "75px", display: "inline-block" }
																	: { width: "150px" }
															}
														>
															View
														</button>
													</a>
												</div>
											</div>
										</div>
									</div>
									<div className="simpleMenu">
										<div className="simpleMenu-container">
											<div className="course">
												<div className="course-preview">
													<img src={`/images/uploads/${item.images}`} alt="" />
												</div>
												<div className="course-info">
													<h2>{item.name}</h2>
													<h6> starting at ₱{item.price}</h6>
													<a
														className="simpleMenu-price"
														href="#details"
														onClick={() => {
															modalToggler();
															setViewProduct(item);
														}}
													>
														<button
															className="btn"
															style={
																currentUser.username === "admin"
																	? { width: "75px" }
																	: { width: "150px" }
															}
														>
															View
														</button>
													</a>
												</div>
											</div>
										</div>
									</div>
								</Col>
							);
						} else {
							return "";
						}
					})}
				</Row>
			</div>

			{viewProduct ? (
				<div id="details" className="modal">
					<div className="modal__content">
						<img
							id="modal-img"
							src={`/images/uploads/${viewProduct.images}`}
							alt=""
						/>

						<div className="addons">
							<ViewItem
								viewProduct={viewProduct}
								setAddedToCart={setAddedToCart}
								{...props}
							/>
						</div>
						<a
							data-dismiss="modal"
							className="modal__close"
							onClick={() => {
								history.goBack();
								undoModalToggler();
								setViewProduct("");
							}}
						>
							<button className="btn">Return</button>
						</a>
					</div>
				</div>
			) : (
				""
			)}
			<div className={addedToCart ? "flash-show" : "flash-hide"}>
				<div>Item added to cart!</div>
				<span onClick={() => setAddedToCart(false)}>
					<i className="fa fa-times" aria-hidden="true" />
				</span>
			</div>
		</>
	);
};

export default withRouter(Menu);

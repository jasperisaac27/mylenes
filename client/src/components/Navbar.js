// Imports
import React, { useState, useEffect } from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import Logo from "../assets/Logo.png";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
//----------------End of imports---------------------

const NavigationBar = (props) => {
	const history = useHistory();
	const {
		isLoggedin,
		setIsLoggedin,
		setIsAdmin,
		currentUser,
		setCurrentUser,
		showNavbar,
		setShowNavbar,
	} = props;
	const [isMobile, setIsMobile] = useState(false);

	const mobileNavbar = () => {
		if (window.innerWidth <= 960) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	};

	const logout = (e) => {
		e.preventDefault();
		history.push("/login");
		setCurrentUser("");
		setIsLoggedin(false);
		setIsAdmin(false);
		closeMobileMenu();
	};

	const [size, setSize] = useState(window.innerWidth);
	const [button, setButton] = useState(true);
	const [click, setClick] = useState(false);
	const handleClick = () => setClick(!click);
	const closeMobileMenu = () => setClick(false);

	const loginFirst = async () => {
		const result = window.confirm("Log in first!");
		if (result) {
			history.push("/login");
		}
	};

	useEffect(() => {
		mobileNavbar();
		window.addEventListener("resize", mobileNavbar);
		return () => window.removeEventListener("resize", mobileNavbar);
	}, []);

	useEffect(() => {
		if (click) {
			document.querySelector("#Pages").style.display = "none";
		} else if (!click) {
			document.querySelector("#Pages").style.display = "block";
		}
		return;
	}, [click]);

	return (
		<>
			<nav className="navbar" style={{ width: "100%" }}>
				<div className={showNavbar ? "navbar-container" : "aboutNavbar"}>
					<div className="navbar-logo-container">
						<Link to="/home" className="navbar-logo" onClick={closeMobileMenu}>
							<img src={Logo} id="logo" alt="" />
							<div id="brandContent">
								<h2 id="brand">MYLENE'S</h2>
								<p>Homemade Food</p>
							</div>
						</Link>
					</div>

					<div className="menu-icon" onClick={handleClick}>
						<i className={click ? "fas fa-times" : "fas fa-bars"} />
					</div>

					<ul className={click ? "nav-menu active" : "nav-menu"}>
						<li className="nav-item">
							<Link to="/home" className="nav-links" onClick={closeMobileMenu}>
								<div>
									<i className="fas fa-home" />
									<h6> Home</h6>
									{/* <p className="nav-label">Home</p> */}
								</div>
							</Link>
							{/* <p className="tooltiptext">Home</p> */}
						</li>
						{/* <li className="nav-item">
							<Link to="/about" className="nav-links" onClick={closeMobileMenu}>
								About Us
							</Link>
						</li> */}
						<li className="nav-item">
							<Link to="/menu" className="nav-links" onClick={closeMobileMenu}>
								<div>
									<i className="fas fa-utensils" />
									<h6>Menu</h6>
									{/* <p className="nav-label">Menu</p> */}
								</div>
							</Link>
							{/* <p className="tooltiptext">Menu</p> */}
						</li>
						{isLoggedin && currentUser.username === "admin" ? (
							<li className="nav-item">
								<Link
									to="/admin"
									className="nav-links"
									onClick={closeMobileMenu}
								>
									<div>
										<i class="fas fa-lock" />
										<h6>Admin</h6>
										{/* <p className="nav-label">Admin</p> */}
									</div>
								</Link>
								{/* <p className="tooltiptext">Admin</p> */}
							</li>
						) : (
							<li className="nav-item">
								{isLoggedin ? (
									<Link
										to={`/user/${currentUser.username}/cart`}
										className="nav-links"
										onClick={() => {
											closeMobileMenu();
										}}
									>
										<div>
											<i className="fas fa-shopping-cart" />
											<h6>Cart</h6>
											{/* <p className="nav-label">Cart</p> */}
										</div>
									</Link>
								) : (
									<div
										className="nav-links login-first"
										onClick={() => {
											closeMobileMenu();
											if (!isLoggedin) {
												loginFirst();
											}
										}}
									>
										<div>
											<i className="fas fa-shopping-cart" />
											<h6>Cart</h6>
										</div>
										{/* <p className="nav-label">Cart</p> */}
									</div>
								)}
								{/* <p className="tooltiptext">Cart</p> */}
							</li>
						)}
						<li className="nav-item">
							{isLoggedin ? (
								<Link to="/login" className="nav-links" onClick={logout}>
									<div>
										<i className="fas fa-sign-out-alt" />
										<h6>Log out</h6>
										{/* <p className="nav-label">Log out</p> */}
									</div>
								</Link>
							) : (
								/* <p className="tooltiptext">Log out</p> */
								<Link
									to="/login"
									className="nav-links"
									onClick={closeMobileMenu}
								>
									<div>
										<i className="fas fa-user" />
										<h6>Sign in</h6>
										{/* <p className="nav-label">Sign in</p> */}
									</div>
								</Link>
								// <p className="tooltiptext">Sign in</p>
							)}
						</li>
					</ul>
				</div>
			</nav>
		</>
	);
};

export default withRouter(NavigationBar);

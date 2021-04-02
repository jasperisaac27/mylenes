// Imports
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/pages/Login.js";
import Home from "./components/pages/Home.js";
import Menu from "./components/pages/Menu.js";
import Error from "./components/pages/Error.js";
import CreateProduct from "./components/pages/CreateProduct.js";
import CreateAddOn from "./components/pages/CreateAddOn.js";
import Cart from "./components/pages/Cart.js";
import EditProduct from "./components/pages/EditProduct.js";
import EditAddOn from "./components/pages/EditAddOn.js";
import Order from "./components/pages/Order.js";
import Admin from "./components/pages/Admin.js";
import AdminOrders from "./components/pages/AdminOrders.js";
import AdminProducts from "./components/pages/AdminProducts.js";
import { Container } from "react-bootstrap";
import "./App.css";

//----------------End of imports---------------------

function App() {
	const [isLoggedin, setIsLoggedin] = useState(false);
	const [isMember, setIsMember] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [currentUser, setCurrentUser] = useState("");
	const [product, setProduct] = useState({
		name: "",
		images: "",
		price: "",
		description: "",
		admin: "",
		type: "",
		isFavorite: false,
	});
	const [favorites, setFavorites] = useState([]);
	const [images, setImages] = useState([]);
	const [menu, setMenu] = useState([]);
	const [addOn, setAddOn] = useState({
		name: "",
		price: "",
		type: "",
		admin: "",
	});

	const [addOns, setAddOns] = useState([]);
	const [showNavbar, setShowNavbar] = useState(true);
	const [cart, setCart] = useState({});

	const states = {
		isLoggedin,
		setIsLoggedin,
		isMember,
		setIsMember,
		isAdmin,
		setIsAdmin,
		currentUser,
		setCurrentUser,
		product,
		setProduct,
		images,
		setImages,
		menu,
		setMenu,
		addOn,
		setAddOn,
		addOns,
		setAddOns,
		showNavbar,
		setShowNavbar,
		favorites,
		setFavorites,
		cart,
		setCart,
	};

	return (
		<>
			<Router>
				<Navbar {...states} />
				<div id="Pages">
					<Container fluid>
						<div className="pages">
							<Switch>
								<Route exact path="/home" render={() => <Home {...states} />} />
								<Route exact path="/" render={() => <Home {...states} />} />
								<Route path="/menu" render={() => <Menu {...states} />} />
								<Route
									exact
									path="/login"
									render={() => <Login {...states} />}
								/>
								<Route
									exact
									path={`/user/:username/cart`}
									render={() => <Cart {...states} />}
								/>
								<Route
									exact
									path="/createproduct"
									render={() => <CreateProduct {...states} />}
								/>
								<Route
									exact
									path="/createaddon"
									render={() => <CreateAddOn {...states} />}
								/>
								<Route
									exact
									path={`/edit/product/:id`}
									render={() => <EditProduct {...states} />}
								/>
								<Route
									exact
									path={`/edit/addon/:id`}
									render={() => <EditAddOn {...states} />}
								/>
								<Route
									exact
									path={`/admin`}
									render={() => <Admin {...states} />}
								/>
								<Route
									exact
									path={`/admin/orders`}
									render={() => <AdminOrders {...states} />}
								/>
								<Route
									exact
									path={`/admin/products`}
									render={() => <AdminProducts {...states} />}
								/>
								<Route
									exact
									path={`/user/:username/order/:orderId`}
									render={() => <Order {...states} />}
								/>
								{/* <Route
									exact
									path={`/user/:id/orders`}
									render={() => <Orders {...states} />}
								/> */}
								<Route component={Error} />
							</Switch>
						</div>
					</Container>
				</div>
			</Router>
		</>
	);
}

export default App;

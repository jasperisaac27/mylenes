import React from "react";
import { Redirect, Link } from "react-router-dom";
import "./Admin.css";

const Admin = (props) => {
	const { isLoggedin, currentUser } = props;
	if (isLoggedin && currentUser.username === "admin") {
		return (
			<div id="admin">
				<div>
					<Link to="/admin/orders" className="btn">
						Orders
					</Link>
				</div>
				<div>
					<Link to="/admin/products" className="btn">
						Products
					</Link>
				</div>
			</div>
		);
	} else {
		return <Redirect to="/login" exact />;
	}
};

export default Admin;

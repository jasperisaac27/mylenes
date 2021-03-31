// Imports
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import Axios from "axios";
//----------------End of imports---------------------

const Register = (props) => {
	const history = useHistory();
	const [regUsername, setRegUsername] = useState("");
	const [regPassword, setRegPassword] = useState("");

	const register = (e) => {
		e.preventDefault();
		Axios({
			method: "POST",
			data: {
				username: regUsername,
				password: regPassword,
			},
			withCredentials: true,
			url: "https://mylenes-homemade-food.herokuapp.com/register",
		}).then((res) => {
			history.push("https://mylenes-homemade-food.herokuapp.com/login");
			console.log(res.data.msg);
		});
	};
	return (
		<div className="form-container sign-up-container">
			<form action="#">
				<h1>Create Account</h1>
				<span>or use your email for registration</span>
				<input
					type="text"
					placeholder="username"
					onChange={(e) => setRegUsername(e.target.value)}
				/>
				<input
					type="password"
					placeholder="password"
					onChange={(e) => setRegPassword(e.target.value)}
				/>
				<Button variant="success" onClick={register}>
					Submit
				</Button>
			</form>
		</div>
	);
};

export default Register;

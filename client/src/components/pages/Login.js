// Imports
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import "./Login.css";
import Axios from "axios";

//----------------End of imports---------------------

const Login = (props) => {
	const {
		isLoggedin,
		setIsLoggedin,
		setIsAdmin,
		setCurrentUser,
		showNavbar,
		setShowNavbar,
	} = props;
	const [loginUsername, setLoginUsername] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [regUsername, setRegUsername] = useState("");
	const [regPassword, setRegPassword] = useState("");
	const [regPhoneNumber, setRegPhoneNumber] = useState("");
	const [verificationCode, setVerificationCode] = useState("");
	const [verifyPhone, setVerifyPhone] = useState(false);
	const [isValidated, setIsValidated] = useState(false);
	const [isUserValid, setIsUserValid] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(true);
	const [isPhoneValid, setIsPhoneValid] = useState(false);
	const [isCodeValid, setIsCodeValid] = useState(true);
	const [isRegistered, setIsRegistered] = useState(false);
	const [userNotFound, setUserNotFound] = useState(false);
	const [userExists, setUserExists] = useState(false);
	const [click, setClick] = useState(false);

	if (!showNavbar) {
		setShowNavbar(true);
	}

	const registerForm = document.getElementById("registerForm");
	const signinForm = document.querySelector("#signinForm");

	const handleClick = () => setClick(!click);

	const loginReset = () => {
		setLoginUsername("");
		setLoginPassword("");
		setUserNotFound(false);
		signinForm && signinForm.reset();
	};

	const registerReset = () => {
		setVerifyPhone(false);
		setRegUsername("");
		setRegPassword("");
		setRegPhoneNumber("");
		setIsCodeValid(true);
		setIsUserValid(false);
		setIsPhoneValid(false);
		registerForm.reset();
	};

	const forVerification = (e) => {
		e.preventDefault();
		if (isValidated) {
			let formattedPhoneNumber = regPhoneNumber;

			if (regPhoneNumber.startsWith("09")) {
				formattedPhoneNumber = "+63".concat(
					regPhoneNumber.substring(1, regPhoneNumber.length)
				);
			}
			Axios.post("/forverification", {
				username: regUsername,
				phoneNumber: formattedPhoneNumber,
			})
				.then((res) => {
					if (res.data.msg === "Please enter a valid phone number.") {
						setIsPhoneValid(false);
					} else if (res.data.msg === "User already exists") {
						setUserExists(true);
					} else {
						registerForm.reset();
						setRegPhoneNumber(formattedPhoneNumber);
						setVerifyPhone(true);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			// console.log("Not validated");
		}
	};
	const verify = (e) => {
		e.preventDefault();
		if (verificationCode.length === 6) {
			Axios.post("/verify", {
				phoneNumber: regPhoneNumber,
				verificationCode: verificationCode,
			})
				.then((res) => {
					if (res.data === "approved") {
						register(e);
						handleClick();
						registerForm.reset();
						registerReset();
					} else {
						setIsCodeValid(false);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (verificationCode.length < 6) {
			setIsCodeValid(false);
		}
	};

	const register = (e) => {
		e.preventDefault();

		Axios({
			method: "POST",
			data: {
				username: regUsername,
				password: regPassword,
				phoneNumber: regPhoneNumber,
			},
			withCredentials: true,
			url: "/register",
		}).then((res) => {
			if (res.data.msg === "User created") {
				setIsRegistered(true);
				handleClick();
				registerForm.reset();
			}
			// console.log(res.data.msg);
		});
	};

	const login = async (e) => {
		e.preventDefault();
		await Axios.post("/login", {
			username: loginUsername,
			password: loginPassword,
		})
			.then((res) => {
				if (res.data.msg !== "No user found") {
					setCurrentUser(res.data);
					setIsLoggedin(true);
					if (res.data.username === "admin") {
						setIsAdmin(true);
					}
					// console.log(`Welcome back! ${res.data.username}`);
				} else {
					setUserNotFound(true);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		if (isUserValid && isPasswordValid && isPhoneValid) {
			setIsValidated(true);
		} else {
			setIsValidated(false);
		}
	}, [regUsername, regPassword, regPhoneNumber]);

	if (isLoggedin) {
		return (
			<>
				<Redirect
					to={{
						pathname: "/home",
					}}
				/>
			</>
		);
	} else {
		return (
			<>
				<div
					className={click ? "container right-panel-active" : "container"}
					id="user"
				>
					<div className="form-container sign-up-container">
						<form
							action="#"
							id="registerForm"
							class="row g-3 needs-validation"
							onSubmit={(e) => {
								forVerification(e);
							}}
						>
							{!verifyPhone ? (
								<>
									<h1>Create Account</h1>

									<input
										type="text"
										placeholder="Username"
										onChange={(e) => {
											if (e.target.value.length >= 6) {
												setIsUserValid(true);
											} else {
												setIsUserValid(false);
											}
											setRegUsername(e.target.value);
										}}
										maxLength="15"
										required
									/>
									<p
										className={
											regUsername.length
												? isUserValid
													? "reg-valid"
													: "reg-invalid"
												: "reg-username"
										}
									>
										Username must have at least 6 characters
									</p>

									<input
										type="password"
										placeholder="Password"
										onChange={(e) => {
											if (e.target.value.length >= 6) {
												setIsPasswordValid(true);
											} else {
												setIsPasswordValid(false);
											}
											setRegPassword(e.target.value);
										}}
										maxLength="15"
										required
									/>
									<p
										className={
											regPassword.length
												? isPasswordValid
													? "reg-valid"
													: "reg-invalid"
												: "reg-password"
										}
									>
										Password must have at least 6 characters
									</p>

									<input
										type="text"
										placeholder="Phone Number"
										onChange={(e) => {
											if (
												e.target.value.startsWith("09") &&
												e.target.value.length === 11
											) {
												setIsPhoneValid(true);
											} else if (
												e.target.value.startsWith("+63") &&
												e.target.value.length === 13
											) {
												setIsPhoneValid(true);
											} else {
												setIsPhoneValid(false);
											}
											setRegPhoneNumber(e.target.value);
										}}
									/>
									<p
										className={
											regPhoneNumber.length
												? isPhoneValid
													? "reg-valid"
													: "reg-invalid"
												: "reg-phonenumber"
										}
									>
										{isPhoneValid ? "Ok" : "Please input a valid number"}
									</p>

									<button type="submit">Submit</button>
								</>
							) : (
								<>
									<h1>Verify Phone Number</h1>
									<p>
										A 6-digit verification code has been sent to your number.
									</p>
									<input
										type="text"
										placeholder="Enter code"
										onChange={(e) => {
											setVerificationCode(e.target.value);
										}}
										required
									/>
									<button
										onClick={(e) => {
											verify(e);
										}}
									>
										Verify
									</button>
									<p className={isCodeValid ? "code" : "code-invalid"}>
										Code incorrect, please try again.
									</p>
								</>
							)}
						</form>
					</div>
					<div className="form-container sign-in-container">
						<form
							id="signinForm"
							onSubmit={(e) => {
								login(e);
							}}
						>
							<h1>Sign in</h1>
							<input
								type="text"
								placeholder="Username"
								onChange={(e) => {
									setLoginUsername(e.target.value);
								}}
								required
							/>

							<input
								type="password"
								placeholder="Password"
								onChange={(e) => {
									setLoginPassword(e.target.value);
								}}
								required
							/>
							<p className={userNotFound ? "user-not-found" : "user-found"}>
								Username or password is incorrect
							</p>

							<button className="signInBtn" type="submit">
								Sign In
							</button>
						</form>
					</div>
					<div className="overlay-container">
						<div className="overlay">
							<div className="overlay-panel overlay-left">
								<h1>Welcome Back!</h1>
								<p>
									To keep connected with us please login with your personal info
								</p>
								<button
									className="ghost"
									id="signIn"
									onClick={() => {
										registerReset();
										handleClick();
									}}
								>
									Sign In
								</button>
							</div>
							<div className="overlay-panel overlay-right">
								<h1>Hello, Friend!</h1>
								<p>Enter your personal details and start journey with us</p>
								<button
									className="ghost"
									id="signUp"
									onClick={() => {
										loginReset();
										handleClick();
									}}
								>
									Sign Up
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className={isRegistered ? "flash-show" : "flash-hide"}>
					<div>You are now registered!</div>
					<span onClick={() => setIsRegistered(false)}>
						<i class="fa fa-times" aria-hidden="true" />
					</span>
				</div>
				<div className={userExists ? "flash-show" : "flash-hide"}>
					<div>User already exists!</div>
					<span onClick={() => setUserExists(false)}>
						<i class="fa fa-times" aria-hidden="true" />
					</span>
				</div>
			</>
		);
	}
};

export default Login;

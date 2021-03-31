// Imports
import React from "react";
import { Row, Col } from "react-bootstrap";
import Logo from "../../assets/Logo.png";

import "./About.css";
import "bootstrap/dist/css/bootstrap.min.css";
//----------------End of imports---------------------

const About = (props) => {
	const { showNavbar, setShowNavbar } = props;

	if (showNavbar) {
		setShowNavbar(false);
	}

	return (
		<Row id="aboutPage">
			<Col className="about-logo-container">
				<div className="aboutBrand">
					<img src={Logo} id="aboutLogo" alt="" />
					<div id="aboutBrandContent">
						<h2>MYLENE'S</h2>
						<p>Homemade Food</p>
					</div>
				</div>
			</Col>
			<Col id="about-info">
				<div>
					<div className="about-text">
						<h3>Home Made Food</h3>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde enim
							eligendi, recusandae, eius quibusdam, dolores autem perferendis
							omnis dignissimos
						</p>
					</div>
					<div className="about-text">
						<h3>Food Made With Love</h3>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde enim
							eligendi, recusandae, eius quibusdam, dolores autem perferendis
							omnis dignissimos
						</p>
					</div>
				</div>
			</Col>
		</Row>
	);
};

export default About;

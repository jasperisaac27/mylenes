// Imports
import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import Axios from "axios";
import "./Home.css";

//----------------End of imports---------------------

const Home = (props) => {
	const { favorites, setFavorites, showNavbar, setShowNavbar } = props;
	let limit = 0;

	if (!showNavbar) {
		setShowNavbar(true);
	}
	const [load, setLoad] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const domHome = document.querySelector("#Home");
	const homeLoader = document.querySelector("#homeLoader");

	if (!load) {
		Axios.post("/home")
			.then((res) => {
				setFavorites(res.data);
				setLoaded(true);
			})
			.catch((err) => {
				console.log(err);
			});
		setLoad(true);
	}

	useEffect(() => {
		if (loaded) {
			domHome.style.visibility = "visible";
			domHome.style.opacity = "1";
			homeLoader.style.display = "none";
		}
	});

	return (
		<>
			<div id="homeLoader" />
			<div id="Home" style={{ width: "100%" }}>
				<div className="images">
					{favorites.map((favorite) => {
						limit = limit + 1;
						if (limit < 4) {
							return (
								<div key={favorite._id}>
									<Row className="first-row">
										<div>
											<img src={`/images/uploads/${favorite.images}`} alt="" />
										</div>
										<div className="text_box">
											<h2>{favorite.name}</h2>
											<p>{favorite.description}</p>
										</div>
									</Row>
									<Row className="second-row">
										<section className="saying_block">
											<div className="saying_content">
												<div className="text_box">
													<h2>Saying</h2>
													<p>{`Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit vero quod non iusto, nobis numquam quibusdam blanditiis totam dolor voluptates nostrum. Non porro sunt explicabo voluptas ea enim, obcaecati expedita.`}</p>
												</div>
											</div>
										</section>
									</Row>
								</div>
							);
						}
					})}
				</div>
			</div>
		</>
	);
};

export default Home;

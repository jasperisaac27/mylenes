const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const app = express();
const path = require("path");
const dotenv = require("dotenv").config();
const mongoUsername = process.env.mongoUsername;
const mongoPassword = process.env.mongoPassword;
//---------------------End--------------------------

//Mongo and Schemas
mongoose.connect(
	`mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.ia0tn.mongodb.net/project1?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => {
		console.log("Mongoose connected");
	}
);

const productRoutes = require("./routes/products.js");
const userRoutes = require("./routes/users.js");
const addOnsRoutes = require("./routes/addOns.js");
const cartRoutes = require("./routes/cart.js");

//---------------------End--------------------------------

//Middlewares

app.use(express.static(path.join(__dirname, "client/build")));

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	cors({
		origin: "http://localhost:3000", //
		credentials: true,
	})
);

app.use(
	session({
		secret: "secretcode",
		safe: true,
		saveUninitialized: true,
	})
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);
app.use(fileUpload());

//---------------------End--------------------------------

app.use("/", productRoutes);
app.use("/", userRoutes);
app.use("/", addOnsRoutes);
app.use("/", cartRoutes);

app.get("*", function(req, res) {
	res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
	console.log("Server started");
});

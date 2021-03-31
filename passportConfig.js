const User = require("./schemas/user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function(passport) {
	passport.use(
		new localStrategy((username, password, done) => {
			User.findOne({ username: username }, (err, user) => {
				if (err) throw err;
				if (!user) return done(null, false);
				bcrypt.compare(password, user.password, (error, result) => {
					if (error) throw err;
					if (result === true) {
						return done(null, user);
					} else {
						return done(null, false);
						y;
					}
				});
			});
		})
	);

	passport.serializeUser((user, cb) => {
		cb(null, user.id);
	});
	passport.deserializeUser((id, cb) => {
		User.findOne({ _id: id }, (err, user) => {
			const userInformation = {
				username: user.username,
			};
			cb(err, userInformation);
		});
	});
};

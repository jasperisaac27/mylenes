const express = require("express");
const router = express.Router();
const users = require("../controllers/users");

const User = require("../schemas/user.js");

router.post("/login", users.login);
router.post("/forverification", users.forverification);
router.post("/verify", users.verify);
router.post("/register", users.register);
router.put("/checkout", users.checkOut);
router.get("/getusers", users.getUsers);
router.post("/getuser", users.getUser);
router.put("/confirmdelivery", users.confirmDelivery);
router.put("/confirmpreparing", users.confirmPreparing);
router.put("/approveorder", users.approveOrder);
router.put("/cancelorder", users.cancelOrder);

module.exports = router;

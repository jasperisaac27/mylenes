const express = require("express");
const router = express.Router();
const addOns = require("../controllers/addOns");

const AddOn = require("../schemas/addOn.js");

router.post("/createaddon", addOns.createAddOn);
router.post("/addons", addOns.addOnsPage);
router.post("/editaddons", addOns.editAddOnsPage);
router.put("/editaddon", addOns.editAddOn);
router.delete("/delete", addOns.deleteAddOn);

module.exports = router;

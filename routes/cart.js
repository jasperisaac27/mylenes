const express = require("express");
const router = express.Router();
const cart = require("../controllers/cart");

const Cart = require("../schemas/cart.js");

router.post("/addtocart", cart.addToCart);
router.post("/cart", cart.cart);
router.put("/updatecart", cart.updateCart);
router.put("/updateitems", cart.updateItems);
router.delete("/deletecart/:id", cart.deleteCart);

module.exports = router;

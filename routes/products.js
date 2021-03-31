const express = require("express");
const router = express.Router();
const products = require("../controllers/products");

const Product = require("../schemas/product.js");

router.post("/home", products.homePage);
router.post("/createproduct", products.createProduct);
router.post("/menu", products.menuPage);
router.post("/editproducts", products.editProductsPage);
router.put("/editproduct", products.editProduct);
router.delete("/delete", products.deleteProduct);

module.exports = router;

const express = require("express");
const login = require("../controller/login.js");
const createUser = require("../controller/signup.js");
const { authenticate } = require("../middlewares/auth.js");
const product = require("../controller/product.js");
const productDetails = require("../controller/productDetails.js");
const getProducts = require("../controller/getProducts.js");
const getProductDetails = require("../controller/getProductDetails.js");
const addToCart = require("../controller/addToCart.js");
const cart = require("../controller/cart.js");
const getProduct = require("../controller/getProduct.js");

const router = express.Router();

router.post("/products", product);
router.post("/productDetails", productDetails);
router.get("/getProductDetails", getProductDetails);
router.get("/products", getProducts);
router.get("/product", getProduct);

router.post("/add-to-cart", authenticate, addToCart);
router.get("/cart", authenticate, cart);

router.post("/signup", createUser);
router.post("/login", login);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.get("/profile", authenticate, (req, res) => {
  res.json({
    message: `Welcome ${req.user.name}`,
    user: {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phoneNumber: req.user.phoneNumber,
    },
    token: res.cookie.token,
  });
});

module.exports = router;

const express = require("express");
const login = require("../controller/login.js");
const createUser = require("../controller/signup.js");
const { authenticate } = require("../middlewares/auth.js");
const product = require("../controller/product.js");
const productDetails = require("../controller/productDetails.js");
const getProducts = require("../controller/getProducts.js");
const getProductDetails = require("../controller/getProductDetails.js");
const {
  cart,
  addToCart,
  clearCart,
  deleteFromCart,
  decrementQuantity,
} = require("../controller/cart.js");
const getProduct = require("../controller/getProduct.js");
const payment = require("../controller/stripe.js");

const router = express.Router();

// Route to make payment
router.post("/checkout-session/:cartId", payment);

// Route to add a product

router.post("/products", product);

// Route to add product details
router.post("/productDetails", productDetails);
// Route to get product details
router.get("/getProductDetails", getProductDetails);

// Route to get all products
router.get("/products", getProducts);

// Route to get a specific product with asin
router.get("/product", getProduct);

// Route to add a product to the cart
router.post("/add-to-cart", authenticate, addToCart);

// Route to clear the cart
router.delete("/clear-cart", authenticate, clearCart);

// Route to delete a specific product from the cart
router.delete("/delete/:asin", authenticate, deleteFromCart);

// Route to increment the quantity of a specific product in the cart
router.put("/decrement/:asin", authenticate, decrementQuantity);

// Route to get the cart
router.get("/cart", authenticate, cart);

// Route to create a new user
router.post("/signup", createUser);

// Route to login
router.post("/login", login);

// Route to logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.get("/me", authenticate, (req, res) => {
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

router.get("/", (req, res) => {
  res.json({
    message: "e-commerce-api",
  });
});

module.exports = router;

const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Function to calculate total price
const calculateTotalPrice = (items) => {
  let totalPrice = 0;
  for (const item of items) {
    const price = parseFloat(item.product.price.replace("$", ""));
    totalPrice += price * item.quantity;
  }
  return totalPrice.toFixed(2); // Assuming you want to round to 2 decimal places
};

const cart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.product");
    if (!cart) {
      return res.json({ message: "Cart is empty" });
    }

    // Calculate total price
    cart.totalPrice = calculateTotalPrice(cart.items);

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const addToCart = async (req, res) => {
  const userId = req.user._id;
  const asin = req.body.asin;
  const quantity = req.body.quantity || 1;
  let message = "";

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      message = "Product added successfully to Your cart";
    }

    let product = await Product.findOne({ asin });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.asin === asin
    );
    if (existingItemIndex !== -1) {
      // If item already exists in cart, just update quantity
      cart.items[existingItemIndex].quantity += quantity;
      message = "Product quantity added one more to Your cart";
    } else {
      // If item is not in cart, add it
      cart.items.push({
        asin,
        quantity,
        product,
      });
      message = "Product added successfully to Your cart";
    }

    // Populate product details for all items in cart
    await Promise.all(
      cart.items.map(async (item) => {
        if (!item.product) {
          item.product = await Product.findOne({ asin: item.asin });
        }
      })
    );

    // Calculate total price
    cart.totalPrice = calculateTotalPrice(cart.items);

    cart.updatedAt = new Date();

    await cart.save();

    res.json({
      message,
      cart,
      numberOfItems: cart.items.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const clearCart = async (req, res) => {
  const userId = req.user._id;

  try {
    await Cart.findOneAndDelete({ userId });
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const deleteFromCart = async (req, res) => {
  const userId = req.user._id;
  const asinToDelete = req.params.asin;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.asin !== asinToDelete);

    // Calculate total price
    cart.totalPrice = calculateTotalPrice(cart.items);

    cart.updatedAt = new Date();

    await cart.save();

    res.json({
      message: "Product removed successfully from Your cart",
      cart,
      numberOfItems: cart.items.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const decrementQuantity = async (req, res) => {
  const userId = req.user._id;
  const asinToUpdate = req.params.asin;
  const quantityToSubtract = req.body.quantity || 1;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const existingItem = cart.items.find((item) => item.asin === asinToUpdate);

    if (!existingItem) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    if (existingItem.quantity <= quantityToSubtract) {
      // If the quantity to subtract is greater than or equal to the existing quantity, remove the item from the cart
      cart.items = cart.items.filter((item) => item.asin !== asinToUpdate);
    } else {
      // Otherwise, decrement the quantity
      existingItem.quantity -= quantityToSubtract;
    }

    // Calculate total price
    cart.totalPrice = calculateTotalPrice(cart.items);

    cart.updatedAt = new Date();

    await cart.save();
    res.json({
      message: "Product quantity subtracted one more from Your cart",
      cart,
      numberOfItems: cart.items.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  cart,
  addToCart,
  deleteFromCart,
  clearCart,
  decrementQuantity,
};

const Cart = require("../models/Cart");

const cart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.json({ message: "Cart is empty" });
    }
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

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find((item) => item.asin === asin);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ asin, quantity });
    }

    const totalPrice = cart.items.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
    cart.totalPrice = totalPrice;
    await cart.save();

    res.json({
      message: "Product added successfully to Your cart",
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

    const totalPrice = cart.items.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
    cart.totalPrice = totalPrice;
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

    const totalPrice = cart.items.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
    cart.totalPrice = totalPrice;

    await cart.save();
    res.json({
      message: "Product quantity updated successfully in Your cart",
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

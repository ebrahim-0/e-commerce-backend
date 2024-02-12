const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
  const userId = req.user._id;
  const asin = req.body.asin;
  const quantity = req.body.quantity || 1;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.asin === asin);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ asin, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = addToCart;

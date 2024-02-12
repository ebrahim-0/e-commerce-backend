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

module.exports = cart;

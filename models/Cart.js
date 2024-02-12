const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      asin: String,
      quantity: Number,
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

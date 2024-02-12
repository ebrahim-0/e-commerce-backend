const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },

  items: [
    {
      asin: String,
      quantity: Number,
    },
  ],
  totalPrice: Number,
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  totalPrice: Number,
  items: [
    {
      asin: String,
      quantity: Number,
      product: {},
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

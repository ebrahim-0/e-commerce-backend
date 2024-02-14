const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
        },
        quantity: Number,
      },
    ],
    totalPrice: Number,
    shippingAddress: {},
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields automatically

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

const Order = require("../models/Order");

const order = async (req, res) => {
  const userId = req.user._id;

  try {
    // Retrieve all orders from the database
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.json({ message: "No orders found" });
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = order;

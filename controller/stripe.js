const Cart = require("../models/Cart");
const Order = require("../models/Order"); // Import your Order model

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const payment = async (req, res) => {
  const { cartId } = req.params;
  const { url } = req.query;
  const { shippingAddress } = req.body;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Create a new order using cart details
    const order = new Order({
      userId: req.user._id, // Assuming user is logged in
      items: cart.items,
      totalPrice: cart.totalPrice, // Assuming total is stored in the cart
      shippingAddress: shippingAddress, // Assign shipping address to the order
      // Add any other necessary fields from the cart or request
    });

    // Save the new order to the database
    await order.save();

    // Remove the cart
    await Cart.findByIdAndDelete(cartId);

    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
          images: [item.product.image],
        },
        unit_amount: parseFloat(item.product.price.replace("$", "")) * 100,
      },
      quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${url}/success`,
      cancel_url: `${url}/cancel`,
      metadata: {
        orderId: order._id, // Pass the order ID to metadata for reference
      },
    });

    res.json({ id: session.id, session, status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = payment;

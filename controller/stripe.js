const Cart = require("../models/Cart");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const payment = async (req, res) => {
  const { cartId } = req.params;
  const { url } = req.query;

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

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
    });

    res.json({ id: session.id, session });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = payment;

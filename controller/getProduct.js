const Product = require("../models/Product");

const getProduct = async (req, res) => {
  const { asin } = req.query;

  try {
    const product = await Product.findOne({ asin });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getProduct;

const ProductDetails = require("../models/ProductDetails");

const getProductDetails = async (req, res) => {
  const { asin } = req.query;

  try {
    // Find the product details by the provided ASIN

    const product = await ProductDetails.findOne({ asin });

    if (!product) {
      // If product with given ASIN is not found, return a 404 response
      return res.status(404).json({ error: "Product not found" });
    }

    // If product is found, return it in the response
    res.json(product);
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getProductDetails;

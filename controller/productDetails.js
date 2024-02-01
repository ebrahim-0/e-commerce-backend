const ProductDetails = require("../models/ProductDetails");

const productDetails = async (req, res) => {
  const {
    asin,
    title,
    url,
    images,
    price,
    original_price,
    savings_percentage,
    savings_price,
    product_details,
    about_this_product,
    what_in_the_box,
    is_renewed,
  } = req.body;

  console.log("Received product data:", req.body);

  try {
    const newProduct = new ProductDetails({
      asin,
      title,
      url,
      images,
      price,
      original_price,
      savings_percentage,
      savings_price,
      product_details,
      about_this_product,
      what_in_the_box,
      is_renewed,
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    // Respond with the saved product data
    res.json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = productDetails;

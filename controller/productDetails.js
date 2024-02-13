const ProductDetails = require("../models/ProductDetails");

const productDetails = async (req, res) => {
  const {
    asin,
    product_details,
    product_technical_details,
    product_information,
    savings_percentage,
    savings_price,
    title,
    url,
    product_description,
    price,
    original_price,
    is_renewed,
    important_information,
    what_in_the_box,
    about_this_product,
    image,
  } = req.body;

  try {
    const existingProduct = await ProductDetails.findOne({ asin });

    if (existingProduct) {
      return res.status(400).json({ error: "Product already exists" });
    }

    const newProduct = new ProductDetails(req.body);

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

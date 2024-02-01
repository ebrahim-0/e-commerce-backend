const Product = require("../models/Product");

const product = async (req, res) => {
  const {
    asin,
    bought_in_past_month,
    image,
    is_best_seller,
    is_climate_pledge_friendly,
    is_limited_time_deal,
    is_prime,
    is_sponsored,
    original_price,
    price,
    rating_count,
    stars,
    title,
    url,
  } = req.body;

  console.log("Received product data:", req.body);

  try {
    const newProduct = new Product({
      asin,
      bought_in_past_month,
      image,
      is_best_seller,
      is_climate_pledge_friendly,
      is_limited_time_deal,
      is_prime,
      is_sponsored,
      original_price,
      price,
      rating_count,
      stars,
      title,
      url,
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

module.exports = product;

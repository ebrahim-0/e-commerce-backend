const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  asin: { type: String },
  bought_in_past_month: { type: Boolean },
  image: { type: String },
  is_best_seller: { type: Boolean },
  is_climate_pledge_friendly: { type: Boolean },
  is_limited_time_deal: { type: Boolean },
  is_prime: { type: Boolean },
  is_sponsored: { type: Boolean },
  original_price: { type: String },
  price: { type: String },
  rating_count: { type: Number },
  stars: { type: Number },
  title: { type: String },
  url: { type: String },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

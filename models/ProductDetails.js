const mongoose = require("mongoose");

const ProductDetailsSchema = new mongoose.Schema(
  {
    asin: String,
    product_details: {},
    product_technical_details: {},
    product_information: String,
    savings_percentage: String,
    savings_price: String,
    title: String,
    url: String,
    product_description: String,
    price: String,
    original_price: String,
    is_renewed: Boolean,
    important_information: String,
    what_in_the_box: [String],
    about_this_product: [String],
    image: [String],
  },
  { timestamps: true }
);

const ProductDetails = mongoose.model("ProductDetails", ProductDetailsSchema);

module.exports = ProductDetails;

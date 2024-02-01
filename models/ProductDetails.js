const mongoose = require("mongoose");

const ProductDetailsSchema = new mongoose.Schema(
  {
    asin: "string",
    title: "string",
    url: "string",
    images: ["string"],
    price: "string",
    original_price: "string",
    savings_percentage: "string",
    savings_price: "string" || null,
    product_details: {
      Brand: "string",
      "Model Name": "string",
      Color: "string",
      "Form Factor": "string",
      "Connectivity Technology": "string",
    },
    about_this_product: ["string"],
    what_in_the_box: ["string"],
    is_renewed: "boolean",
  },
  { timestamps: true }
);

const ProductDetails = mongoose.model("ProductDetails", ProductDetailsSchema);

module.exports = ProductDetails;

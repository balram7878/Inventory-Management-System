const mongoose = require("mongoose");

const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Groceries",
  "Furniture",
  "Books",
  "Beauty",
  "Sports",
  "Toys",
  "Automotive",
  "Health",
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: {
        values: PRODUCT_CATEGORIES,
        message: "Invalid category selected",
      },
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("../models/Product");

dotenv.config();

const products = [
  { name: "Wireless Mouse", price: 799, quantity: 40, category: "Electronics" },
  { name: "Bluetooth Headphones", price: 1999, quantity: 25, category: "Electronics" },
  { name: "Denim Jacket", price: 1499, quantity: 30, category: "Clothing" },
  { name: "Running Shoes", price: 2599, quantity: 20, category: "Sports" },
  { name: "Office Chair", price: 4999, quantity: 12, category: "Furniture" },
  { name: "Coffee Table", price: 3599, quantity: 10, category: "Furniture" },
  { name: "Organic Rice 5kg", price: 650, quantity: 60, category: "Groceries" },
  { name: "Cooking Oil 1L", price: 180, quantity: 75, category: "Groceries" },
  { name: "JavaScript Handbook", price: 699, quantity: 35, category: "Books" },
  { name: "Toy Car", price: 349, quantity: 50, category: "Toys" },
  { name: "Car Dashboard Cleaner", price: 299, quantity: 45, category: "Automotive" },
  { name: "Vitamin C Tablets", price: 499, quantity: 28, category: "Health" },
];

const seedProducts = async () => {
  try {
    const mongoUrl = process.env.MONGO_CONNECTION_STRING || process.env.MONGO_URI;

    if (!mongoUrl) {
      throw new Error("Missing MongoDB connection string in env");
    }

    await mongoose.connect(mongoUrl);

    for (const product of products) {
      await Product.updateOne({ name: product.name }, { $set: product }, { upsert: true });
    }

    console.log("Products seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();

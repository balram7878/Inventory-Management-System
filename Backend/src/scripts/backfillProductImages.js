const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("../models/Product");

dotenv.config();

const categoryImages = {
  Electronics:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
  Clothing:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  Groceries:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
  Furniture:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  Books:
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
  Beauty:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
  Sports:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
  Toys:
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80",
  Automotive:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  Health:
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=900&q=80",
};

const defaultImage =
  "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80";

const run = async () => {
  try {
    const mongoUrl = process.env.MONGO_CONNECTION_STRING || process.env.MONGO_URI;
    if (!mongoUrl) {
      throw new Error("Missing MongoDB connection string");
    }

    await mongoose.connect(mongoUrl);

    const products = await Product.find();
    let updatedCount = 0;

    for (const product of products) {
      if (!product.imageUrl) {
        product.imageUrl = categoryImages[product.category] || defaultImage;
        await product.save();
        updatedCount += 1;
      }
    }

    console.log(`Backfill complete. Updated ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error.message);
    process.exit(1);
  }
};

run();

const Product = require("../models/Product");

const stockIn = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "productId and positive quantity are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.quantity += quantity;
    await product.save();

    return res.status(200).json({ message: "Stock updated", product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const stockOut = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "productId and positive quantity are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.quantity -= quantity;
    await product.save();

    return res.status(200).json({ message: "Stock updated", product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { stockIn, stockOut };

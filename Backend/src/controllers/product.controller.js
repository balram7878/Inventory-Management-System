const Product = require("../models/Product");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const query = req.query.q || "";
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadProductImage = async (req, res) => {
  try {
    if (!isCloudinaryConfigured) {
      return res.status(500).json({
        message:
          "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
      });
    }

    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: "imageBase64 is required" });
    }

    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: "inventory-products",
      resource_type: "image",
    });

    return res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  searchProducts,
  uploadProductImage,
};

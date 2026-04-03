const express = require("express");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  searchProducts,
  uploadProductImage,
} = require("../controllers/product.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, authorize("admin", "staff"), createProduct);
router.get("/", protect, getProducts);
router.get("/search", protect, searchProducts);
router.post("/upload-image", protect, authorize("admin", "staff"), uploadProductImage);
router.put("/:id", protect, authorize("admin", "staff"), updateProduct);
router.delete("/:id", protect, authorize("admin", "staff"), deleteProduct);

module.exports = router;

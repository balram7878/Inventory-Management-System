const {
  addProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  totalProducts,
} = require("./inventory.controller");

const adminValidation = require("../../middleware/adminValidation");
const express = require("express");

const router = express.Router();

router.post("/add-product", adminValidation, addProduct);
router.delete("/delete-product/:id", adminValidation, deleteProduct);
router.put("/update-product-details", adminValidation, updateProduct);
router.get("/get-product/:id", getProduct);
router.get("/get-all-products", getAllProducts);
router.get("/total-products", adminValidation, totalProducts);

module.exports = router;

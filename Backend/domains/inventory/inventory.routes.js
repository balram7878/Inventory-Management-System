const {
  addProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  updateProduct,
} = require("./inventory.controller");

const adminValidation = require("../../middleware/adminValidation");
const express = require("express");

const router = express.Router();

router.post("/add-product", adminValidation, addProduct);
router.delete("/delete-product", adminValidation, deleteProduct);
router.put("/update-product-details", adminValidation, updateProduct);
router.get("/get-product", getProduct);
router.get("/get-all-products", getAllProducts);

module.exports = router;

const express = require("express");
const adminValidation = require("../../middleware/adminValidation");

const {
  addCategory,
  deleteCategory,
  updateCategoryDetails,
  getAllCategory,
} = require("./category.controller");

const router = express.Router();

router.post("/add-category", adminValidation, addCategory);
router.delete("/delete-category", adminValidation, deleteCategory);
router.put("/update-category-details", adminValidation, updateCategoryDetails);
router.get("/get-all-category", getAllCategory);

module.exports = router;

const express = require("express");
const authValidation = require("../../middleware/authValidation");
const adminValidation = require("../../middleware/adminValidation");

const {
  addOrderItem,
  updateOrderItem,
  deleteOrderItem,
  getOrderItems
} = require("./order_items.controller");

const router = express.Router();


router.post("/add", adminValidation, addOrderItem);
router.put("/update", adminValidation, updateOrderItem);
router.delete("/delete", adminValidation, deleteOrderItem);


router.get("/get", authValidation, getOrderItems);

module.exports = router;

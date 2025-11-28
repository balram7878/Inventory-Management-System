const express = require("express");
const { 
  placeOrder,
  cancelOrder,
  updateOrder,
  getOrderDetails,
  getUserOrders,
  getAllOrders
} = require("./order.controller");

const authValidation = require("../../middleware/authValidation");
const adminValidation = require("../../middleware/adminValidation");

const router = express.Router();

router.post("/place-order", authValidation, placeOrder);
router.get("/get-order-details", authValidation, getOrderDetails);
router.get("/my-orders", authValidation, getUserOrders);
router.post("/cancel-order", authValidation, cancelOrder);


router.get("/all-orders", adminValidation, getAllOrders);


router.put("/update-order-details", adminValidation, updateOrder);

module.exports = router;

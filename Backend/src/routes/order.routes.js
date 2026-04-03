const express = require("express");
const { createOrder, getOrders, getMyOrders, payForOrder } = require("../controllers/order.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, authorize("admin", "staff"), createOrder);
router.get("/", protect, authorize("admin", "staff"), getOrders);
router.get("/my", protect, authorize("customer", "staff", "admin"), getMyOrders);
router.post("/:orderId/pay", protect, authorize("customer", "staff", "admin"), payForOrder);

module.exports = router;

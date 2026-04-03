const express = require("express");
const { protect, authorize } = require("../middleware/auth.middleware");
const {
	getCart,
	addToCart,
	removeFromCart,
	updateCartItemQuantity,
	checkoutCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", protect, authorize("customer", "staff", "admin"), getCart);
router.post("/items", protect, authorize("customer", "staff", "admin"), addToCart);
router.patch("/items/:productId", protect, authorize("customer", "staff", "admin"), updateCartItemQuantity);
router.delete("/items/:productId", protect, authorize("customer", "staff", "admin"), removeFromCart);
router.post("/checkout", protect, authorize("customer", "staff", "admin"), checkoutCart);

module.exports = router;

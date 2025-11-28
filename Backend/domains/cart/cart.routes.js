const express = require("express");
const authValidation = require("../../middleware/authValidation");
const {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
  clearCart
} = require("./cart.controller");

const router = express.Router();


router.post("/add", authValidation, addToCart);
router.put("/update", authValidation, updateCartItem);
router.delete("/remove", authValidation, removeFromCart);
router.get("/get", authValidation, getCart);
router.delete("/clear", authValidation, clearCart);

module.exports = router;

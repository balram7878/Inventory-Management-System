const express = require("express");
const authValidation = require("../../middleware/authValidation");

const {
  initiatePayment,
  confirmPayment
} = require("./payment.controller");

const router = express.Router();

router.post("/initiate", authValidation, initiatePayment);
router.post("/confirm", authValidation, confirmPayment);

module.exports = router;

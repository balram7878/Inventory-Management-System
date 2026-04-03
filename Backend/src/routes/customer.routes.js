const express = require("express");
const { createCustomer, getCustomers } = require("../controllers/customer.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, authorize("admin", "staff"), createCustomer);
router.get("/", protect, authorize("admin", "staff"), getCustomers);

module.exports = router;

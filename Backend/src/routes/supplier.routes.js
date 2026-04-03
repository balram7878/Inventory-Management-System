const express = require("express");
const { createSupplier, getSuppliers } = require("../controllers/supplier.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, authorize("admin", "staff"), createSupplier);
router.get("/", protect, authorize("admin", "staff"), getSuppliers);

module.exports = router;

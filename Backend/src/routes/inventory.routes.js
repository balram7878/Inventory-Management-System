const express = require("express");
const { stockIn, stockOut } = require("../controllers/inventory.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/stock-in", protect, authorize("admin", "staff"), stockIn);
router.post("/stock-out", protect, authorize("admin", "staff"), stockOut);

module.exports = router;

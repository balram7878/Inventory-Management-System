const express = require("express");
const {
  login,
  logout,
  customer,
  admin,
  authentication,
  profile,
  deleteProfile,
} = require("./auth.controller");
const authValidation = require("../../middleware/authValidation");
const adminValidation = require("../../middleware/adminValidation");
const router = express.Router();

router.post("/register/customer", customer);
router.post("/register/admin", adminValidation, admin);
router.post("/login", login);
router.post("/logout", authValidation, logout);
router.get("/profile", authValidation, profile);
router.get("/check", authValidation, authentication);
router.delete("/delete-profile", authValidation, deleteProfile);

module.exports = router;

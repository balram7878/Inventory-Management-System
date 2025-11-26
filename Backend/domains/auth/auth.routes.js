const express = require("express");
const {
  login,
  logout,
  customer,
  admin,
  authentication,
  profile,
} = require("./auth.controller");
const router = express.Router();

router.post("/register/customer", customer);
router.post("register/admin", admin);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", profile);
router.get("/check", authentication);

module.exports = router;

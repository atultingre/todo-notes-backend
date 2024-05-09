// routes/index.js
const express = require("express");
const router = express.Router();
const {
  loginUser,
  forgotPassword,
  registerUser,
  verifyUser,
} = require("../controllers/user.controller");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify", verifyUser);

module.exports = router;

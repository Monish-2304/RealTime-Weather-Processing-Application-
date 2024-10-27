const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getCurrentUser,
  authenticateToken,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/user", authenticateToken, getCurrentUser);
module.exports = router;

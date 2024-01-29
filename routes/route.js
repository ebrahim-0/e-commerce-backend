const express = require("express");
const login = require("../controller/login.js");
const createUser = require("../controller/signup.js");
const { authenticate } = require("../middlewares/auth.js");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", login);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.get("/profile", authenticate, (req, res) => {
  res.json({
    message: `Welcome ${req.user.name}`,
    token,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    phoneNumber: req.user.phoneNumber,
  });
});

module.exports = router;

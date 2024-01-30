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
    user: {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phoneNumber: req.user.phoneNumber,
    },
    token: res.cookie.token,
  });
});

module.exports = router;

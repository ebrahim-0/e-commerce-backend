const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    password_confirmation,
    phoneNumber,
    role = "user",
  } = req.body;

  const errors = {};

  if (!name || name.trim().length === 0) {
    errors.name = "Name is required";
  }

  if (!email || email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!password || password.trim().length === 0) {
    errors.password = "Password is required";
  } else if (password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters long";
  } else if (password !== password_confirmation) {
    errors.password_confirmation = "Passwords do not match";
  }

  if (!phoneNumber || phoneNumber.trim().length === 0) {
    errors.phoneNumber = "Phone Number is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .json({ message: "User Already Exist. Please Login" });
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
      process.env.SECRET_KEY,
      { expiresIn: process.env.TOKEN_EXPIRY }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    console.log("cookie set successfully");

    res.json({
      message: "User Created Successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
      token,
    });
  } catch (error) {
    console.log("Got an error", error);
  }
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

module.exports = createUser;

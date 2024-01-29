const jwt = require("jsonwebtoken");
const User = require("../models/User");

const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    if (!(name && email && password && phoneNumber)) {
      res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .json({ message: "User Already Exist. Please Login" });
    }
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const user = await newUser.save();

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1 hour",
    });

    console.log("cookie set successfully");

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({
      message: "User Created Successfully",
      token,
      name: user.name,
      role: user.role,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.log("Got an error", error);
  }
};
module.exports = createUser;

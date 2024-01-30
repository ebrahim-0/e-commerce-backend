const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { name, email, password, phoneNumber, role = "user" } = req.body;

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
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1 hour",
    });

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
module.exports = createUser;

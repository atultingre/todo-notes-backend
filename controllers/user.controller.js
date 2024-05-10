const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Validate input data
    if (!username || !email || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address" });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      username: username,
      email: email,
      phone: phone,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the user data (excluding the password)
    res.status(200).json({
      success: true,
      token: token,
      userId: user._id,
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        tasks: user.tasks,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

// Store the tokens and their associated users in memory or a database
const tokenStore = {};

const verifyUser = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Find the user by email and phone
    const user = await User.findOne({ email: email, phone: phone });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate a token for the user
    const token = generateToken();
    tokenStore[token] = user.email;

    return res.status(200).json({
      success: true,
      message: "Token generated and sent to the user",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmNewPassword } = req.body;

    // Check if the token exists and get the associated username
    const email = tokenStore[token];
    if (!email) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Find the user by username
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if newPassword and confirmNewPassword match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Update the password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    // Delete the token from the token store
    delete tokenStore[token];

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, verifyUser };

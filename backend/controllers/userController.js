const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const axios = require("axios");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");

const ELASTIC_EMAIL_API_KEY = process.env.ELASTIC_EMAIL_API_KEY;

// Register new user
const register = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const passwordPattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one letter, one number, and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    res.status(201).json({ token, _id: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Login existing user
const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.status(200).json({
        _id: user._id,
        token,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { sports, interests, location, phone_number, terms } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        sports,
        interests,
        location,
        phone_number,
        terms,
        avatar:
          req.files && req.files["avatar"]
            ? req.files["avatar"][0].path
            : undefined,
      },
      { new: true } // Return the updated user
    );

    if (!user) {
      return res.status(404).json({ message: "User Not Found, Login" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
});

// View User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  try {
    const expiredToken = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "0.5 second" }
    );
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Server Status
const serverStatus = asyncHandler(async (req, res) => {
  try {
    res.status(200).json("Server condition is okay");
  } catch (error) {
    console.log("Server Error");
    res.status(500).json({ message: "Server Error" });
  }
});

//Reset password link

const sentResetLink = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a reset token and expiration time
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour

    // Update user's reset token and expiration time in the database
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Send reset password email using Elastic Email API
    const link = `https://beta-assist.netlify.app/password/${resetToken}`;
    const data = {
      from: "oloogeorge633@gmail.com",
      to: email,
      subject: "Password Reset",
      bodyText: `Click the link to reset your password: ${link} .......Stream254`,
      apiKey: ELASTIC_EMAIL_API_KEY,
    };

    const response = await axios({
      method: "post",
      url: "https://api.elasticemail.com/v2/email/send",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.success) {
      res
        .status(200)
        .json({ message: `Password reset link sent successfully.` });
    } else {
      res.status(500).json({ message: response.data.error });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});

//Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    // Password validation using regular expression
    const passwordPattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one letter, one number, and one special character.",
      });
    }

    // Update user's password and reset token fields
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
});

module.exports = {
  register,
  login,
  updateProfile,
  getUserProfile,
  logout,
  serverStatus,
  sentResetLink,
  resetPassword,
};

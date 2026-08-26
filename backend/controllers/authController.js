const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bhairavisecretkey123';

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // Check if user already exists by email or phone
    const query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });

    const existingUser = await User.findOne({ $or: query });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this Email or Phone Number is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: email ? email.toLowerCase() : undefined,
      phone: phone || undefined,
      password: hashedPassword
    });

    await newUser.save();
    return res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Server error during registration." });
  }
};

// Login (Supports Email or Phone identifier)
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Provide your email/phone and password." });
    }

    // Search by email or phone match
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { phone: identifier.trim() }
      ]
    });

    if (!user || !user.password) {
      return res.status(400).json({ message: "No account found with this identifier or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials. Please verify your password." });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      name: user.name,
      email: user.email || '',
      phone: user.phone || ''
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error during sign in." });
  }
};

// Google OAuth Token verification handler
exports.googleAuth = async (req, res) => {
  try {
    const { name, email, googleId } = req.body;
    if (!email || !googleId) {
      return res.status(400).json({ message: "Invalid Google authentication payload." });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = new User({
        name,
        email: email.toLowerCase(),
        googleId
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      name: user.name,
      email: user.email || '',
      phone: user.phone || ''
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.status(500).json({ message: "Google authentication failed." });
  }
};

// Forgot Password Request
exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ message: "Please provide your registered email or phone." });

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { phone: identifier.trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "No account found registered with this identifier." });
    }

    const debugCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetPasswordCode = debugCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    return res.json({ message: "Reset code generated.", debugCode });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ message: "Failed to process password recovery." });
  }
};

// Reset Password Confirm
exports.resetPassword = async (req, res) => {
  try {
    const { identifier, code, newPassword } = req.body;
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { phone: identifier.trim() }
      ],
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset code." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ message: "Failed to reset password." });
  }
};
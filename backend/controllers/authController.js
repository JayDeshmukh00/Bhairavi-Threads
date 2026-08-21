const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User').User;

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ email, password: hashedPassword }).save();
    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating account" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'secret');
      res.json({ token, message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};
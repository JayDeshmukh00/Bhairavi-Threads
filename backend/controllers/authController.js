const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModule = require('../models/User');
const User = UserModule.User || UserModule;

const MASTER_ADMIN_PHONE = '9657127253';
const resetStore = {};

const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Strict validation: Ensure phone number is provided and not already registered
    if (!phone || phone.trim() === '') {
      return res.status(400).json({ message: "Phone number is required for Atelier registration." });
    }

    const trimmedPhone = phone.trim();

    // Prevent anyone else from registering with the master admin phone number
    if (trimmedPhone === MASTER_ADMIN_PHONE) {
      return res.status(400).json({ message: "This administrative phone number is reserved and cannot be registered by standard users." });
    }

    // Check if user already exists with this exact email or phone
    const existingUser = await User.findOne({ $or: [{ email }, { phone: trimmedPhone }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "An account with this email address already exists." });
      }
      if (existingUser.phone === trimmedPhone) {
        return res.status(400).json({ message: "An account with this phone number already exists. Please sign in instead." });
      }
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character." 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name: name || email.split('@')[0], 
      email, 
      phone: trimmedPhone, 
      password: hashedPassword 
    });
    await newUser.save();

    res.status(201).json({ message: "Account created successfully!", name: newUser.name });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Error creating account" });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const cleanId = identifier.trim();
    
    const user = await User.findOne({ $or: [{ email: cleanId }, { phone: cleanId }] });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, email: user.email, phone: user.phone }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
      res.json({ 
        token, 
        name: user.name || user.email.split('@')[0], 
        email: user.email,
        phone: user.phone || '',
        message: "Login successful!" 
      });
    } else {
      res.status(401).json({ message: "Invalid credentials. Please verify your email/phone and password." });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    const cleanId = identifier.trim();
    const user = await User.findOne({ $or: [{ email: cleanId }, { phone: cleanId }] });
    if (!user) return res.status(404).json({ message: "No account found with this email or phone number." });

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    resetStore[cleanId] = { code: resetCode, expiresAt: Date.now() + 10 * 60 * 1000 };

    console.log(`[BHAIRAVI PASSWORD RESET] Code for ${cleanId}: ${resetCode}`);
    res.json({ success: true, message: "Password reset code generated.", debugCode: resetCode });
  } catch (error) {
    console.error("ForgotPassword Error:", error);
    res.status(500).json({ message: "Error processing password reset." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { identifier, code, newPassword } = req.body;
    const cleanId = identifier.trim();
    const record = resetStore[cleanId];

    if (!record) return res.status(400).json({ message: "No active reset request found. Request a new code." });
    if (Date.now() > record.expiresAt) return res.status(400).json({ message: "Reset code has expired." });
    if (record.code !== code) return res.status(400).json({ message: "Invalid reset code." });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "New password does not meet security requirements (Min 8 chars, 1 uppercase, 1 number, 1 special character)." });
    }

    const user = await User.findOne({ $or: [{ email: cleanId }, { phone: cleanId }] });
    if (!user) return res.status(404).json({ message: "User not found." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    delete resetStore[cleanId];
    res.json({ success: true, message: "Password updated successfully. Please sign in." });
  } catch (error) {
    console.error("ResetPassword Error:", error);
    res.status(500).json({ message: "Error resetting password." });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword
};
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, sparse: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, sparse: true, unique: true, trim: true },
  password: { type: String }, // Optional for Google OAuth users
  googleId: { type: String, sparse: true, unique: true },
  resetPasswordCode: { type: String },
  resetPasswordExpires: { type: Date },
  address: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    pincode: String,
    state: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
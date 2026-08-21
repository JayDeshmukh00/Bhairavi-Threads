const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  street: String,
  city: String,
  pincode: String,
  state: String
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: addressSchema
});

module.exports = {
  User: mongoose.model('User', userSchema),
  addressSchema
};
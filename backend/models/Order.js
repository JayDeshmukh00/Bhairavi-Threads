const mongoose = require('mongoose');
const { addressSchema } = require('./User');

const orderSchema = new mongoose.Schema({
  customerEmail: String,
  items: Array,
  totalAmount: Number,
  shippingAddress: addressSchema,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
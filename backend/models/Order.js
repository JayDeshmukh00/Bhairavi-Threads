const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerEmail: { type: String, required: true },
  items: [{
    _id: String,
    name: String,
    price: Number,
    qty: Number,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    fullName: { type: String },
    phone: { type: String },
    street: { type: String },
    city: { type: String },
    pincode: { type: String },
    state: { type: String }
  },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
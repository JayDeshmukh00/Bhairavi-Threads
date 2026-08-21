const Order = require('../models/Order');

exports.getUserOrders = async (req, res) => {
  try {
    const email = req.query.email;
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { customerEmail, items, totalAmount, shippingAddress } = req.body;
    const newOrder = new Order({ customerEmail, items, totalAmount, shippingAddress });
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: "Order status updated!", updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};
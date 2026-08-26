require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Order = require('./models/Order'); // Ensure your Order model is imported for CSV export

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authController = require('./controllers/authController');

const app = express();
app.use(express.json());

// Strict CORS setup for production (Vercel) & local development
const allowedOrigins = [
  'https://bhairavi-threads.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation: This origin is not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Connect to MongoDB Database
connectDB();

// Mount Router files
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

// Explicit Auth & Password Reset Endpoints (Safely mapped to authController functions)
if (authController && typeof authController.signup === 'function') {
  app.post('/api/signup', authController.signup);
}
if (authController && typeof authController.login === 'function') {
  app.post('/api/login', authController.login);
}
if (authController && typeof authController.forgotPassword === 'function') {
  app.post('/api/auth/forgot-password', authController.forgotPassword);
}
if (authController && typeof authController.resetPassword === 'function') {
  app.post('/api/auth/reset-password', authController.resetPassword);
}

// Admin Download Orders CSV Endpoint
app.get('/api/admin/orders/export-csv', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    let csv = 'Order ID,Customer Email,Total Amount,Status,Date\n';
    orders.forEach(o => {
      csv += `"${o._id}","${o.customerEmail}","${o.totalAmount}","${o.status || 'Pending'}","${o.createdAt}"\n`;
    });
    res.header('Content-Type', 'text/csv');
    res.attachment('bhairavi_orders_export.csv');
    return res.send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err);
    return res.status(500).json({ message: "Failed to generate CSV export." });
  }
});

// Root route check for deployment status
app.get('/', (req, res) => {
  res.send('Bhairavi Threads Backend is running successfully!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
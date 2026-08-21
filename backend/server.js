require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

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
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
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

// Mount Routes
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

// Root route check for deployment status
app.get('/', (req, res) => {
  res.send('Bhairavi Threads Backend is running successfully!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
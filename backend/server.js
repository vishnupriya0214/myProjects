const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// CORS Configuration - Allow your frontend domain
const corsOptions = {
  origin: [
    'http://localhost:3000',           // Create React App dev
    'http://localhost:5173',           // Vite dev server
    'https://myfrontend-r7n0.onrender.com', // Your actual frontend URL on Render
    // Add your custom domain here if you have one
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Basic route for health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Test route to check if products are being fetched
app.get('/api/test', async (req, res) => {
  try {
    const Product = require('./models/Product'); // Adjust path as needed
    const count = await Product.countDocuments();
    res.json({ 
      message: 'API is working!', 
      productsInDB: count,
      mongooseConnection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error checking database', 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log('📊 Database:', mongoose.connection.name);
        
        // Listen on 0.0.0.0 for Render deployment
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 CORS enabled for:`, corsOptions.origin);
            console.log(`📡 Health check: https://your-backend-url.onrender.com/`);
            console.log(`🧪 Test endpoint: https://your-backend-url.onrender.com/api/test`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1); // Exit if database connection fails
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log('Unhandled Promise Rejection:', err.message);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err.message);
    process.exit(1);
});
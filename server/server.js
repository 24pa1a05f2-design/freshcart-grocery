const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { runSeed } = require('./seed/seed');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Grocery Delivery Management API'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminAuthRoutes); // /api/admin/login, /api/admin/logout, /api/admin/me
app.use('/api/admin', adminRoutes);     // /api/admin/dashboard, /api/admin/products, /api/admin/orders, etc.
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const isMemory = await connectDB();

    // Check if seeding is needed (empty products or admin)
    const productCount = await Product.countDocuments();
    const adminCount = await Admin.countDocuments();

    if (productCount === 0 || adminCount === 0 || isMemory) {
      console.log('⚡ Initializing database with seed data...');
      await runSeed(false);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Grocery Server running on http://localhost:${PORT}`);
      console.log(`📋 API Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

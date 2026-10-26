const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAnalytics,
  getAdminProducts,
  getAdminCategories,
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  getAdminUsers,
  toggleUserStatus,
  getAdminUserOrders,
  getAdminInventory,
  updateStock
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

// All endpoints in this router require strict admin privileges
router.use(protectAdmin);

// Dashboard & Analytics
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

// Product & Category overviews
router.get('/products', getAdminProducts);
router.get('/categories', getAdminCategories);

// Orders
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.put('/orders/:id/status', updateOrderStatus);

// Users
router.get('/users', getAdminUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/users/:id/orders', getAdminUserOrders);

// Inventory
router.get('/inventory', getAdminInventory);
router.put('/inventory/:id', updateStock);

module.exports = router;

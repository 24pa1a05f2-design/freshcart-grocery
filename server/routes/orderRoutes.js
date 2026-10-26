const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
} = require('../controllers/orderController');
const { updateOrderStatus } = require('../controllers/adminController');
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protectUser, createOrder);
router.get('/', protectUser, getMyOrders);
router.get('/:id', protectUser, getOrderById);
router.put('/:id/cancel', protectUser, cancelOrder);

// Admin order status update route (as in API specification)
router.put('/:id/status', protectAdmin, updateOrderStatus);

module.exports = router;

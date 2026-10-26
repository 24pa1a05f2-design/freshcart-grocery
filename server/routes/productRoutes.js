const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getPopularProducts
} = require('../controllers/productController');
const {
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/popular', getPopularProducts);
router.get('/:id', getProductById);

// Admin-only mutation routes
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

module.exports = router;

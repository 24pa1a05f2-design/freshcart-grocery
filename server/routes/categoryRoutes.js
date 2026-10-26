const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug
} = require('../controllers/categoryController');
const {
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCategories);
router.get('/:idOrSlug', getCategoryBySlug);

// Admin-only mutation routes
router.post('/', protectAdmin, createCategory);
router.put('/:id', protectAdmin, updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

module.exports = router;

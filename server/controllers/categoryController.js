const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all active categories with product counts
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    // Count products per category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id, isActive: true });
        return {
          ...cat.toObject(),
          productCount: count
        };
      })
    );

    return res.status(200).json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug or id
// @route   GET /api/categories/:idOrSlug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

    const category = await Category.findOne({
      $or: [{ _id: isId ? idOrSlug : null }, { slug: idOrSlug.toLowerCase() }]
    });

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    return res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug
};

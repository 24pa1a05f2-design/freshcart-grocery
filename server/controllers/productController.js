const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Fetch products with search, filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      q,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      sort,
      page = 1,
      limit = 12,
      featured,
      popular
    } = req.query;

    const queryFilter = { isActive: true };

    const searchTerm = search || q;
    if (searchTerm) {
      const regex = new RegExp(searchTerm.trim(), 'i');
      queryFilter.$or = [
        { name: regex },
        { brand: regex },
        { categoryName: regex },
        { description: regex }
      ];
    }

    if (category && category !== 'all') {
      // Could be category slug or category ID
      const catDoc = await Category.findOne({
        $or: [{ _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }, { slug: category.toLowerCase() }]
      });
      if (catDoc) {
        queryFilter.category = catDoc._id;
      } else {
        queryFilter.categoryName = new RegExp(`^${category}$`, 'i');
      }
    }

    if (brand && brand !== 'all') {
      queryFilter.brand = new RegExp(`^${brand}$`, 'i');
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      queryFilter.price = {};
      if (minPrice !== undefined && minPrice !== '') queryFilter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') queryFilter.price.$lte = Number(maxPrice);
    }

    if (inStock === 'true' || inStock === true) {
      queryFilter.stock = { $gt: 0 };
    }

    if (featured === 'true') {
      queryFilter.isFeatured = true;
    }

    if (popular === 'true') {
      queryFilter.isPopular = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'popular') {
      sortOption = { numReviews: -1, rating: -1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const totalProducts = await Product.countDocuments(queryFilter);
    const products = await Product.find(queryFilter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      products,
      page: currentPage,
      pages: Math.ceil(totalProducts / pageSize) || 1,
      totalProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug description');
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    // Also fetch 4 related products in the same category
    const relatedProducts = await Product.find({
      category: product.category._id || product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4);

    return res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);

    return res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular products
// @route   GET /api/products/popular
// @access  Public
const getPopularProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ rating: -1, numReviews: -1 })
      .populate('category', 'name slug')
      .limit(8);

    return res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getPopularProducts
};

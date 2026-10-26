const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

// ==========================================
// 1. DASHBOARD & OVERVIEW
// ==========================================

const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();

    // Total revenue from all non-cancelled orders
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Low stock count (< 10) and out of stock count (== 0)
    const lowStockCount = await Product.countDocuments({ stock: { $gt: 0, $lt: 10 }, isActive: true });
    const outOfStockCount = await Product.countDocuments({ stock: 0, isActive: true });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 users
    const recentUsers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock product alerts (top 6)
    const lowStockProducts = await Product.find({ stock: { $lt: 10 }, isActive: true })
      .sort({ stock: 1 })
      .limit(6);

    // Order status breakdown
    const orderStatusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // Last 7 days sales for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const salesByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          orderStatus: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalUsers,
        totalProducts,
        lowStockCount,
        outOfStockCount
      },
      recentOrders,
      recentUsers,
      lowStockProducts,
      orderStatusCounts,
      salesByDay
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. ANALYTICS
// ==========================================

const getAnalytics = async (req, res, next) => {
  try {
    // 1. Sales Trend (by month or by day)
    const monthlySales = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%b %Y', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $limit: 12 }
    ]);

    // 2. Orders by Status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // 3. Category distribution (Products per Category)
    const categoryDistribution = await Product.aggregate([
      { $group: { _id: '$categoryName', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 4. Payment method distribution
    const paymentMethods = await Order.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } }
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        monthlySales,
        ordersByStatus,
        categoryDistribution,
        paymentMethods
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. PRODUCT MANAGEMENT
// ==========================================

const getAdminProducts = async (req, res, next) => {
  try {
    const { search, category, stockStatus, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { brand: regex }, { categoryName: regex }];
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (stockStatus === 'low') {
      filter.stock = { $gt: 0, $lt: 10 };
    } else if (stockStatus === 'out') {
      filter.stock = 0;
    } else if (stockStatus === 'available') {
      filter.stock = { $gte: 10 };
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
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

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      discountPrice,
      stock,
      unit,
      image,
      isActive,
      isFeatured,
      isPopular
    } = req.body;

    if (!name || !category || price === undefined || stock === undefined || !image) {
      return res.status(400).json({
        success: false,
        message: 'Name, Category, Price, Stock, and Image are required'
      });
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category specified'
      });
    }

    const product = await Product.create({
      name,
      description: description || '',
      category,
      categoryName: categoryDoc.name,
      brand: brand || 'FreshFarm',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: Number(stock),
      unit: unit || 'kg',
      image,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: Boolean(isFeatured),
      isPopular: Boolean(isPopular)
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = { ...req.body };

    if (updates.category && updates.category !== product.category.toString()) {
      const catDoc = await Category.findById(updates.category);
      if (catDoc) {
        updates.categoryName = catDoc.name;
      }
    }

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.discountPrice !== undefined) {
      updates.discountPrice = updates.discountPrice ? Number(updates.discountPrice) : null;
    }
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. CATEGORY MANAGEMENT
// ==========================================

const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
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

const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, icon, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const existing = await Category.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || '',
      image: image || '',
      icon: icon || '',
      isActive: isActive !== undefined ? isActive : true
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (req.body.name) {
      category.name = req.body.name.trim();
      category.slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (req.body.description !== undefined) category.description = req.body.description;
    if (req.body.image !== undefined) category.image = req.body.image;
    if (req.body.icon !== undefined) category.icon = req.body.icon;
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive;

    await category.save();

    // Update denormalized categoryName in products if name changed
    if (req.body.name) {
      await Product.updateMany({ category: category._id }, { categoryName: category.name });
    }

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const count = await Product.countDocuments({ category: req.params.id });
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: it is assigned to ${count} product(s). Reassign or remove them first.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. ORDER MANAGEMENT
// ==========================================

const getAdminOrders = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.orderStatus = status;
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { orderNumber: regex },
        { 'deliveryAddress.name': regex },
        { 'deliveryAddress.phone': regex }
      ];
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const totalOrders = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      orders,
      page: currentPage,
      pages: Math.ceil(totalOrders / pageSize) || 1,
      totalOrders
    });
  } catch (error) {
    next(error);
  }
};

const getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image unit price stock');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;

    // Append to status timeline
    order.statusTimeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status} by admin`
    });

    // If marked delivered, update paymentStatus to Completed
    if (status === 'Delivered') {
      order.paymentStatus = 'Completed';
    }

    // If previously not cancelled and now cancelled, restore stock
    if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. USER MANAGEMENT
// ==========================================

const getAdminUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = { role: 'customer' };

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const skip = (currentPage - 1) * pageSize;

    const totalUsers = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Compute orders count and total spend for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({ user: u._id });
        const spendAgg = await Order.aggregate([
          { $match: { user: u._id, orderStatus: { $ne: 'Cancelled' } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalSpent = spendAgg.length > 0 ? spendAgg[0].total : 0;

        return {
          ...u.toObject(),
          orderCount,
          totalSpent
        };
      })
    );

    return res.status(200).json({
      success: true,
      users: usersWithStats,
      page: currentPage,
      pages: Math.ceil(totalUsers / pageSize) || 1,
      totalUsers
    });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive
    });
  } catch (error) {
    next(error);
  }
};

const getAdminUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 7. INVENTORY MANAGEMENT
// ==========================================

const getAdminInventory = async (req, res, next) => {
  try {
    const { search, filter } = req.query;
    const query = { isActive: true };

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { categoryName: regex }, { brand: regex }];
    }

    if (filter === 'low') {
      query.stock = { $gt: 0, $lt: 10 };
    } else if (filter === 'out') {
      query.stock = 0;
    } else if (filter === 'available') {
      query.stock = { $gte: 10 };
    }

    const items = await Product.find(query)
      .select('name image unit price discountPrice stock category categoryName brand')
      .populate('category', 'name')
      .sort({ stock: 1 });

    return res.status(200).json({
      success: true,
      inventory: items
    });
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || isNaN(stock) || Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid non-negative stock number is required'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: Number(stock) },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Stock updated to ${product.stock} ${product.unit}`,
      product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAnalytics,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  getAdminUsers,
  toggleUserStatus,
  getAdminUserOrders,
  getAdminInventory,
  updateStock
};

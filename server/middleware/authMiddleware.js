const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'grocery_super_secret_jwt_key_2026_customer';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'grocery_super_secret_jwt_key_2026_admin_portal';

// Helper to generate token for Customers
const generateUserToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: 'customer' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper to generate token for Admins
const generateAdminToken = (admin) => {
  return jwt.sign(
    { id: admin._id, email: admin.email, role: 'admin' },
    ADMIN_JWT_SECRET,
    { expiresIn: '2d' }
  );
};

// Customer protection middleware
const protectUser = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No customer token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Invalid token role for customer access'
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Customer account not found'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid. Please log in again.'
    });
  }
};

// Admin protection middleware
const protectAdmin = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Admin authentication required'
    });
  }

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Admin privilege required'
      });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or revoked'
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account has been deactivated.'
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Admin session expired or invalid. Please log in as admin.'
    });
  }
};

module.exports = {
  protectUser,
  protectAdmin,
  generateUserToken,
  generateAdminToken
};

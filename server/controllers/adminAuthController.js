const Admin = require('../models/Admin');
const { generateAdminToken } = require('../middleware/authMiddleware');

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide admin email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials'
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account has been deactivated. Access denied.'
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials'
      });
    }

    const token = generateAdminToken(admin);

    return res.status(200).json({
      success: true,
      message: 'Admin authorization successful',
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Admin Profile
// @route   GET /api/admin/me
// @access  Private (Admin only)
const getAdminMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    return res.status(200).json({
      success: true,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Logout
// @route   POST /api/admin/logout
// @access  Public
const logoutAdmin = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Admin session terminated successfully'
  });
};

module.exports = {
  loginAdmin,
  getAdminMe,
  logoutAdmin
};

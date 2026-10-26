const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAdminMe,
  logoutAdmin
} = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', protectAdmin, getAdminMe);

module.exports = router;

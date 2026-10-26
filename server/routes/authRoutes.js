const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  logoutUser
} = require('../controllers/authController');
const { protectUser } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected customer routes
router.get('/me', protectUser, getMe);
router.put('/profile', protectUser, updateProfile);
router.put('/change-password', protectUser, changePassword);
router.post('/address', protectUser, addAddress);
router.put('/address/:addressId', protectUser, updateAddress);
router.delete('/address/:addressId', protectUser, deleteAddress);

module.exports = router;

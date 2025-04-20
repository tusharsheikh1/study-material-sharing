const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  verifyOtp,
  sendOtp,
  resetPassword,
  changePassword,
} = require('../controllers/authController');

const { protect, adminProtect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', registerUser);        // Register with studentId
router.post('/login', loginUser);              // Login with email or studentId
router.post('/verify-otp', verifyOtp);         // OTP verification
router.post('/send-otp', sendOtp);             // Send OTP (email only now)
router.post('/reset-password', resetPassword); // Reset using studentId/email and OTP

// Protected Routes
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getUser);
router.post('/change-password', protect, changePassword);

// Admin Dashboard Test
router.get('/admin/dashboard', protect, adminProtect, (req, res) => {
  res.json({ message: 'Welcome to the admin panel!' });
});

module.exports = router;

const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  verifyOtp,
  sendOtp,
  resetPassword,
  changePassword, // ✅ Added this
} = require('../controllers/authController');

const { protect, adminProtect } = require('../middleware/authMiddleware'); // Import adminProtect middleware

const router = express.Router();

// Public Routes
router.post('/register', registerUser);        // Register a new user
router.post('/login', loginUser);              // Login user
router.post('/verify-otp', verifyOtp);         // Verify OTP
router.post('/send-otp', sendOtp);             // Send OTP for general purposes
router.post('/reset-password', resetPassword); // Reset password using OTP

// Protected Routes
router.post('/logout', protect, logoutUser);   // Logout user
router.get('/me', protect, getUser);           // Get authenticated user details
router.post('/change-password', protect, changePassword); // ✅ Change password route

// Admin Route
router.get('/admin/dashboard', protect, adminProtect, (req, res) => {
  res.json({ message: 'Welcome to the admin panel!' });
});

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  getUserStats,
  approveUser,
  changeUserRole,
  deleteUser,
  updateProfile,
  searchUsers,
  getUserActivity,
} = require('../controllers/userController');

const { protect, adminProtect } = require('../middleware/authMiddleware');
const upload = require('../utils/cloudinaryUploader');

// Public routes (with authentication)
router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUserById);
router.get('/:id/stats', protect, getUserStats);
router.get('/:id/activity', protect, getUserActivity);

// User profile management
router.put('/update-profile', protect, upload.single('image'), updateProfile);

// Admin-only routes
router.get('/', protect, adminProtect, getAllUsers);
router.put('/approve/:id', protect, adminProtect, approveUser);
router.put('/role/:id', protect, adminProtect, changeUserRole);
router.delete('/:id', protect, adminProtect, deleteUser);

module.exports = router;
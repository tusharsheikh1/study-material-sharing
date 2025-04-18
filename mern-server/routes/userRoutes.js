const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  approveUser,
  changeUserRole,
  deleteUser,
  updateProfile,
} = require('../controllers/userController');

const { protect, adminProtect } = require('../middleware/authMiddleware');
const upload = require('../utils/cloudinaryUploader'); // ✅ Updated path to Cloudinary uploader

// Admin-only routes
router.get('/', protect, adminProtect, getAllUsers);
router.put('/approve/:id', protect, adminProtect, approveUser);
router.put('/role/:id', protect, adminProtect, changeUserRole);
router.delete('/:id', protect, adminProtect, deleteUser);

// ✅ Update profile (with image upload)
router.put('/update-profile', protect, upload.single('image'), updateProfile);

module.exports = router;

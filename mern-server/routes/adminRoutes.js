const express = require('express');
const {
  getAllAdminsAndStaff,
  addAdminOrStaff,
  updateAdminOrStaff,
  deleteAdminOrStaff,
} = require('../controllers/adminController');
const { protect, adminProtect } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-only routes for managing faculty & CRs
router.get('/', protect, adminProtect, getAllAdminsAndStaff);     // Get all admins/faculty/CR
router.post('/', protect, adminProtect, addAdminOrStaff);         // Add a new admin/faculty/CR
router.put('/:id', protect, adminProtect, updateAdminOrStaff);    // Update a user with admin/faculty/CR role
router.delete('/:id', protect, adminProtect, deleteAdminOrStaff); // Delete a user

module.exports = router;

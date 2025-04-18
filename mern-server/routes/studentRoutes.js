const express = require('express');
const {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} = require('../controllers/studentController');

const {
  protect,
  adminProtect,
  roleProtect,
} = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for managing student accounts (accessible by admin, faculty, CR)
router.route('/')
  .get(protect, roleProtect(['admin', 'faculty', 'cr']), getCustomers) // View all students
  .post(protect, roleProtect(['admin', 'faculty', 'cr']), addCustomer); // Add new student

router.route('/search')
  .get(protect, roleProtect(['admin', 'faculty', 'cr']), searchCustomers); // Search students

router.route('/:id')
  .put(protect, roleProtect(['admin', 'faculty', 'cr']), updateCustomer) // Update student
  .delete(protect, adminProtect, deleteCustomer); // Only admin can delete student

module.exports = router;

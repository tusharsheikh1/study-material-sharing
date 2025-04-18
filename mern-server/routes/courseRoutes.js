const express = require('express');
const {
  getCourses,
  addCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, adminProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCourses);
router.post('/', protect, adminProtect, addCourse);
router.delete('/:id', protect, adminProtect, deleteCourse); // ✅ NEW: Admin-only delete

module.exports = router;

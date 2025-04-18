const Course = require('../models/Course');
const Material = require('../models/Material'); // Only used in deleteCourse

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ semester: 1, courseCode: 1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};

// Add a new course (Admin only)
const addCourse = async (req, res) => {
  const { courseCode, courseName, semester } = req.body;

  if (!courseCode || !courseName || !semester) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const exists = await Course.findOne({ courseCode });
    if (exists) {
      return res.status(400).json({ message: 'Course with this code already exists.' });
    }

    const newCourse = await Course.create({ courseCode, courseName, semester });
    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add course', error: error.message });
  }
};

// Delete a course (Admin only)
const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const materialCount = await Material.countDocuments({ courseId: id });
    if (materialCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete. This course is linked to uploaded materials.',
      });
    }

    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete course', error: error.message });
  }
};

module.exports = {
  getCourses,
  addCourse,
  deleteCourse,
};

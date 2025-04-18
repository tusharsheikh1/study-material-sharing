const User = require('../models/User');

// Get all students
const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'student' }).select('-password');
    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};

// Add a new student
const addCustomer = async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;

  try {
    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const customer = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      role: 'student',
    });

    res.status(201).json({ message: 'Student added successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add student', error: error.message });
  }
};

// Update a student
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phoneNumber } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const customer = await User.findById(id);

    if (!customer || customer.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    customer.fullName = fullName || customer.fullName;
    customer.email = email || customer.email;
    customer.phoneNumber = phoneNumber || customer.phoneNumber;

    const updatedCustomer = await customer.save();

    res.status(200).json({ message: 'Student updated successfully', customer: updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error: error.message });
  }
};

// Delete a student
const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const customer = await User.findById(id);

    if (!customer || customer.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    await customer.deleteOne();
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student', error: error.message });
  }
};

// Search students by name, email, or phone number
const searchCustomers = async (req, res) => {
  const { query } = req.query;

  try {
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const customers = await User.find({
      role: 'student',
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phoneNumber: { $regex: query, $options: 'i' } },
      ],
    }).select('-password');

    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: 'No matching students found' });
    }

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search students', error: error.message });
  }
};

module.exports = {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
};

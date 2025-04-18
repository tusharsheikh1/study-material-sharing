const User = require('../models/User');

// ✅ Get all admins, faculty, and CRs
const getAllAdminsAndStaff = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ['admin', 'faculty', 'cr'] },
    }).select('-password');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add a new admin, faculty, or CR
const addAdminOrStaff = async (req, res) => {
  const { fullName, email, password, phoneNumber, role } = req.body;

  try {
    // Validate role
    if (!['admin', 'faculty', 'cr'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Allowed: admin, faculty, cr' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: `User with this email already exists.` });
    }

    const user = new User({
      fullName,
      email,
      password,
      phoneNumber,
      role,
      approved: true, // Admin-created users are auto-approved
    });

    await user.save();

    res.status(201).json({ message: `${role} added successfully.`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update an existing admin, faculty, or CR
const updateAdminOrStaff = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phoneNumber } = req.body;

  try {
    const user = await User.findById(id);

    if (!user || !['admin', 'faculty', 'cr'].includes(user.role)) {
      return res.status(404).json({ message: 'User not found or not a valid admin/staff.' });
    }

    // Only admin can update
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can update users.' });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();

    res.json({ message: `${user.role} updated successfully.`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete an admin, faculty, or CR
const deleteAdminOrStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user || !['admin', 'faculty', 'cr'].includes(user.role)) {
      return res.status(404).json({ message: 'User not found or not a valid admin/staff.' });
    }

    // Only admin can delete
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can delete users.' });
    }

    await User.deleteOne({ _id: id });

    res.json({ message: `${user.role} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllAdminsAndStaff,
  addAdminOrStaff,
  updateAdminOrStaff,
  deleteAdminOrStaff,
};

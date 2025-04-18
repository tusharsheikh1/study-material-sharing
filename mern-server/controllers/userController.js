const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// GET all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// APPROVE user
const approveUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.approved = true;
    if ((user.role === 'student' || user.role === 'cr')) {
      if (!user.semester) user.semester = 1;
      if (!user.batch) user.batch = '2021';
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve user', error: error.message });
  }
};

// CHANGE ROLE
const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const allowedRoles = ['admin', 'faculty', 'cr', 'student'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User rejected and deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// ✅ UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // from auth middleware

    if (!user) return res.status(404).json({ message: 'User not found' });

    const { fullName, semester, batch } = req.body;

    if (fullName) user.fullName = fullName;
    if (semester) user.semester = semester;
    if (batch) user.batch = batch;

    // Upload image if file is present
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_images',
        public_id: `${user._id}_profile`,
        overwrite: true,
      });
      user.profileImage = result.secure_url;
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  approveUser,
  changeUserRole,
  deleteUser,
  updateProfile, // ✅ added
};

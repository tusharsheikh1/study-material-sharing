const User = require('../models/User');
const { sendEmail } = require('./authController');
const {
  approvalTemplate,
  rejectionTemplate,
} = require('../utils/emailTemplates.cjs'); // ✅ Import templates from .cjs

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};

// Approve user
const approveUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const wasApproved = user.approved;
    user.approved = true;

    if ((user.role === 'student' || user.role === 'cr')) {
      if (!user.semester) user.semester = 1;
      if (!user.batch) user.batch = '2021';
    }

    await user.save({ validateBeforeSave: false });

    // ✅ Send email if user is being approved now
    if (!wasApproved) {
      const loginUrl = `${process.env.CLIENT_URL}/login`;
      await sendEmail(
        user.email,
        '🎉 Your Account Has Been Approved!',
        approvalTemplate(user.fullName, loginUrl)
      );
    }

    res.status(200).json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve user', error: error.message });
  }
};

// Change user role
const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'Role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role', error: error.message });
  }
};

// ✅ Reject user and send email before deleting
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Send rejection email
    await sendEmail(
      user.email,
      '❌ Account Rejected',
      rejectionTemplate(user.fullName)
    );

    await user.deleteOne(); // ✅ Delete user after email
    res.status(200).json({ message: 'User rejected and deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject user', error: error.message });
  }
};

// Update profile with Cloudinary image support
const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { fullName, email, phoneNumber, semester, batch } = req.body;
  const profileImage = req.file?.path;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.semester = semester || user.semester;
    user.batch = batch || user.batch;
    if (profileImage) user.profileImage = profileImage;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  approveUser,
  changeUserRole,
  deleteUser,
  updateProfile,
};

const User = require('../models/User');
const Post = require('../models/Post');
const { sendEmail } = require('./authController');
const { approvalTemplate } = require('../utils/emailTemplates.cjs');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get posts count
    const postsCount = await Post.countDocuments({ author: id });
    
    // Get total likes received on user's posts
    const userPosts = await Post.find({ author: id });
    const likesReceived = userPosts.reduce((total, post) => total + post.likes.length, 0);
    
    // Get friends count (for now, return 0 - implement friendship system later)
    const friendsCount = 0;
    
    // Get comments count on user's posts
    const commentsReceived = userPosts.reduce((total, post) => total + post.comments.length, 0);
    
    // Get shares count
    const sharesReceived = userPosts.reduce((total, post) => total + post.shares.length, 0);
    
    const stats = {
      postsCount,
      likesReceived,
      friendsCount,
      commentsReceived,
      sharesReceived,
      joinedDate: await User.findById(id).select('createdAt')
    };
    
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user stats', error: error.message });
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

    // Send email if user is being approved now
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

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Also delete user's posts
    await Post.deleteMany({ author: req.params.id });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Update profile with enhanced features
const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { 
    fullName, 
    email, 
    phoneNumber, 
    semester, 
    batch, 
    bio, 
    location, 
    website,
    coverImage 
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Safe updates
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (semester) user.semester = semester;
    if (batch) user.batch = batch;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (coverImage) user.coverImage = coverImage;
    if (req.file && req.file.path) user.profileImage = req.file.path;

    await user.save({ validateBeforeSave: false });

    // Return user without password
    const updatedUser = await User.findById(userId).select('-password');
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { studentId: { $regex: query, $options: 'i' } }
      ],
      approved: true
    }).select('-password').limit(20);
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search users', error: error.message });
  }
};

// Get user activity feed
const getUserActivity = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get recent posts by user
    const recentPosts = await Post.find({ author: id })
      .populate('author', 'fullName profileImage')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get recent comments by user
    const postsWithUserComments = await Post.find({
      'comments.user': id
    }).populate('author', 'fullName profileImage')
      .populate('comments.user', 'fullName profileImage')
      .sort({ 'comments.createdAt': -1 })
      .limit(5);
    
    const activity = {
      recentPosts,
      recentComments: postsWithUserComments
    };
    
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user activity', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserStats,
  approveUser,
  changeUserRole,
  deleteUser,
  updateProfile,
  searchUsers,
  getUserActivity,
};
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createPost,
  getPosts,
  getUserPosts,
  toggleLike,
  addComment,
  sharePost,
  deletePost,
  getTrendingPosts,
  searchPosts,
} = require('../controllers/postsController');

// Public routes (with authentication)
router.get('/', protect, getPosts);
router.get('/trending', protect, getTrendingPosts);
router.get('/search', protect, searchPosts);
router.get('/user/:userId', protect, getUserPosts);

// Post creation and management
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);

// Post interactions
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.put('/:id/share', protect, sharePost);

module.exports = router;
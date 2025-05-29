const Post = require('../models/Post');
const User = require('../models/User');

// Create post with enhanced features
const createPost = async (req, res) => {
  try {
    const { content, media, privacy, location, tags, feeling } = req.body;
    const author = req.user._id;

    if (!content && (!media || media.length === 0)) {
      return res.status(400).json({ message: 'Content or media is required' });
    }

    const post = await Post.create({ 
      content, 
      author, 
      media: media || [],
      privacy: privacy || 'public',
      location,
      tags: tags || [],
      feeling
    });

    // Populate author details for response
    await post.populate('author', 'fullName profileImage role');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

// Get all posts (with author populated)
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ privacy: { $ne: 'private' } })
      .populate('author', 'fullName profileImage role')
      .populate('comments.user', 'fullName profileImage')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
};

// Get posts by specific user
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    
    // Build query based on privacy and user relationship
    let query = { author: userId };
    
    // If not the user's own posts, filter out private posts
    if (userId !== currentUserId.toString()) {
      query.privacy = { $ne: 'private' };
    }

    const posts = await Post.find(query)
      .populate('author', 'fullName profileImage role')
      .populate('comments.user', 'fullName profileImage')
      .sort({ createdAt: -1 });
      
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user posts', error: error.message });
  }
};

// Like or unlike a post
const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const likedIndex = post.likes.indexOf(userId);
    if (likedIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likedIndex, 1);
    }
    await post.save();

    res.json({ likesCount: post.likes.length, liked: likedIndex === -1 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle like', error: error.message });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Comment content required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      user: req.user._id,
      content,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the new comment
    await post.populate('comments.user', 'fullName profileImage');
    
    const addedComment = post.comments[post.comments.length - 1];
    res.status(201).json(addedComment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
};

// Share post (simply add user to shares array)
const sharePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!post.shares.includes(userId)) {
      post.shares.push(userId);
      await post.save();
    }

    res.json({ sharesCount: post.shares.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to share post', error: error.message });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
};

// Get trending posts
const getTrendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ privacy: { $ne: 'private' } })
      .populate('author', 'fullName profileImage role')
      .populate('comments.user', 'fullName profileImage')
      .sort({ 
        likes: -1, 
        'comments.length': -1, 
        shares: -1,
        createdAt: -1 
      })
      .limit(10);
      
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trending posts', error: error.message });
  }
};

// Search posts
const searchPosts = async (req, res) => {
  try {
    const { query, tags } = req.query;
    let searchQuery = { privacy: { $ne: 'private' } };

    if (query) {
      searchQuery.content = { $regex: query, $options: 'i' };
    }

    if (tags) {
      const tagArray = tags.split(',');
      searchQuery.tags = { $in: tagArray };
    }

    const posts = await Post.find(searchQuery)
      .populate('author', 'fullName profileImage role')
      .populate('comments.user', 'fullName profileImage')
      .sort({ createdAt: -1 });
      
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search posts', error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getUserPosts,
  toggleLike,
  addComment,
  sharePost,
  deletePost,
  getTrendingPosts,
  searchPosts,
};
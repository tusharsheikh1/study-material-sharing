const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  content: { type: String, required: false }, // Made optional for media-only posts
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  media: [{ 
    type: String,
    validate: {
      validator: function(arr) {
        return arr.length <= 4; // Max 4 media files
      },
      message: 'Maximum 4 media files allowed'
    }
  }],
  // Enhanced fields
  privacy: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  location: { type: String },
  tags: [{ type: String }],
  feeling: { type: String },
  edited: { type: Boolean, default: false },
  editedAt: { type: Date },
  // Post type for different kinds of posts
  postType: {
    type: String,
    enum: ['text', 'image', 'video', 'link', 'poll', 'event'],
    default: 'text'
  },
  // For link posts
  linkPreview: {
    title: String,
    description: String,
    image: String,
    url: String
  },
  // For event posts
  event: {
    title: String,
    date: Date,
    location: String,
    description: String
  },
  // For poll posts
  poll: {
    question: String,
    options: [{
      text: String,
      votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    allowMultiple: { type: Boolean, default: false },
    expiresAt: Date
  },
  // Engagement metrics
  views: { type: Number, default: 0 },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Moderation
  reported: { type: Boolean, default: false },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reportReason: String,
}, {
  timestamps: true,
});

// Indexes for better performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ privacy: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ 'likes.length': -1, createdAt: -1 }); // For trending posts

// Virtual for engagement score
postSchema.virtual('engagementScore').get(function() {
  const likesWeight = 1;
  const commentsWeight = 2;
  const sharesWeight = 3;
  
  return (this.likes.length * likesWeight) + 
         (this.comments.length * commentsWeight) + 
         (this.shares.length * sharesWeight);
});

// Pre-save middleware to update edited fields
postSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.edited = true;
    this.editedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
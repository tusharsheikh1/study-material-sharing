const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  role: { 
    type: String, 
    enum: ['student', 'cr', 'admin', 'faculty'], // Added faculty role
    default: 'student' 
  },
  semester: { type: Number },
  batch: { type: String },
  emailVerified: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  
  // Profile enhancement fields
  profileImage: { type: String },
  coverImage: { type: String },
  bio: { type: String, maxlength: 500 },
  location: { type: String },
  website: { type: String },
  
  // Social features
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Privacy settings
  privacySettings: {
    profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
    postVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
    allowFriendRequests: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false },
    showPhoneNumber: { type: Boolean, default: false }
  },
  
  // Notification preferences
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    friendRequestNotifications: { type: Boolean, default: true },
    postLikeNotifications: { type: Boolean, default: true },
    commentNotifications: { type: Boolean, default: true }
  },
  
  // Activity tracking
  lastSeen: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  
  // Gamification
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  
  // Academic information (for students)
  academicInfo: {
    cgpa: { type: Number },
    department: { type: String, default: 'Marketing' },
    specialization: String,
    graduationYear: Number,
    skills: [String],
    interests: [String]
  },
  
  // Verification and authentication
  otp: String,
  otpExpiration: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Account status
  isActive: { type: Boolean, default: true },
  suspendedUntil: Date,
  suspensionReason: String,
  
  // Social media links
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    github: String
  }
}, {
  timestamps: true,
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ studentId: 1 });
userSchema.index({ fullName: 'text', email: 'text', studentId: 'text' }); // Text search
userSchema.index({ isOnline: 1, lastSeen: -1 });

// Virtual for full profile URL
userSchema.virtual('profileUrl').get(function() {
  return `/profile/${this._id}`;
});

// Virtual for user level calculation
userSchema.virtual('calculatedLevel').get(function() {
  return Math.floor(this.points / 100) + 1;
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Update level based on points before saving
userSchema.pre('save', function(next) {
  if (this.isModified('points')) {
    this.level = Math.floor(this.points / 100) + 1;
  }
  next();
});

// Password matcher
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to add points and update level
userSchema.methods.addPoints = function(points, reason) {
  this.points += points;
  
  // Add badge if milestone reached
  const milestones = [100, 500, 1000, 5000];
  const currentLevel = Math.floor(this.points / 100) + 1;
  
  milestones.forEach(milestone => {
    if (this.points >= milestone) {
      const badgeName = `${milestone} Points Milestone`;
      const existingBadge = this.badges.find(badge => badge.name === badgeName);
      
      if (!existingBadge) {
        this.badges.push({
          name: badgeName,
          description: `Earned ${milestone} points`,
          icon: '🏆'
        });
      }
    }
  });
  
  return this.save();
};

// Method to check if users are friends
userSchema.methods.isFriendWith = function(userId) {
  return this.friends.includes(userId);
};

// Method to update last seen
userSchema.methods.updateLastSeen = function() {
  this.lastSeen = new Date();
  this.isOnline = true;
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('User', userSchema);
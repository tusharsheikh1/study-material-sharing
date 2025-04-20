const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  role: { type: String, default: 'student' },
  semester: { type: Number },
  batch: { type: String },
  emailVerified: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false }, // ✅ For soft reject
  profileImage: { type: String },
  otp: String,
  otpExpiration: Date,
}, {
  timestamps: true,
});

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Password matcher
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

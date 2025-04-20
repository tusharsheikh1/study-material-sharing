const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const { otpTemplate } = require('../utils/emailTemplates.cjs'); // ✅ Updated import for .cjs

// ✅ Utility: Send HTML Email
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html, // ✅ Send HTML content
  });
};

// ✅ Admin creator
const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminStudentId = process.env.ADMIN_STUDENT_ID;

    if (!adminEmail || !adminPassword || !adminStudentId) return;

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) return;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      fullName: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      studentId: adminStudentId,
      role: 'admin',
      emailVerified: true,
      approved: true,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully:', adminUser.email);
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  }
};

createAdminUser();

// ✅ Register User
const registerUser = async (req, res) => {
  const { fullName, email, studentId, password, phoneNumber, role, semester, batch } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    const studentIdExists = await User.findOne({ studentId: studentId.toLowerCase() });

    if (emailExists || studentIdExists) {
      return res.status(400).json({ message: 'User with this email or student ID already exists.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      studentId: studentId.toLowerCase(),
      role: role || 'student',
      semester,
      batch,
      otp,
      otpExpiration,
    });

    try {
      await sendEmail(email, 'Your OTP for Registration', otpTemplate(otp)); // ✅ Use HTML template
    } catch (err) {
      return res.status(500).json({ message: 'Failed to send OTP email.' });
    }

    res.status(201).json({ message: 'OTP sent to email. Please verify to complete registration.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Verify OTP
const verifyOtp = async (req, res) => {
  const { email, studentId, otp } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email }, { studentId: studentId?.toLowerCase() }],
    });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.otp !== otp || user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    if (email && user.email === email) user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Verification successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studentId: user.studentId,
        phoneNumber: user.phoneNumber,
        role: user.role,
        semester: user.semester,
        batch: user.batch,
        approved: user.approved,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login
const loginUser = async (req, res) => {
  const { emailOrId, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: emailOrId },
        { studentId: emailOrId.toLowerCase() },
      ],
    });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    if (!user.approved) {
      return res.status(403).json({ message: 'Your account is not approved yet.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studentId: user.studentId,
        phoneNumber: user.phoneNumber,
        role: user.role,
        semester: user.semester,
        batch: user.batch,
        approved: user.approved,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logoutUser = (req, res) => {
  res.json({ message: 'User logged out successfully' });
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpiration = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(email, 'Your OTP for Verification', otpTemplate(otp)); // ✅ Use template
    res.json({ message: 'OTP sent successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, studentId, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email }, { studentId: studentId?.toLowerCase() }],
    });

    if (!user || user.otp !== otp || user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Password reset successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studentId: user.studentId,
        phoneNumber: user.phoneNumber,
        role: user.role,
        semester: user.semester,
        batch: user.batch,
        approved: user.approved,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Both old and new passwords are required.' });
  }

  try {
    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while changing password.' });
  }
};

// ✅ Export
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  verifyOtp,
  sendOtp,
  resetPassword,
  changePassword,
  sendEmail, // ✅ Export for use in userController
};

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const axios = require('axios');
const bcrypt = require('bcryptjs');

// Utility: Send Email
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
};

// Utility: Send SMS
const sendSms = async (phoneNumber, message) => {
  const apiKey = process.env.SMS_API_KEY;
  const senderId = process.env.SMS_SENDER_ID;
  const apiUrl = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${phoneNumber}&senderid=${senderId}&message=${encodeURIComponent(message)}`;

  try {
    const response = await axios.get(apiUrl);
    if (response.data.status !== '202') {
      console.error('SMS sending failed:', response.data);
      return false;
    }
    console.log('SMS sent successfully:', response.data);
    return true;
  } catch (err) {
    console.error('Error sending SMS:', err.message);
    return false;
  }
};

// Admin creator
const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminPhone = process.env.ADMIN_PHONE;

    if (!adminEmail || !adminPassword || !adminPhone) return;

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) return;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      fullName: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      phoneNumber: adminPhone,
      role: 'admin',
      emailVerified: true,
      phoneVerified: true,
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
  const { fullName, email, password, phoneNumber, role, semester, batch } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    const phoneExists = await User.findOne({ phoneNumber });

    if (emailExists || phoneExists) {
      return res.status(400).json({ message: 'User with this email or phone number already exists.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      role: role || 'student',
      semester,
      batch,
      otp,
      otpExpiration,
    });

    let emailSent = true;
    let smsSent = true;

    if (email) {
      try {
        await sendEmail(email, 'Your OTP for Registration', `Your OTP is ${otp}. It is valid for 10 minutes.`);
      } catch (err) {
        emailSent = false;
        console.error('Error sending email:', err.message);
      }
    }

    if (phoneNumber) {
      const smsMessage = `Your OTP for registration is ${otp}. It is valid for 10 minutes.`;
      smsSent = await sendSms(phoneNumber, smsMessage);
    }

    if (!emailSent && !smsSent) {
      return res.status(500).json({ message: 'Failed to send OTP via email and SMS.' });
    }

    res.status(201).json({ message: 'OTP sent to email and/or phone. Please verify to complete registration.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Verify OTP
const verifyOtp = async (req, res) => {
  const { email, phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.otp !== otp || user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    if (email && user.email === email) user.emailVerified = true;
    if (phoneNumber && user.phoneNumber === phoneNumber) user.phoneVerified = true;

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
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    if (!user.approved) {
      return res.status(403).json({ message: 'Your account is not approved yet. Please wait for admin approval.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
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

// ✅ Reset Password
const resetPassword = async (req, res) => {
  const { email, phoneNumber, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
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
  const { email, phoneNumber } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpiration = Date.now() + 10 * 60 * 1000;
    await user.save();

    if (email) {
      await sendEmail(email, 'Your OTP for Verification', `Your OTP is ${otp}. It is valid for 10 minutes.`);
    }

    if (phoneNumber) {
      const smsMessage = `Your Naabamart verification code is ${otp}. It will expire in 10 minutes. Please do not share this code.`;
      await sendSms(phoneNumber, smsMessage);
    }

    res.json({ message: 'OTP sent successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add this at the end of authController.js
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
    console.error('Password change error:', err.message);
    res.status(500).json({ message: 'Server error while changing password.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  verifyOtp,
  sendOtp,
  resetPassword,
  changePassword,
};

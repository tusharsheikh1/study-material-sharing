const jwt = require('jsonwebtoken');
const User = require('../models/User');

// General auth check
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin only
const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

// Faculty only
const facultyProtect = (req, res, next) => {
  if (req.user && req.user.role === 'faculty') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Faculty only.' });
  }
};

// CR only
const crProtect = (req, res, next) => {
  if (req.user && req.user.role === 'cr') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. CR only.' });
  }
};

// Student only
const studentProtect = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Students only.' });
  }
};

// Flexible role-based middleware
const roleProtect = (allowedRoles = []) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Unauthorized role.' });
    }
  };
};

module.exports = {
  protect,
  adminProtect,
  facultyProtect,
  crProtect,
  studentProtect,
  roleProtect,
};

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// Upload avatar for current user
router.post('/avatar', auth, authController.uploadAvatar);

// @route   GET api/auth/current
// @desc    Get current user
// @access  Private
router.get('/current', auth, authController.getCurrentUser);

// @route   GET api/auth/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/users', auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
}, authController.getAllUsers);

// @route   PUT api/auth/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
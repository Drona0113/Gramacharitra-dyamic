const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route GET api/admin/analytics
// @desc  Get admin analytics counts
// @access Private (admin)
router.get('/analytics', auth, admin, adminController.getAnalytics);

// @route DELETE api/admin/users/:id
// @desc  Delete a user and their history
// @access Private (admin)
router.delete('/users/:id', auth, admin, adminController.deleteUser);

module.exports = router;

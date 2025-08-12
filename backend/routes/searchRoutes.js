const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// @route   GET api/search/district
// @desc    Search villages by district
// @access  Public
router.get('/district', searchController.searchByDistrict);

// @route   GET api/search/name
// @desc    Search villages by name
// @access  Public
router.get('/name', searchController.searchByName);

module.exports = router;
const express = require('express');
const router = express.Router();
const villageController = require('../controllers/villageController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/villages
// @desc    Get all villages
// @access  Public
router.get('/', villageController.getAllVillages);

// @route   GET api/villages/:id
// @desc    Get village by ID
// @access  Public
router.get('/:id', villageController.getVillageById);

// @route   POST api/villages
// @desc    Create a village
// @access  Private (Admin only)
router.post('/', [auth, admin], villageController.createVillage);

// @route   PUT api/villages/:id
// @desc    Update a village
// @access  Private (Admin only)
router.put('/:id', [auth, admin], villageController.updateVillage);

// @route   DELETE api/villages/:id
// @desc    Delete a village
// @access  Private (Admin only)
router.delete('/:id', [auth, admin], villageController.deleteVillage);

module.exports = router;
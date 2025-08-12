const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// @route   GET api/reviews/:villageId
// @desc    Get all reviews for a village
// @access  Public
router.get('/:villageId', reviewController.getVillageReviews);

// @route   POST api/reviews/:villageId
// @desc    Add a review to a village
// @access  Private
router.post('/:villageId', auth, reviewController.addReview);

module.exports = router;
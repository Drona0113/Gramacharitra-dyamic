const Review = require('../models/Review');

// Get all reviews for a village
exports.getVillageReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ village: req.params.villageId })
      .populate('user', ['name'])
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add a review to a village
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const villageId = req.params.villageId;
  
  try {
    const newReview = new Review({
      user: req.user.id,
      village: villageId,
      rating,
      comment
    });
    
    const review = await newReview.save();
    
    // Populate user info
    await review.populate('user', ['name']);
    
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
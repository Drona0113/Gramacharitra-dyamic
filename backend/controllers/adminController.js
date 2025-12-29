const Village = require('../models/Village');
const User = require('../models/User');
const Review = require('../models/Review');

// Return simple analytics counts for admin dashboard
exports.getAnalytics = async (req, res) => {
  try {
    const totalVillages = await Village.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Monthly visitors not tracked — return null (frontend can show placeholder)
    const monthlyVisitors = null;

    res.json({ totalVillages, totalUsers, totalReviews, monthlyVisitors });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user and their related history (reviews)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Admin deleteUser called by ${req.user?.email || 'unknown'} for id: ${userId}`);

    // Remove user reviews
    const deletedReviews = await Review.deleteMany({ user: userId });
    console.log(`Deleted reviews count: ${deletedReviews.deletedCount}`);

    // Remove user document
    const User = require('../models/User');
    const result = await User.findByIdAndDelete(userId);

    if (!result) {
      console.warn(`deleteUser: no user found with id ${userId}`);
      return res.status(404).json({ message: `User not found: ${userId}` });
    }

    console.log(`deleteUser: removed user ${result.email} (${result._id})`);
    res.json({ message: 'User and related history deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Middleware
app.use(cors());
// Allow larger JSON payloads for avatar uploads (data URLs)
app.use(express.json({ limit: '10mb' }));

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/villages', require('./routes/villageRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
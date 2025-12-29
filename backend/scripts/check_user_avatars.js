require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/grama_charithra';

const userEmails = [
  'krishnaprasad123@gmail.com',
  'admin@gramacharitra.com'
];

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const User = require('../models/User');

    for (const email of userEmails) {
      const user = await User.findOne({ email }).lean();
      if (!user) {
        console.log(`User not found: ${email}`);
        continue;
      }
      console.log('---');
      console.log(`Email: ${email}`);
      console.log(`Name : ${user.name}`);
      console.log(`avatarUrl present: ${!!user.avatarUrl}`);
      console.log(`avatarUrl value: ${user.avatarUrl || '<none>'}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();

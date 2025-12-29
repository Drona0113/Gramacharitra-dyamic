require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/grama_charithra';
const emails = [
  'krishnaprasad123@gmail.com',
  'admin@gramacharitra.com'
];

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const User = require('../models/User');

    for (const email of emails) {
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`User not found: ${email}`);
        continue;
      }
      console.log(`Clearing avatar for ${email} (user: ${user.name})`);
      await User.updateOne({ _id: user._id }, { $unset: { avatarUrl: '' } });
      console.log('Done');
    }

    await mongoose.disconnect();
    console.log('Disconnected. All done.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();

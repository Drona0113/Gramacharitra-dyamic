const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  sections: {
    nameOrigin: {
      title: String,
      content: String,
      part1: {
        title: String,
        description: String
      },
      part2: {
        title: String,
        description: String
      },
      part3: {
        title: String,
        description: String
      }
    },
    history: {
      timeline: [{
        era: String,
        description: String
      }]
    },
    geography: {
      features: [{
        title: String,
        description: String,
        image: String
      }]
    },
    temples: [{
      name: String,
      description: String,
      image: String
    }],
    festivals: [{
      name: String,
      description: String,
      image: String
    }],
    economy: {
      agriculture: String,
      livelihoods: String,
      image: String
    },
    profile: {
      population: String,
      languages: String,
      literacy: String,
      occupation: String,
      nearestTown: String,
      transport: String,
      pinCode: String
    },
    facts: [{
      title: String,
      description: String
    }]
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

villageSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Village', villageSchema);
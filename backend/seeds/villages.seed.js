const mongoose = require('mongoose');
const Village = require('../models/Village');
require('dotenv').config();

// Sample villages data
const villages = [
  {
    name: "Annavaram",
    district: "East Godavari",
    description: "The Divine Hill of Satyanarayana Swamy, known for its unique temple architecture and spiritual significance.",
    image: "images/annavaram.jpg",
    sections: {
      nameOrigin: {
        title: "Why Annavaram?",
        content: "The name Annavaram is derived from the words 'Anni' (meaning 'mother') and 'Varam' (meaning 'boon' or 'gift').",
        part1: {
          title: "Anni (అన్ని)",
          description: "From Telugu word meaning 'mother', representing the maternal aspect of the deity."
        },
        part2: {
          title: "Varam (వరం)",
          description: "Meaning 'boon' or 'gift', referring to the blessings bestowed by the goddess."
        }
      },
      history: {
        timeline: [
          {
            era: "11th Century CE",
            description: "The original temple was constructed during this period."
          },
          {
            era: "Vijayanagara Era",
            description: "Temple was expanded and renovated under Vijayanagara patronage."
          }
        ]
      },
      geography: {
        features: [
          {
            title: "Pampa River",
            description: "Flows near the temple, considered sacred by devotees.",
            image: "images/pampa-river.jpg"
          }
        ]
      },
      temples: [
        {
          name: "Satyanarayana Swamy Temple",
          description: "The main temple dedicated to Lord Satyanarayana.",
          image: "images/annavaram-temple.jpg"
        }
      ],
      festivals: [
        {
          name: "Kalyanotsavam",
          description: "Annual celestial wedding celebration of the deity.",
          image: "images/kalyanotsavam.jpg"
        }
      ],
      economy: {
        agriculture: "Rice cultivation, coconut plantations",
        livelihoods: "Tourism, agriculture, small businesses",
        image: "images/annavaram-economy.jpg"
      },
      profile: {
        population: "~10,000",
        languages: "Telugu",
        literacy: "~75%",
        occupation: "Agriculture, tourism, temple services",
        nearestTown: "Rajahmundry (50 km)",
        transport: "APSRTC buses, auto-rickshaws",
        pinCode: "533126"
      },
      facts: [
        {
          title: "Unique Idol",
          description: "The idol of the deity is believed to be self-manifested (Swayambhu)."
        },
        {
          title: "Pilgrimage Center",
          description: "Attracts over a million pilgrims annually from across India."
        }
      ]
    },
    location: {
      type: "Point",
      coordinates: [82.3988, 17.2763] // [longitude, latitude]
    }
  },
  {
    name: "Kottapa Konda",
    district: "Guntur",
    description: "A sacred hill with ancient temples and breathtaking views of the surrounding countryside.",
    image: "images/kotappa.jpeg",
    sections: {
      nameOrigin: {
        title: "Why Kottapa Konda?",
        content: "The name Kottapa Konda is derived from 'Kottapa' (a local deity) and 'Konda' (hill).",
        part1: {
          title: "Kottapa (కొట్టప్ప)",
          description: "Name of a local deity worshipped in the region."
        },
        part2: {
          title: "Konda (కొండ)",
          description: "Telugu word for hill, referring to the hill where the temple is located."
        }
      },
      // Add other sections as needed
    },
    location: {
      type: "Point",
      coordinates: [80.4417, 16.5062]
    }
  }
  // Add more villages as needed
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Seed the database
const seedDatabase = async () => {
  try {
    await Village.insertMany(villages);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
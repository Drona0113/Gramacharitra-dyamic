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
      history: {
        timeline: [
          {
            era: "Ancient Period",
            description: "The site has been a place of worship since ancient times."
          },
          {
            era: "Medieval Era",
            description: "Temples were constructed and renovated by various dynasties."
          }
        ]
      },
      geography: {
        features: [
          {
            title: "Hill Range",
            description: "Part of the Eastern Ghats with scenic beauty.",
            image: "images/kotappa-hill.jpg"
          }
        ]
      },
      temples: [
        {
          name: "Kottapa Swamy Temple",
          description: "Ancient temple dedicated to the local deity Kottapa.",
          image: "images/kotappa-temple.jpg"
        }
      ],
      festivals: [
        {
          name: "Kottapa Jathara",
          description: "Annual festival celebrating the local deity.",
          image: "images/kotappa-festival.jpg"
        }
      ],
      economy: {
        agriculture: "Chili cultivation, cotton farming",
        livelihoods: "Agriculture, temple services, small businesses",
        image: "images/kotappa-economy.jpg"
      },
      profile: {
        population: "~8,000",
        languages: "Telugu",
        literacy: "~70%",
        occupation: "Agriculture, temple services",
        nearestTown: "Guntur (35 km)",
        transport: "APSRTC buses, private vehicles",
        pinCode: "522401"
      },
      facts: [
        {
          title: "Sacred Hill",
          description: "The hill is considered sacred and has been a pilgrimage site for centuries."
        },
        {
          title: "Ancient Temples",
          description: "Contains ancient temples with historical significance."
        }
      ]
    },
    location: {
      type: "Point",
      coordinates: [80.4417, 16.5062]
    }
  },
  {
    name: "Bheemavaram",
    district: "West Godavari",
    description: "A historic town known for its ancient temples, cultural heritage, and agricultural prosperity.",
    image: "images/bheemavaram.jpg",
    sections: {
      nameOrigin: {
        title: "Why Bheemavaram?",
        content: "The name Bheemavaram is derived from 'Bheema' (one of the Pandavas) and 'Varam' (gift/boon).",
        part1: {
          title: "Bheema (భీమ)",
          description: "Named after the mighty Pandava brother Bheema from the Mahabharata."
        },
        part2: {
          title: "Varam (వరం)",
          description: "Meaning 'gift' or 'boon', referring to the blessed nature of the land."
        }
      },
      history: {
        timeline: [
          {
            era: "Ancient Period",
            description: "The area has been inhabited since ancient times, with references in Puranas."
          },
          {
            era: "Chola Dynasty",
            description: "Flourished under the Chola dynasty as an important cultural center."
          },
          {
            era: "British Era",
            description: "Developed as an important agricultural and trading center."
          }
        ]
      },
      geography: {
        features: [
          {
            title: "Godavari Delta",
            description: "Located in the fertile Godavari river delta region.",
            image: "images/godavari-delta.jpg"
          },
          {
            title: "Coastal Plains",
            description: "Rich alluvial soil ideal for agriculture.",
            image: "images/coastal-plains.jpg"
          }
        ]
      },
      temples: [
        {
          name: "Somarama Temple",
          description: "One of the Pancharama Kshetras dedicated to Lord Shiva.",
          image: "images/somarama.jpg"
        },
        {
          name: "Mavullamma Ammavari Temple",
          description: "Ancient temple dedicated to the local goddess Mavullamma.",
          image: "images/mavullamma.jpg"
        }
      ],
      festivals: [
        {
          name: "Mavullamma Fair",
          description: "Grand annual fair celebrating the local goddess.",
          image: "images/mavullamma-fair.jpg"
        },
        {
          name: "Shivaratri",
          description: "Major celebration at Somarama Temple.",
          image: "images/shivaratri.jpg"
        }
      ],
      economy: {
        agriculture: "Paddy cultivation, coconut groves, aquaculture",
        livelihoods: "Agriculture, fishing, small-scale industries, education",
        image: "images/bheemavaram-economy.jpg"
      },
      profile: {
        population: "~150,000",
        languages: "Telugu",
        literacy: "~85%",
        occupation: "Agriculture, education, small businesses, government services",
        nearestTown: "Eluru (45 km)",
        transport: "APSRTC buses, railway station, national highway connectivity",
        pinCode: "534201"
      },
      facts: [
        {
          title: "Pancharama Kshetra",
          description: "Bheemavaram is one of the five sacred Pancharama Kshetras of Andhra Pradesh."
        },
        {
          title: "Educational Hub",
          description: "Known for several educational institutions and colleges."
        },
        {
          title: "Cultural Center",
          description: "Rich cultural heritage with traditional arts and festivals."
        }
      ]
    },
    location: {
      type: "Point",
      coordinates: [81.5449, 16.9436]
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
const Village = require('../models/Village');

// Get all villages
exports.getAllVillages = async (req, res) => {
  try {
    const villages = await Village.find().sort({ name: 1 });
    res.json(villages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get village by ID
exports.getVillageById = async (req, res) => {
  try {
    const village = await Village.findById(req.params.id);
    
    if (!village) {
      return res.status(404).json({ message: 'Village not found' });
    }
    
    res.json(village);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a new village (admin only)
exports.createVillage = async (req, res) => {
  const {
    name,
    district,
    description,
    image,
    sections,
    location
  } = req.body;
  
  try {
    const newVillage = new Village({
      name,
      district,
      description,
      image,
      sections,
      location
    });
    
    const village = await newVillage.save();
    res.json(village);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a village (admin only)
exports.updateVillage = async (req, res) => {
  const {
    name,
    district,
    description,
    image,
    sections,
    location
  } = req.body;
  
  try {
    console.log('updateVillage payload:', req.body);
    let village = await Village.findById(req.params.id);
    
    if (!village) {
      return res.status(404).json({ message: 'Village not found' });
    }
    
    village = await Village.findByIdAndUpdate(
      req.params.id,
      { $set: { name, district, description, image, sections, location } },
      { new: true }
    );
    
    res.json(village);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
  }
};

// Delete a village (admin only)
exports.deleteVillage = async (req, res) => {
  try {
    const village = await Village.findById(req.params.id);
    
    if (!village) {
      return res.status(404).json({ message: 'Village not found' });
    }
    
    await Village.findByIdAndRemove(req.params.id);
    
    res.json({ message: 'Village removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
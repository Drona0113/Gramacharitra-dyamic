const Village = require('../models/Village');

// Search villages by district
exports.searchByDistrict = async (req, res) => {
  try {
    const { district } = req.query;
    
    if (!district) {
      return res.status(400).json({ message: 'District parameter is required' });
    }
    
    const villages = await Village.find({
      district: { $regex: district, $options: 'i' }
    }).sort({ name: 1 });
    
    res.json(villages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Search villages by name
exports.searchByName = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ message: 'Name parameter is required' });
    }
    
    const villages = await Village.find({
      name: { $regex: name, $options: 'i' }
    }).sort({ name: 1 });
    
    res.json(villages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
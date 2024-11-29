// controllers/sliderDataController.js

const SliderData = require('../models/SliderData');

// Fetch all slider data
exports.getAllSliderData = async (req, res) => {
  try {
    const sliderData = await SliderData.find();
    res.json(sliderData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch slider data by ID
exports.getSliderDataById = async (req, res) => {
  try {
    const sliderData = await SliderData.findById(req.params.id);
    if (!sliderData) {
      return res.status(404).json({ message: 'Slider data not found' });
    }
    res.json(sliderData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add more controller functions as needed

// const express = require('express');
// const router = express.Router();
// const SliderData = require('./models/SliderData'); // Assuming you have a model for SliderData

// // Define a route to fetch sliderData
// router.get('/api/sliderData', async (req, res) => {
//   try {
//     const sliderData = await SliderData.find();
//     res.json(sliderData);
//   } catch (error) {
//     console.error('Error fetching sliderData:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;
// routes/sliderDataRoutes.js

const express = require('express');
const router = express.Router();
const sliderDataController = require('../controllers/SliderDataController');

// Route to fetch all slider data
router.get('/sliderData', sliderDataController.getAllSliderData);

// Route to fetch slider data by ID
router.get('/sliderData/:id', sliderDataController.getSliderDataById);

module.exports = router;

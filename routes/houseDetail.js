const express = require('express');
const router = express.Router();
const { addHouseDetail, updateHouseDetail, getAllHouseDetails } = require('../controllers/houseDetailController');
const upload = require('../middleware/upload');

// Accept single image as 'images' field

// Create property
router.post('/', upload.single('image'), addHouseDetail);

// Update property
router.put('/:id', upload.single('image'), updateHouseDetail);

// Get all properties
router.get('/', getAllHouseDetails);

// Get property by ID
router.get('/:id', require('../controllers/houseDetailController').getHouseDetailById);

module.exports = router;

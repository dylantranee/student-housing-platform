const express = require('express');
const router = express.Router();
const { addHouseDetail, updateHouseDetail } = require('../controllers/houseDetailController');
const upload = require('../middleware/upload');

// Accept single image as 'images' field

// Create property
router.post('/', upload.single('image'), addHouseDetail);

// Update property
router.put('/:id', upload.single('image'), updateHouseDetail);

module.exports = router;

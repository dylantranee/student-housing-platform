const HouseDetail = require('../models/HouseDetail');

// For image upload, multer will handle req.files or req.file
exports.addHouseDetail = async (req, res) => {
  try {
    console.log('POST /api/houseDetail body:', req.body);
    if (req.file) console.log('Uploaded file:', req.file);
    if (req.files) console.log('Uploaded files:', req.files);

    // Map các trường từ frontend sang backend
    const title = req.body.title || req.body.name;
    const location = req.body.location || req.body.address;
    const price = req.body.price;
    const bedrooms = req.body.bedrooms;
    const bathrooms = req.body.bathrooms;
    const area = req.body.area;
    const description = req.body.description;
    const lat = req.body.lat;
    const lng = req.body.lng;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename);
    } else if (req.file) {
      images = [req.file.filename];
    } else if (req.body.images) {
      // If images is sent as array of URLs/filenames
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const house = new HouseDetail({
      title,
      location,
      price,
      bedrooms,
      bathrooms,
      area,
      description,
      images,
      lat,
      lng
    });
    await house.save();
    res.status(201).json(house);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update house detail
exports.updateHouseDetail = async (req, res) => {
  try {
    const updateData = { ...req.body };
    // Handle image upload
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename);
    } else if (req.file) {
      images = [req.file.filename];
    }
    if (images.length > 0) {
      updateData.images = images;
    }
    const house = await HouseDetail.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!house) return res.status(404).json({ error: 'Property not found' });
    res.json(house);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all house details
exports.getAllHouseDetails = async (req, res) => {
  try {
    const houses = await HouseDetail.find();
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

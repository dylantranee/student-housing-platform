const HouseDetail = require('../models/houseDetail.model');

exports.addHouseDetail = async (req, res) => {
  try {
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

exports.updateHouseDetail = async (req, res) => {
  try {
    const updateData = { ...req.body };
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

exports.getAllHouseDetails = async (req, res) => {
  try {
    const houses = await HouseDetail.find();
    res.json(houses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHouseDetailById = async (req, res) => {
  try {
    const house = await HouseDetail.findById(req.params.id);
    if (!house) return res.status(404).json({ error: 'Property not found' });
    res.json(house);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

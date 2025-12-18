const mongoose = require('mongoose');

const HouseDetailSchema = new mongoose.Schema({
	title: { type: String, required: true },
	location: { type: String, required: true },
	price: { type: Number, required: true },
	bedrooms: { type: Number, required: true },
	bathrooms: { type: Number, required: true },
	area: { type: Number, required: true },
	description: { type: String },
	images: [{ type: String }],
	lat: { type: Number },
	lng: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('HouseDetail', HouseDetailSchema);

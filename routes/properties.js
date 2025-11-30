const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");

// GET /api/properties - Get all properties with filters
router.get("/", propertyController.getProperties);

// GET /api/properties/search - Search properties
router.get("/search", propertyController.searchProperties);

// GET /api/properties/:id - Get single property
router.get("/:id", propertyController.getPropertyById);


// POST /api/properties - Create new property
router.post("/", propertyController.createProperty);

// PUT /api/properties/:id - Update property
router.put("/:id", propertyController.updateProperty);

// DELETE /api/properties/:id - Delete property
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;

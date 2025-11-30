// Update property by ID
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete property by ID
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json({ message: "Property deleted" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const Property = require("../models/Property");

// Get all properties with filters
exports.getProperties = async (req, res) => {
  const sampleProperties = [
    {
      _id: "1",
      title: "Luxury 2-Bedroom Apartment with Ocean View",
      description: "Beautiful apartment with modern amenities",
      location: "District 1, Ho Chi Minh City",
      price: 15000000,
      area: 85,
      bedrooms: 2,
      bathrooms: 2,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"],
      type: "apartment",
      amenities: ["Air Conditioning", "Parking", "Elevator"],
      contact: {
        name: "John Doe",
        phone: "0901234567",
        email: "contact@example.com",
      },
      featured: true,
      createdAt: new Date(),
    },
    {
      _id: "2",
      title: "3-Story House in Central Area",
      description: "Spacious house perfect for families",
      location: "District 3, Ho Chi Minh City",
      price: 25000000,
      area: 120,
      bedrooms: 3,
      bathrooms: 3,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=300&fit=crop",
      images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"],
      type: "house",
      amenities: ["Garden", "Parking", "Security"],
      contact: {
        name: "Jane Smith",
        phone: "0907654321",
        email: "jane@example.com",
      },
      featured: true,
      createdAt: new Date(),
    },
    // ...add more mock properties if needed
  ];

  res.json({
    data: sampleProperties,
    total: sampleProperties.length,
    page: 1,
    limit: sampleProperties.length,
    totalPages: 1,
  });
};

// Get single property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Search properties
exports.searchProperties = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const properties = await Property.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Property.countDocuments({ $text: { $search: q } });

    res.json({
      data: properties,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Create new property (optional - for admin)
exports.createProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Server error" });
  }
};

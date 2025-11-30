const mongoose = require("mongoose");
const Property = require("./models/Property");
const dotenv = require("dotenv");

dotenv.config();

const sampleProperties = [
  {
    title: "Luxury 2-Bedroom Apartment with Ocean View",
    description: "Beautiful apartment with modern amenities",
    location: "District 1, Ho Chi Minh City",
    price: 15000000,
    area: 85,
    bedrooms: 2,
    bathrooms: 2,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    ],
    type: "apartment",
    amenities: ["Air Conditioning", "Parking", "Elevator"],
    contact: {
      name: "John Doe",
      phone: "0901234567",
      email: "contact@example.com",
    },
    featured: true,
  },
  {
    title: "3-Story House in Central Area",
    description: "Spacious house perfect for families",
    location: "District 3, Ho Chi Minh City",
    price: 25000000,
    area: 120,
    bedrooms: 3,
    bathrooms: 3,
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
    ],
    type: "house",
    amenities: ["Garden", "Parking", "Security"],
    contact: {
      name: "Jane Smith",
      phone: "0907654321",
      email: "jane@example.com",
    },
    featured: true,
  },
  {
    title: "Modern Studio Apartment",
    description: "Cozy studio perfect for singles or young couples",
    location: "District 2, Ho Chi Minh City",
    price: 8000000,
    area: 35,
    bedrooms: 1,
    bathrooms: 1,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
    type: "studio",
    amenities: ["Air Conditioning", "WiFi", "Furnished"],
    contact: {
      name: "Mike Johnson",
      phone: "0909876543",
      email: "mike@example.com",
    },
    featured: false,
  },
  {
    title: "Spacious 4-Bedroom House with Garden",
    description: "Large family home with private garden and parking",
    location: "District 7, Ho Chi Minh City",
    price: 35000000,
    area: 200,
    bedrooms: 4,
    bathrooms: 3,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    ],
    type: "house",
    amenities: ["Garden", "Parking", "Security", "Pool"],
    contact: {
      name: "Sarah Lee",
      phone: "0905551234",
      email: "sarah@example.com",
    },
    featured: false,
  },
  {
    title: "Cozy 1-Bedroom Apartment",
    description: "Affordable apartment in quiet neighborhood",
    location: "District 10, Ho Chi Minh City",
    price: 6000000,
    area: 45,
    bedrooms: 1,
    bathrooms: 1,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    ],
    type: "apartment",
    amenities: ["Air Conditioning", "Elevator"],
    contact: {
      name: "Tom Brown",
      phone: "0908887766",
      email: "tom@example.com",
    },
    featured: false,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/houplatform"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await Property.deleteMany({});
    console.log("Cleared existing properties");

    // Insert sample data
    await Property.insertMany(sampleProperties);
    console.log(`Successfully added ${sampleProperties.length} sample properties`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();

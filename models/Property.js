const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
      enum: ["apartment", "house", "studio"],
      required: true,
    },
    amenities: [
      {
        type: String,
      },
    ],
    contact: {
      name: String,
      phone: String,
      email: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search performance
propertySchema.index({ title: "text", location: "text", description: "text" });
propertySchema.index({ type: 1, price: 1 });
propertySchema.index({ location: 1 });

module.exports = mongoose.model("Property", propertySchema);

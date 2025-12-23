const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes (starts with ' + process.env.JWT_SECRET.substring(0, 5) + '...)' : 'No');

// Auth0 JWT validation
const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE || 'https://houplatform/api',
  issuerBaseURL:
    process.env.AUTH0_ISSUER_BASE_URL ||
    'https://dev-47otizctkfzhzuca.us.auth0.com/',
});

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/houplatform")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./routes/auth");
const houseDetailRoutes = require("./routes/houseDetail");
const roommateProfileRoutes = require("./routes/roommateProfile.routes");
const matchRequestRoutes = require("./routes/matchRequest.routes");
const propertyInquiryRoutes = require("./routes/propertyInquiry.routes");

app.use("/api/auth", authRoutes);
app.use("/api/houseDetail", houseDetailRoutes);
app.use("/api/roommate-profile", roommateProfileRoutes);
app.use("/api/match-requests", matchRequestRoutes);
app.use("/api/property-inquiries", propertyInquiryRoutes);

// Serve uploaded images statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../users/models/user.model");
const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .regex(
      /^[A-Za-zÀ-ỹ\s]+$/,
      "Full name must only contain letters and spaces",
    ),
  age: z
    .number()
    .int()
    .min(18, "Age must be at least 18")
    .max(120, "Age must be at most 120"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

exports.register = async (req, res) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: validation.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }

  const { name, age, phone, email, password } = validation.data;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, age, phone, email, password: hashed });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const accessToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email, roles: user.roles },
      process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-in-production",
      { expiresIn: "1h" },
    );
    res.json({
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.profile = (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(400).json({ error: "Invalid token" });
  User.findById(userId)
    .select("-password")
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json({ data: user });
    })
    .catch((err) => {
      console.error("Error fetching profile:", err);
      res.status(500).json({ error: "Server error" });
    });
};

exports.updateProfile = async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { name, age, phone } = req.body;
  if (!name && !age && !phone) {
    return res.status(400).json({ error: "No fields to update" });
  }
  try {
    const update = {};
    if (name) update.name = name;
    if (age) update.age = age;
    if (phone) update.phone = phone;
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true, runValidators: true },
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ data: user });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.phone) {
      return res.status(409).json({ error: "Phone number already exists" });
    }
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

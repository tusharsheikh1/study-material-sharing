const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import the database connection
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Import admin routes
const studentRoutes = require('./routes/studentRoutes');
const logosRoutes = require("./routes/logos"); // Import logos routes
const cloudinary = require("cloudinary").v2; // Import Cloudinary
const multer = require("multer"); // Import Multer
const { CloudinaryStorage } = require("multer-storage-cloudinary"); // Import Multer-Cloudinary storage
const User = require("./models/User"); // Assuming 'User' is your customer model
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const materialRoutes = require('./routes/materialRoutes');
const facultyRoutes = require('./routes/facultyRoutes'); // ✅ Added faculty route
const staffRoutes = require("./routes/staffRoutes");
const postsRoutes = require('./routes/postsRoutes');



dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORRECT CORS CONFIGURATION
app.use(cors({
  origin: true,        // Dynamically allows requests from any origin
  credentials: true,   // Allows cookies and Authorization headers
}));

app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
connectDB();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

// Multer-Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "media", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif", "pdf"], // Allowed formats
  },
});

const upload = multer({ storage }); // Configure Multer with Cloudinary storage

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/students', studentRoutes);
app.use("/api/logos", logosRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/faculty', facultyRoutes); // ✅ Faculty route added here
app.use('/api/staff', staffRoutes);
app.use('/api/posts', postsRoutes);


// Media upload route
app.post("/api/media/upload", upload.single("file"), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({
      message: "File uploaded successfully",
      url: file.path,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Failed to upload file", error });
  }
});

// New route to fetch total number of customers
app.get("/api/customers/count", async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments();
    res.json({ totalCustomers });
  } catch (err) {
    console.error("Error fetching customer count:", err);
    res.status(500).json({ message: "Error fetching customer count", error: err });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the MERN Server!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An internal server error occurred" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

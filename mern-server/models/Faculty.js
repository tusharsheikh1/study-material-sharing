import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  photoUrl: { type: String, required: true }, // Cloudinary or image URL
  // profileLink is removed since it's not required
  createdAt: { type: Date, default: Date.now }
});

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;

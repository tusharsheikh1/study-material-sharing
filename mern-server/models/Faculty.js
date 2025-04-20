import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  photoUrl: { type: String, required: true }, // Cloudinary or image URL
  createdAt: { type: Date, default: Date.now }
});

const Faculty = mongoose.model('Faculty', facultySchema);

// Export the Faculty model using ES module syntax
export default Faculty;

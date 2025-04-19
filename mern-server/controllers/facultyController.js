import Faculty from "../models/Faculty.js";

// Add new faculty
export const addFaculty = async (req, res) => {
  try {
    const newFaculty = new Faculty(req.body);
    await newFaculty.save();
    res.status(201).json(newFaculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all faculty
export const getAllFaculty = async (req, res) => {
  try {
    const facultyList = await Faculty.find().sort({ createdAt: -1 });
    res.status(200).json(facultyList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a faculty member
export const deleteFaculty = async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update a faculty member
export const updateFaculty = async (req, res) => {
    try {
      const updatedFaculty = await Faculty.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Return the updated document
      );
      res.status(200).json(updatedFaculty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
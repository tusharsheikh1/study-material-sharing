const Batch = require('../models/Batch');

// Get all batches
const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch batches', error: error.message });
  }
};

// Add a new batch
const addBatch = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Batch name is required.' });

  try {
    const exists = await Batch.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Batch already exists.' });

    const newBatch = await Batch.create({ name });
    res.status(201).json({ message: 'Batch added successfully.', batch: newBatch });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add batch', error: error.message });
  }
};

// Update a batch
const updateBatch = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const batch = await Batch.findById(id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    batch.name = name || batch.name;
    await batch.save();

    res.status(200).json({ message: 'Batch updated successfully', batch });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update batch', error: error.message });
  }
};

// Delete a batch
const deleteBatch = async (req, res) => {
  const { id } = req.params;

  try {
    const batch = await Batch.findByIdAndDelete(id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete batch', error: error.message });
  }
};

module.exports = {
  getBatches,
  addBatch,
  updateBatch,
  deleteBatch,
};

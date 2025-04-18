const express = require("express");
const router = express.Router();
const Logo = require("../models/Logos");

// Get a logo or favicon by key
router.get("/:key", async (req, res) => {
  try {
    const logo = await Logo.findOne({ key: req.params.key });
    if (!logo) return res.status(404).json({ message: `${req.params.key} not found` });
    res.json(logo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Save or update a logo or favicon
router.post("/", async (req, res) => {
  const { key, value } = req.body;
  if (!key || !value) {
    return res.status(400).json({ message: "Key and value are required" });
  }

  try {
    let logo = await Logo.findOne({ key });
    if (logo) {
      logo.value = value; // Update the value
      await logo.save();
    } else {
      logo = new Logo({ key, value }); // Create a new entry
      await logo.save();
    }
    res.json(logo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all logos and favicons
router.get("/", async (req, res) => {
  try {
    const logos = await Logo.find();
    res.json(logos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a logo or favicon by key
router.delete("/:key", async (req, res) => {
  try {
    const logo = await Logo.findOneAndDelete({ key: req.params.key });
    if (!logo) return res.status(404).json({ message: `${req.params.key} not found` });
    res.json({ message: `${req.params.key} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
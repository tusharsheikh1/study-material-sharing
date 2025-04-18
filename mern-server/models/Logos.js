const mongoose = require("mongoose");

const LogoSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // Key for logo or favicon
  value: { type: String, required: true }, // URL for the logo or favicon
  favicon: { type: String, required: false }, // Optional field for favicon
});

module.exports = mongoose.model("Logos", LogoSchema);
// /routes/staffRoutes.js
const express = require("express");
const {
  addStaff,
  getAllStaff,
  deleteStaff,
  updateStaff
} = require("../controllers/staffController");

const router = express.Router();

router.post("/", addStaff);
router.get("/", getAllStaff);
router.delete("/:id", deleteStaff);
router.put("/:id", updateStaff);

module.exports = router;

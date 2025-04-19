const express = require("express");
const {
  addFaculty,
  getAllFaculty,
  deleteFaculty,
  updateFaculty
} = require("../controllers/facultyController");

const router = express.Router();

router.post("/", addFaculty);
router.get("/", getAllFaculty);
router.delete("/:id", deleteFaculty);
router.put("/:id", updateFaculty); // ✅ Update route added


module.exports = router;

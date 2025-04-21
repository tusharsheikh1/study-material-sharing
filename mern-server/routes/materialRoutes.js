const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const {
  uploadMaterial,
  getMaterials,
  deleteMaterial,
  markMaterialStatus,
  getMaterialStats,
  getTopContributors,
  downloadMaterial, // ✅ Ensure it's imported
} = require('../controllers/materialController');

const {
  protect,
} = require('../middleware/authMiddleware');

const router = express.Router();

// 🔧 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔧 Cloudinary storage with original filename
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const { batch, semester, materialType } = req.body;

    const folderPath = `materials/${batch}/${semester}/${materialType}`;

    return {
      folder: folderPath,
      allowed_formats: undefined,       // ✅ allow all file types
      use_filename: true,               // ✅ use original filename
      unique_filename: true,            // ✅ don't randomize filename
      resource_type: 'raw',             // ✅ support all file types
    };
  },
});

// 🔧 Multer setup
const upload = multer({
  storage,
  limits: { fileSize: Infinity },
  fileFilter: (req, file, cb) => {
    cb(null, true); // ✅ allow everything
  },
});

/** ROUTES **/

// ✅ Get all materials
router.get('/', protect, getMaterials);

// ✅ Upload a new material
router.post('/', protect, upload.single('file'), uploadMaterial);

// ✅ Delete a material
router.delete('/:id', protect, deleteMaterial);

// ✅ Toggle material completion status
router.put('/toggle-status/:id', protect, markMaterialStatus);

// ✅ Get material stats for dashboard
router.get('/stats', getMaterialStats);

// ✅ Get top contributors
router.get('/top-contributors', getTopContributors);

// ✅ Download material with forced filename
router.get('/download/:id', protect, downloadMaterial); // ✅ Enabled

module.exports = router;

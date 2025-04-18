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
  getTopContributors, // ✅ newly added
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

// 🔧 Cloudinary storage with dynamic folder structure
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const { batch, semester, materialType } = req.body;

    const folderPath = `materials/${batch}/${semester}/${materialType}`;

    return {
      folder: folderPath,
      allowed_formats: undefined, // ✅ allow all file types
      use_filename: false,
      unique_filename: true,
      resource_type: 'raw', // ✅ support any file type (including large files)
    };
  },
});

// 🔧 Multer setup with no size limit
const upload = multer({
  storage,
  limits: { fileSize: Infinity },
  fileFilter: (req, file, cb) => {
    cb(null, true); // ✅ allow all file types
  },
});

/** ROUTES **/

// ✅ Everyone can view
router.get('/', protect, getMaterials);

// ✅ Everyone can upload (any logged-in user)
router.post('/', protect, upload.single('file'), uploadMaterial);

// ✅ Everyone can delete their own; admin can delete all
router.delete('/:id', protect, deleteMaterial);

// ✅ Toggle material completion status
router.put('/toggle-status/:id', protect, markMaterialStatus);

// ✅ Stats for homepage
router.get('/stats', getMaterialStats); // public

// ✅ Top Contributors (NEW & public)
router.get('/top-contributors', getTopContributors);

module.exports = router;

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
  downloadMaterial,
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
      allowed_formats: undefined,
      use_filename: true,
      unique_filename: true,
      resource_type: 'raw',
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: Infinity },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

/** ROUTES **/

// ✅ Protected routes
router.get('/', protect, getMaterials);
router.post('/', protect, upload.single('file'), uploadMaterial);
router.delete('/:id', protect, deleteMaterial);
router.put('/toggle-status/:id', protect, markMaterialStatus);

// ✅ Public routes
router.get('/stats', getMaterialStats);
router.get('/top-contributors', getTopContributors);
router.get('/download/:id', downloadMaterial); // ✅ PUBLIC — no token needed

module.exports = router;

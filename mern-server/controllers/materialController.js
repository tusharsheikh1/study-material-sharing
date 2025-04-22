const Material = require('../models/Material');
const Course = require('../models/Course');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const path = require('path');
const https = require('https');
const { pipeline } = require('stream');

// Upload material
const uploadMaterial = async (req, res) => {
  const { courseId, semester, batch, materialType } = req.body;

  if (!req.file || !courseId || !semester || !batch || !materialType) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    const newMaterial = await Material.create({
      uploadedBy: req.user._id,
      courseId,
      semester: Number(semester),
      batch: Number(batch),
      materialType,
      fileUrl: req.file.secure_url || req.file.path,
      filePublicId: req.file.public_id || req.file.filename,
      title: req.file.originalname,
      description: '',
      fileExtension,
    });

    res.status(201).json({ message: 'Material uploaded successfully.', material: newMaterial });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// Get materials
const getMaterials = async (req, res) => {
  const {
    semester,
    courseId,
    batch,
    materialType,
    uploadedBy,
    sort,
    search,
    sortBy,
    page = 1,
    limit = 100,
  } = req.query;

  const query = {};
  if (semester) query.semester = Number(semester);
  if (batch) query.batch = Number(batch);
  if (courseId && courseId !== 'All') query.courseId = courseId;
  if (materialType) query.materialType = materialType;
  if (uploadedBy && uploadedBy !== 'undefined') query.uploadedBy = uploadedBy;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  let sortField = 'createdAt';
  if (sortBy === 'courseName') sortField = 'courseId.courseName';
  if (sortBy === 'uploader') sortField = 'uploadedBy.fullName';
  const sortOrder = sort === 'asc' ? 1 : -1;

  try {
    const materials = await Material.find(query)
      .populate({
        path: 'uploadedBy',
        select: 'fullName email role profileImage',
      })
      .populate({
        path: 'courseId',
        match: search ? { courseName: { $regex: search, $options: 'i' } } : {},
        select: 'courseCode courseName',
      })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    const filtered = search ? materials.filter((mat) => mat.courseId) : materials;

    res.status(200).json(filtered);
  } catch (error) {
    console.error('Fetch failed:', error);
    res.status(500).json({ message: 'Failed to fetch materials', error: error.message });
  }
};

// Delete material
const deleteMaterial = async (req, res) => {
  const { id } = req.params;

  try {
    const material = await Material.findById(id).populate('uploadedBy');
    if (!material) return res.status(404).json({ message: 'Material not found' });

    const uploaderId = material.uploadedBy?._id?.toString?.() || material.uploadedBy?.toString?.();
    const currentUserId = req.user._id.toString();
    const isUploader = uploaderId === currentUserId;
    const isAdmin = req.user.role === 'admin';

    if (!isUploader && !isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to delete this material.' });
    }

    if (material.filePublicId) {
      await cloudinary.uploader.destroy(`materials/${material.filePublicId}`, {
        resource_type: 'raw',
      });
    }

    await material.deleteOne();
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(500).json({ message: 'Failed to delete material', error: error.message });
  }
};

// Toggle material completion
const markMaterialStatus = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const material = await Material.findById(id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    const isCompleted = material.completedBy.includes(userId);

    if (isCompleted) {
      material.completedBy.pull(userId);
      material.completionLogs = material.completionLogs.filter(
        log => log.user.toString() !== userId.toString()
      );
    } else {
      material.completedBy.push(userId);
      material.completionLogs.push({ user: userId, date: new Date() });
    }

    await material.save();
    res.status(200).json({ message: 'Material status updated', completed: !isCompleted });
  } catch (error) {
    console.error('Toggle failed:', error);
    res.status(500).json({ message: 'Failed to update completion status', error: error.message });
  }
};

// Material stats
const getMaterialStats = async (req, res) => {
  try {
    const totalMaterials = await Material.countDocuments();
    const uniqueBatches = await Material.distinct("batch");
    const activeStudents = await User.countDocuments({ role: "student" });

    res.json({
      totalMaterials,
      activeStudents,
      uniqueBatches: uniqueBatches.length,
      satisfaction: "4.9",
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Top Contributors
const getTopContributors = async (req, res) => {
  const { range } = req.query;

  let dateFilter = {};
  if (range === "week") {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    dateFilter = { createdAt: { $gte: oneWeekAgo } };
  } else if (range === "month") {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    dateFilter = { createdAt: { $gte: oneMonthAgo } };
  }

  try {
    const topContributors = await Material.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$uploadedBy",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          fullName: "$userInfo.fullName",
          email: "$userInfo.email",
          role: "$userInfo.role",
          batch: "$userInfo.batch",
          profileImage: "$userInfo.profileImage",
          count: 1,
        },
      },
    ]);

    res.status(200).json({ contributors: topContributors });
  } catch (error) {
    console.error("Failed to get top contributors:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/// ✅ Final: Secure & consistent download using signed URL for raw files
const downloadMaterial = async (req, res) => {
  const { id } = req.params;

  try {
    const material = await Material.findById(id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    const originalName = material.title || 'file';
    const fileExtension = path.extname(originalName);
    const filenameWithExtension = originalName.endsWith(fileExtension)
      ? originalName
      : `${originalName}${fileExtension}`;

    // ✅ Generate a signed Cloudinary URL for raw resource
    const signedUrl = cloudinary.url(`materials/${material.filePublicId}`, {
      resource_type: 'raw',
      secure: true,
      type: 'upload',
      sign_url: true,
      attachment: filenameWithExtension,
    });

    // ✅ Redirect to the signed URL
    res.redirect(signedUrl);
  } catch (error) {
    console.error('❌ Signed URL download failed:', error);
    res.status(500).json({ message: 'Failed to download material', error: error.message });
  }
};


module.exports = {
  uploadMaterial,
  getMaterials,
  deleteMaterial,
  markMaterialStatus,
  getMaterialStats,
  getTopContributors,
  downloadMaterial,
};

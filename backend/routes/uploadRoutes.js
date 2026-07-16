const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { protect, admin } = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage - store to temp first
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Compress and optimize image
const optimizeImage = async (filePath, options = {}) => {
  const ext = path.extname(filePath).toLowerCase();

  // Skip GIFs (animated)
  if (ext === '.gif') return;

  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 80
  } = options;

  const tempPath = filePath + '.tmp';

  try {
    await sharp(filePath)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality })
      .toFile(tempPath);

    // Replace original with optimized version
    const originalName = path.basename(filePath, ext);
    const webpPath = path.join(path.dirname(filePath), originalName + '.webp');

    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, webpPath);

    return path.basename(webpPath);
  } catch (err) {
    // If optimization fails, keep original
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    console.error('Image optimization failed:', err.message);
    return path.basename(filePath);
  }
};

// Upload single image
router.post('/single', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const optimizedFilename = await optimizeImage(req.file.path);
    const fileUrl = `/uploads/${optimizedFilename || req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload banner image (higher resolution for full-width banners)
router.post('/banner', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const optimizedFilename = await optimizeImage(req.file.path, {
      maxWidth: 1920,
      maxHeight: 800,
      quality: 90
    });
    const fileUrl = `/uploads/${optimizedFilename || req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload mobile banner image (optimized for portrait/mobile view)
router.post('/banner-mobile', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const optimizedFilename = await optimizeImage(req.file.path, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 85
    });
    const fileUrl = `/uploads/${optimizedFilename || req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload multiple images
router.post('/multiple', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileUrls = [];
    for (const file of req.files) {
      const optimizedFilename = await optimizeImage(file.path);
      fileUrls.push(`/uploads/${optimizedFilename || file.filename}`);
    }

    res.json({ urls: fileUrls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

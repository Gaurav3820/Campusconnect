// backend/routes/materialRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const materialCtrl = require('../controllers/materialController');
const { verifyToken } = require('../middleware/authMiddleware');

// storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_'))
});
const upload = multer({ storage });

// public endpoints
router.get('/all', materialCtrl.getMaterials);
router.post('/upload', verifyToken, upload.single('file'), materialCtrl.uploadMaterial);

module.exports = router;

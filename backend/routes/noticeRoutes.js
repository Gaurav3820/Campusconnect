const express = require('express');
const router = express.Router();
const noticeCtrl = require('../controllers/noticeController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.get('/all', noticeCtrl.getNotices);

// Only admin can create notices
router.post('/create', verifyToken, requireAdmin, noticeCtrl.createNotice);

module.exports = router;

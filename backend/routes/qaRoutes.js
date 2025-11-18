// backend/routes/qaRoutes.js
const express = require('express');
const router = express.Router();
const qaCtrl = require('../controllers/qaController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/questions', qaCtrl.getQuestionsWithAnswers);
router.post('/ask', verifyToken, qaCtrl.askQuestion);
router.post('/answer', verifyToken, qaCtrl.answerQuestion);

module.exports = router;

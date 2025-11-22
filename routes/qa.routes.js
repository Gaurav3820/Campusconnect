const router = require("express").Router();
const qa = require("../controllers/qa.controller");

router.post("/ask", qa.ask);
router.post("/reply", qa.reply);
router.get("/questions", qa.getQuestions);
router.get("/replies/:id", qa.getReplies);

module.exports = router;

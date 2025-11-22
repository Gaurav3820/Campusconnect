const router = require("express").Router();
const auth = require("../controllers/auth.controller");

router.post("/student/signup", auth.studentSignup);
router.post("/teacher/signup", auth.teacherSignup);
router.post("/login", auth.login);

module.exports = router;

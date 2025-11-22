const router = require("express").Router();
const notes = require("../controllers/notes.controller");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), notes.upload);
router.get("/all", notes.getAll);

module.exports = router;

const db = require("../models/db");

exports.upload = (req, res) => {
    const { title, subject, description, author, role } = req.body;

    const file_path = req.file ? req.file.filename : null;

    db.query(
        "INSERT INTO notes(title, subject, description, file_path, author, role) VALUES (?,?,?,?,?,?)",
        [title, subject, description, file_path, author, role],
        err => {
            if (err) throw err;
            res.json({ success: true, message: "Note uploaded!" });
        }
    );
};

exports.getAll = (req, res) => {
    db.query("SELECT * FROM notes ORDER BY uploaded_at DESC", (err, data) => {
        if (err) throw err;
        res.json(data);
    });
};

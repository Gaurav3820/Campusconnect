const db = require("../models/db");

exports.ask = (req, res) => {
    db.query(
        "INSERT INTO qa(question, author, role) VALUES(?,?,?)",
        [req.body.question, req.body.author, req.body.role],
        err => {
            if (err) throw err;
            res.json({ success: true });
        }
    );
};

exports.getQuestions = (req, res) => {
    db.query("SELECT * FROM qa ORDER BY created_at DESC", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};

exports.reply = (req, res) => {
    db.query(
        "INSERT INTO replies(qa_id, reply, author, role) VALUES(?,?,?,?)",
        [req.body.qa_id, req.body.reply, req.body.author, req.body.role],
        err => {
            if (err) throw err;
            res.json({ success: true });
        }
    );
};

exports.getReplies = (req, res) => {
    db.query("SELECT * FROM replies WHERE qa_id=?", [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};

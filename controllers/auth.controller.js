const db = require("../models/db");
const bcrypt = require("bcryptjs");

exports.studentSignup = (req, res) => {
    const { name, email, password } = req.body;
    const hashed = bcrypt.hashSync(password, 10);

    db.query(
        "INSERT INTO students(name, email, password) VALUES(?,?,?)",
        [name, email, hashed],
        err => {
            if (err) return res.json({ success: false, message: "Email already exists" });
            res.json({ success: true, message: "Student registered" });
        }
    );
};

exports.teacherSignup = (req, res) => {
    const { name, email, password } = req.body;
    const hashed = bcrypt.hashSync(password, 10);

    db.query(
        "INSERT INTO teachers(name, email, password) VALUES(?,?,?)",
        [name, email, hashed],
        err => {
            if (err) return res.json({ success: false, message: "Email exists" });
            res.json({ success: true, message: "Teacher registered" });
        }
    );
};

exports.login = (req, res) => {
    const { email, password, role } = req.body;

    const table = role === "student" ? "students" : "teachers";

    db.query(`SELECT * FROM ${table} WHERE email=?`, [email], async (err, result) => {
        if (!result.length) return res.json({ success: false, message: "User not found" });

        const user = result[0];
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) return res.json({ success: false, message: "Wrong password" });

        res.json({ success: true, name: user.name, role });
    });
};

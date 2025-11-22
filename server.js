const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

// ----------------------------------------
// MYSQL CONNECTION
// ----------------------------------------
const db = mysql.createConnection({
    host: "localhost",
    user: "root",   // default XAMPP username
    password: "",   // empty unless changed
    database: "campusconnect"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// ----------------------------------------
// STUDENT SIGNUP
// ----------------------------------------
app.post("/student/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO students (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashed], err => {
        if (err) return res.json({ success: false, message: "Email already registered!" });

        return res.json({ success: true, message: "Student account created!" });
    });
});

// ----------------------------------------
// TEACHER SIGNUP
// ----------------------------------------
app.post("/teacher/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO teachers (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashed], err => {
        if (err) return res.json({ success: false, message: "Email already registered!" });

        return res.json({ success: true, message: "Teacher account created!" });
    });
});

// ----------------------------------------
// STUDENT LOGIN
// ----------------------------------------
app.post("/student/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM students WHERE email=?";

    db.query(sql, [email], async (err, results) => {
        if (results.length === 0) {
            return res.json({ success: false, message: "Student not found!" });
        }

        const student = results[0];
        const isValid = await bcrypt.compare(password, student.password);

        if (!isValid) {
            return res.json({ success: false, message: "Wrong password!" });
        }

        res.json({ success: true, message: "Login Success", name: student.name });
    });
});

// ----------------------------------------
// TEACHER LOGIN
// ----------------------------------------
app.post("/teacher/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM teachers WHERE email=?";

    db.query(sql, [email], async (err, results) => {
        if (results.length === 0) {
            return res.json({ success: false, message: "Teacher not found!" });
        }

        const teacher = results[0];
        const isValid = await bcrypt.compare(password, teacher.password);

        if (!isValid) {
            return res.json({ success: false, message: "Wrong password!" });
        }

        res.json({ success: true, message: "Login Success", name: teacher.name });
    });
});

// ----------------------------------------
app.listen(5000, () => console.log("Server running on port 5000"));


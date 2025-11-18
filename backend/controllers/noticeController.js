// backend/controllers/noticeController.js
const pool = require('../config/db');

exports.createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ msg: 'Title and description required' });

    await pool.execute('INSERT INTO notices (title, description) VALUES (?, ?)', [title, description]);
    res.json({ msg: 'Notice posted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creating notice' });
  }
};

exports.getNotices = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM notices ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching notices' });
  }
};

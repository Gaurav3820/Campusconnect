// backend/controllers/materialController.js
const pool = require('../config/db');

exports.uploadMaterial = async (req, res) => {
  try {
    const { title, uploaded_by } = req.body;
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    const filename = req.file.filename;

    await pool.execute(
      'INSERT INTO materials (title, filename, uploaded_by) VALUES (?, ?, ?)',
      [title || 'Untitled', uploaded_by || null]
    );

    res.json({ msg: 'Material Uploaded Successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error uploading material' });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM materials ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching materials' });
  }
};

// backend/scripts/createAdmin.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const name = 'Admin';
    const email = 'admin@college.edu';
    const password = 'Admin@123'; // CHANGE this to a stronger password
    const role = 'admin';

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role]
    );

    console.log('Admin user created with id:', result.insertId);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();

// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/qa', require('./routes/qaRoutes'));

// basic root
app.get('/', (req, res) => res.send('CampusConnect Backend is running'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

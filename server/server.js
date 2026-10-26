const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config(); // also allow root .env fallback

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/trainings', require('./routes/trainings'));

app.get('/api/health', (_req, res) => res.json({ ok: true, status: 'healthy', timestamp: new Date() }));

// Serve frontend build in production if available, otherwise show API status
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  const clientDist = path.join(__dirname, '../client/dist');
  const indexHtml = path.join(clientDist, 'index.html');
  if (fs.existsSync(indexHtml)) {
    app.use(express.static(clientDist));
    app.get('*', (req, res) => {
      res.sendFile(indexHtml);
    });
  } else {
    app.get('/', (req, res) => {
      res.json({ message: 'StaffSync API is running', health: '/api/health' });
    });
  }
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'StaffSync API is running in development mode', health: '/api/health' });
  });
}

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)));

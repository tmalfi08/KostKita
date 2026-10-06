const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const kamarRoutes = require('./routes/kamarRoutes');
const penghuniRoutes = require('./routes/penghuniRoutes');
const pembayaranRoutes = require('./routes/pembayaranRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kamar', kamarRoutes);
app.use('/api/penghuni', penghuniRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'KostKita REST API is running!',
    status: 'Active',
    endpoints: [
      '/api/auth/login',
      '/api/kamar',
      '/api/penghuni',
      '/api/pembayaran',
      '/api/dashboard',
    ],
  });
});

module.exports = app;

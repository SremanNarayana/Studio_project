const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const clientBookingRoutes = require('./routes/clientBookingRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ---------- Core middleware ----------
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    // Non-browser clients have no Origin. When CORS_ORIGINS is unset, retain
    // the existing development behaviour; production should set it explicitly.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ---------- Health check ----------
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Photography Studio Admin API is running' });
});

// ---------- Admin API routes ----------
// Everything here is namespaced under /api so that /api/client/* can be
// added later for the client portal without touching these routes.
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/client/bookings', clientBookingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);

// ---------- 404 + error handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;

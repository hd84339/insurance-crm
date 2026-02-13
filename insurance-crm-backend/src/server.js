require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

// Import routes
const clientRoutes = require('./routes/clientRoutes');
const policyRoutes = require('./routes/policyRoutes');
const claimRoutes = require('./routes/claimRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const targetRoutes = require('./routes/targetRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression()); // Compress responses
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/targets', targetRoutes);
app.use('/api/reports', reportRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Insurance & Mutual Fund CRM API',
    version: '1.0.0',
    endpoints: {
      clients: '/api/clients',
      policies: '/api/policies',
      claims: '/api/claims',
      reminders: '/api/reminders',
      targets: '/api/targets',
      reports: '/api/reports',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
    ═══════════════════════════════════════════════
    🚀 Insurance CRM Server Running
    ═══════════════════════════════════════════════
    Environment: ${process.env.NODE_ENV || 'development'}
    Port: ${PORT}
    URL: http://localhost:${PORT}
    API Docs: http://localhost:${PORT}/api
    Health Check: http://localhost:${PORT}/health
    ═══════════════════════════════════════════════
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

module.exports = app;

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const feeRoutes = require('./routes/fee.routes');
const calendarRoutes = require('./routes/calendar.routes');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://effective-cod-9jx56r7jjvjcprx-6000.app.github.dev'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/calendar', calendarRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app; 
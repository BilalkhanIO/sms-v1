const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const connectDB = require('./utils/db');
const errorHandler = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Trust proxy settings - simplified and corrected version
app.set('trust proxy', [
  '127.0.0.1',
  '10.0.0.0/8',      // Private network
  '172.16.0.0/12',   // Private network
  '192.168.0.0/16',  // Private network
  'fe80::/10',       // Link-local IPv6 addresses
  '::1'              // IPv6 localhost
]);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all routes
app.use(limiter);

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 6000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log('Error:', err.message);
  console.log('Stack:', err.stack);
  
  server.close(() => {
    console.log('Server closed');
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log('Error:', err.message);
  console.log('Stack:', err.stack);
  
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Performing graceful shutdown...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});
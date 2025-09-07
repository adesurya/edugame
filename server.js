    require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import configurations and routes
const connectDB = require('./backend/config/database');
const authRoutes = require('./backend/routes/auth');
const gameRoutes = require('./backend/routes/games');
const progressRoutes = require('./backend/routes/progress');
const dashboardRoutes = require('./backend/routes/dashboard');

// Import middleware
const authMiddleware = require('./backend/middleware/auth');
const rateLimiter = require('./backend/middleware/rateLimiter');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-eval'"], // For game development
      imgSrc: ["'self'", "data:", "https:"],
      soundSrc: ["'self'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:8080",
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', rateLimiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend/public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/progress', authMiddleware, progressRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join room based on user ID for personalized updates
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined room`);
  });
  
  // Handle game progress updates
  socket.on('game-progress', (data) => {
    const { userId, gameId, score, progress } = data;
    
    // Broadcast to parent/teacher dashboard
    socket.to(`user-${userId}`).emit('progress-update', {
      gameId,
      score,
      progress,
      timestamp: new Date()
    });
  });
  
  // Handle game completion
  socket.on('game-completed', (data) => {
    const { userId, gameId, finalScore, achievements } = data;
    
    // Emit celebration event for UI
    io.to(`user-${userId}`).emit('game-celebration', {
      gameId,
      finalScore,
      achievements
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 KidLearn Games Server running on port ${PORT}`);
  console.log(`🎮 Game platform ready at http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

module.exports = { app, io };
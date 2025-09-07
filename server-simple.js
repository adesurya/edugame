/**
 * Simplified Server for Development
 * This version runs without database dependencies for quick testing
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

console.log('🚀 Starting KidLearn Games Server (Development Mode)...');

// Basic middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'frontend/public')));

// Simple in-memory storage for development
let users = [];
let progress = [];
let sessions = [];

// Mock API Routes
app.get('/api/games', (req, res) => {
  const games = [
    {
      id: 'color-matching',
      title: 'Color Matching Fun!',
      description: 'Match colors and learn their names!',
      category: 'colors',
      ageGroup: '3-4',
      difficulty: 1,
      estimatedTime: 5,
      icon: '🎨',
      available: true
    },
    {
      id: 'number-learning',
      title: 'Number Fun Adventure!',
      description: 'Learn to count and recognize numbers!',
      category: 'numbers',
      ageGroup: '3-5',
      difficulty: 1,
      estimatedTime: 7,
      icon: '🔢',
      available: true
    },
    {
      id: 'letter-learning',
      title: 'Alphabet Adventure!',
      description: 'Discover letters and learn the alphabet!',
      category: 'letters',
      ageGroup: '4-6',
      difficulty: 2,
      estimatedTime: 10,
      icon: '🔤',
      available: true
    }
  ];
  
  res.json({ games });
});

app.post('/api/progress', (req, res) => {
  const progressData = {
    id: Date.now(),
    timestamp: new Date(),
    ...req.body
  };
  
  progress.push(progressData);
  
  console.log('📊 Progress saved:', {
    gameId: progressData.gameId,
    score: progressData.score,
    timestamp: progressData.timestamp
  });
  
  res.json({ 
    message: 'Progress saved successfully',
    id: progressData.id
  });
});

app.get('/api/progress', (req, res) => {
  const summary = {
    totalSessions: progress.length,
    totalScore: progress.reduce((sum, p) => sum + (p.score || 0), 0),
    averageScore: progress.length > 0 ? 
      Math.round(progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length) : 0,
    recentProgress: progress.slice(-10)
  };
  
  res.json({ 
    progress: progress.slice(-20), // Last 20 sessions
    summary 
  });
});

app.get('/api/dashboard/overview', (req, res) => {
  const overview = {
    totalSessions: progress.length,
    totalScore: progress.reduce((sum, p) => sum + (p.score || 0), 0),
    averageScore: progress.length > 0 ? 
      Math.round(progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length) : 0,
    gamesPlayed: [...new Set(progress.map(p => p.gameId))].length,
    achievements: progress.reduce((sum, p) => sum + (p.achievements?.length || 0), 0)
  };
  
  res.json({ overview });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('👋 User connected:', socket.id);
  
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined room`);
  });
  
  socket.on('game-progress', (data) => {
    console.log('🎮 Game progress update:', data);
    socket.to(`user-${data.userId}`).emit('progress-update', {
      ...data,
      timestamp: new Date()
    });
  });
  
  socket.on('game-completed', (data) => {
    console.log('🏆 Game completed:', data);
    io.to(`user-${data.userId}`).emit('game-celebration', {
      ...data,
      timestamp: new Date()
    });
  });
  
  socket.on('game-started', (data) => {
    console.log('🎯 Game started:', data);
    sessions.push({
      sessionId: Date.now(),
      userId: data.userId || 'anonymous',
      gameId: data.gameId,
      startTime: new Date()
    });
  });
  
  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
});

// Error handler
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error.message);
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

server.listen(PORT, () => {
  console.log(`🎮 KidLearn Games Server running on port ${PORT}`);
  console.log(`🌐 Open your browser to: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚧 Running in simplified mode (no database required)');
  
  // Show available games
  console.log('\n🎯 Available Games:');
  console.log('  • Color Matching Fun! (🎨)');
  console.log('  • Number Fun Adventure! (🔢)');
  console.log('  • Alphabet Adventure! (🔤)');
  
  console.log('\n✨ Ready to play! ✨\n');
});

module.exports = { app, io };
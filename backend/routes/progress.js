// backend/routes/progress.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const { validateGameProgress } = require('../middleware/validation');

const router = express.Router();

// Mock progress storage - in production this would use database
let progressStorage = {};

// @route   POST /api/progress
// @desc    Save game progress
// @access  Private
router.post('/', authMiddleware, validateGameProgress, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      gameId, 
      score, 
      level, 
      progress, 
      achievements, 
      playTime,
      completed = true,
      answers = [],
      round = 1,
      totalRounds = 10,
      correctAnswers = 0,
      wrongAnswers = 0
    } = req.body;

    // Create progress entry
    const progressEntry = {
      userId,
      gameId,
      sessionId: `${userId}-${gameId}-${Date.now()}`,
      score: score || 0,
      level: level || 1,
      playTime: playTime || 0,
      completed,
      achievements: achievements || [],
      progress: progress || {},
      answers: answers || [],
      round,
      totalRounds,
      correctAnswers,
      wrongAnswers,
      maxPossibleScore: totalRounds * 10, // Default scoring
      completionPercentage: completed ? 100 : (round / totalRounds) * 100,
      startTime: new Date(Date.now() - (playTime * 1000)),
      endTime: new Date(),
      initialDifficulty: level,
      finalDifficulty: level,
      exitReason: completed ? 'completed' : 'quit',
      timestamp: new Date(),
      createdAt: new Date()
    };

    // Store in mock storage
    if (!progressStorage[userId]) {
      progressStorage[userId] = [];
    }
    progressStorage[userId].push(progressEntry);

    // In a real implementation, you would:
    // const progressRecord = new Progress(progressEntry);
    // await progressRecord.save();

    res.status(201).json({
      message: 'Progress saved successfully',
      progressId: progressEntry.sessionId,
      summary: {
        score: progressEntry.score,
        level: progressEntry.level,
        achievements: progressEntry.achievements.length
      }
    });

  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({
      message: 'Server error saving progress'
    });
  }
});

// @route   GET /api/progress
// @desc    Get user's game progress
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { gameId, timeframe = 'all', limit = 20 } = req.query;

    let userProgress = progressStorage[userId] || [];

    // Filter by game if specified
    if (gameId) {
      userProgress = userProgress.filter(p => p.gameId === gameId);
    }

    // Filter by timeframe
    if (timeframe !== 'all') {
      const now = new Date();
      let cutoffDate;

      switch (timeframe) {
        case 'day':
          cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }

      userProgress = userProgress.filter(p => new Date(p.createdAt) >= cutoffDate);
    }

    // Sort by most recent first
    userProgress.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Limit results
    const limitedProgress = userProgress.slice(0, parseInt(limit));

    // Calculate summary statistics
    const summary = {
      totalSessions: userProgress.length,
      totalScore: userProgress.reduce((sum, p) => sum + p.score, 0),
      totalPlayTime: userProgress.reduce((sum, p) => sum + p.playTime, 0),
      averageScore: userProgress.length > 0 ? 
        Math.round(userProgress.reduce((sum, p) => sum + p.score, 0) / userProgress.length) : 0,
      completedSessions: userProgress.filter(p => p.completed).length,
      uniqueGames: [...new Set(userProgress.map(p => p.gameId))].length,
      bestScore: userProgress.length > 0 ? Math.max(...userProgress.map(p => p.score)) : 0,
      totalAchievements: userProgress.reduce((sum, p) => sum + p.achievements.length, 0),
      completionRate: userProgress.length > 0 ? 
        Math.round((userProgress.filter(p => p.completed).length / userProgress.length) * 100) : 0,
      averagePlayTime: userProgress.length > 0 ?
        Math.round(userProgress.reduce((sum, p) => sum + p.playTime, 0) / userProgress.length) : 0
    };

    // Game-specific breakdown
    const gameBreakdown = {};
    const uniqueGameIds = [...new Set(userProgress.map(p => p.gameId))];
    
    uniqueGameIds.forEach(gameId => {
      const gameProgress = userProgress.filter(p => p.gameId === gameId);
      gameBreakdown[gameId] = {
        sessions: gameProgress.length,
        totalScore: gameProgress.reduce((sum, p) => sum + p.score, 0),
        averageScore: Math.round(gameProgress.reduce((sum, p) => sum + p.score, 0) / gameProgress.length),
        bestScore: Math.max(...gameProgress.map(p => p.score)),
        totalPlayTime: gameProgress.reduce((sum, p) => sum + p.playTime, 0),
        completionRate: Math.round((gameProgress.filter(p => p.completed).length / gameProgress.length) * 100),
        lastPlayed: gameProgress[0]?.createdAt || null
      };
    });

    res.json({
      progress: limitedProgress,
      summary,
      gameBreakdown,
      timeframe,
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      message: 'Server error fetching progress'
    });
  }
});

// @route   GET /api/progress/summary
// @desc    Get progress summary for specific timeframe
// @access  Private
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { timeframe = 'week', gameId } = req.query;

    const userProgress = progressStorage[userId] || [];

    // Filter by timeframe
    const now = new Date();
    let cutoffDate;

    switch (timeframe) {
      case 'day':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(0);
    }

    let filteredProgress = userProgress.filter(p => new Date(p.createdAt) >= cutoffDate);

    // Filter by game if specified
    if (gameId) {
      filteredProgress = filteredProgress.filter(p => p.gameId === gameId);
    }

    // Calculate detailed summary
    const summary = {
      timeframe,
      gameId: gameId || 'all',
      totalSessions: filteredProgress.length,
      completedSessions: filteredProgress.filter(p => p.completed).length,
      totalScore: filteredProgress.reduce((sum, p) => sum + p.score, 0),
      averageScore: filteredProgress.length > 0 ? 
        Math.round(filteredProgress.reduce((sum, p) => sum + p.score, 0) / filteredProgress.length) : 0,
      bestScore: filteredProgress.length > 0 ? Math.max(...filteredProgress.map(p => p.score)) : 0,
      totalPlayTime: filteredProgress.reduce((sum, p) => sum + p.playTime, 0),
      averagePlayTime: filteredProgress.length > 0 ?
        Math.round(filteredProgress.reduce((sum, p) => sum + p.playTime, 0) / filteredProgress.length) : 0,
      uniqueGames: [...new Set(filteredProgress.map(p => p.gameId))].length,
      totalAchievements: filteredProgress.reduce((sum, p) => sum + p.achievements.length, 0),
      completionRate: filteredProgress.length > 0 ?
        Math.round((filteredProgress.filter(p => p.completed).length / filteredProgress.length) * 100) : 0,
      totalCorrectAnswers: filteredProgress.reduce((sum, p) => sum + (p.correctAnswers || 0), 0),
      totalWrongAnswers: filteredProgress.reduce((sum, p) => sum + (p.wrongAnswers || 0), 0),
      gameBreakdown: {}
    };

    // Calculate accuracy
    const totalAnswers = summary.totalCorrectAnswers + summary.totalWrongAnswers;
    summary.averageAccuracy = totalAnswers > 0 ? 
      Math.round((summary.totalCorrectAnswers / totalAnswers) * 100) : 0;

    // Calculate per-game statistics
    const gameIds = [...new Set(filteredProgress.map(p => p.gameId))];
    gameIds.forEach(gameId => {
      const gameProgress = filteredProgress.filter(p => p.gameId === gameId);
      summary.gameBreakdown[gameId] = {
        sessions: gameProgress.length,
        totalScore: gameProgress.reduce((sum, p) => sum + p.score, 0),
        averageScore: Math.round(gameProgress.reduce((sum, p) => sum + p.score, 0) / gameProgress.length),
        bestScore: Math.max(...gameProgress.map(p => p.score)),
        totalPlayTime: gameProgress.reduce((sum, p) => sum + p.playTime, 0),
        completionRate: Math.round((gameProgress.filter(p => p.completed).length / gameProgress.length) * 100),
        correctAnswers: gameProgress.reduce((sum, p) => sum + (p.correctAnswers || 0), 0),
        wrongAnswers: gameProgress.reduce((sum, p) => sum + (p.wrongAnswers || 0), 0)
      };
      
      // Calculate game-specific accuracy
      const gameAnswers = summary.gameBreakdown[gameId].correctAnswers + summary.gameBreakdown[gameId].wrongAnswers;
      summary.gameBreakdown[gameId].accuracy = gameAnswers > 0 ?
        Math.round((summary.gameBreakdown[gameId].correctAnswers / gameAnswers) * 100) : 0;
    });

    // Daily breakdown for trend analysis
    const dailyBreakdown = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayProgress = filteredProgress.filter(p => 
        new Date(p.createdAt) >= dayStart && new Date(p.createdAt) < dayEnd
      );
      
      dailyBreakdown.push({
        date: dayStart.toISOString().split('T')[0],
        sessions: dayProgress.length,
        totalScore: dayProgress.reduce((sum, p) => sum + p.score, 0),
        averageScore: dayProgress.length > 0 ? 
          Math.round(dayProgress.reduce((sum, p) => sum + p.score, 0) / dayProgress.length) : 0,
        playTime: dayProgress.reduce((sum, p) => sum + p.playTime, 0),
        completed: dayProgress.filter(p => p.completed).length
      });
    }

    summary.dailyBreakdown = dailyBreakdown;

    res.json({ summary });

  } catch (error) {
    console.error('Get progress summary error:', error);
    res.status(500).json({
      message: 'Server error fetching progress summary'
    });
  }
});

// @route   GET /api/progress/achievements
// @desc    Get user's achievements
// @access  Private
router.get('/achievements', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userProgress = progressStorage[userId] || [];
    
    // Extract all achievements from progress
    const allAchievements = [];
    userProgress.forEach(progress => {
      progress.achievements.forEach(achievement => {
        allAchievements.push({
          ...achievement,
          gameId: progress.gameId,
          earnedAt: progress.createdAt,
          sessionId: progress.sessionId
        });
      });
    });
    
    // Group achievements by type
    const achievementGroups = {
      recent: allAchievements.slice(-10), // Last 10 achievements
      byGame: {},
      byType: {
        score: allAchievements.filter(a => a.includes && a.includes('score')),
        speed: allAchievements.filter(a => a.includes && a.includes('speed')),
        accuracy: allAchievements.filter(a => a.includes && a.includes('perfect')),
        persistence: allAchievements.filter(a => a.includes && a.includes('try'))
      }
    };
    
    // Group by game
    const gameIds = [...new Set(allAchievements.map(a => a.gameId))];
    gameIds.forEach(gameId => {
      achievementGroups.byGame[gameId] = allAchievements.filter(a => a.gameId === gameId);
    });
    
    res.json({
      achievements: allAchievements,
      groups: achievementGroups,
      total: allAchievements.length,
      recentCount: Math.min(10, allAchievements.length)
    });
    
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      message: 'Server error fetching achievements'
    });
  }
});

// @route   DELETE /api/progress/:sessionId
// @desc    Delete specific progress session
// @access  Private
router.delete('/:sessionId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sessionId } = req.params;

    if (!progressStorage[userId]) {
      return res.status(404).json({
        message: 'Progress session not found'
      });
    }

    const sessionIndex = progressStorage[userId].findIndex(p => p.sessionId === sessionId);
    
    if (sessionIndex === -1) {
      return res.status(404).json({
        message: 'Progress session not found'
      });
    }

    // Remove the session
    const deletedSession = progressStorage[userId].splice(sessionIndex, 1)[0];

    res.json({
      message: 'Progress session deleted successfully',
      deletedSession: {
        sessionId: deletedSession.sessionId,
        gameId: deletedSession.gameId,
        score: deletedSession.score,
        createdAt: deletedSession.createdAt
      }
    });

  } catch (error) {
    console.error('Delete progress error:', error);
    res.status(500).json({
      message: 'Server error deleting progress'
    });
  }
});

// @route   GET /api/progress/export
// @desc    Export progress data
// @access  Private
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { format = 'json', timeframe = 'all' } = req.query;
    
    let userProgress = progressStorage[userId] || [];
    
    // Filter by timeframe
    if (timeframe !== 'all') {
      const now = new Date();
      let cutoffDate;

      switch (timeframe) {
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }

      userProgress = userProgress.filter(p => new Date(p.createdAt) >= cutoffDate);
    }
    
    // Prepare export data
    const exportData = {
      exportDate: new Date().toISOString(),
      timeframe,
      userId,
      totalSessions: userProgress.length,
      data: userProgress.map(progress => ({
        sessionId: progress.sessionId,
        gameId: progress.gameId,
        date: new Date(progress.createdAt).toISOString().split('T')[0],
        time: new Date(progress.createdAt).toTimeString().split(' ')[0],
        score: progress.score,
        level: progress.level,
        playTime: Math.round(progress.playTime / 60), // in minutes
        completed: progress.completed,
        correctAnswers: progress.correctAnswers || 0,
        wrongAnswers: progress.wrongAnswers || 0,
        achievements: progress.achievements.join(', '),
        accuracy: progress.correctAnswers && progress.wrongAnswers ? 
          Math.round((progress.correctAnswers / (progress.correctAnswers + progress.wrongAnswers)) * 100) : 0
      }))
    };
    
    if (format === 'csv') {
      // Convert to CSV
      if (exportData.data.length === 0) {
        return res.status(400).json({ message: 'No data to export' });
      }
      
      const headers = Object.keys(exportData.data[0]);
      const csvHeaders = headers.join(',');
      const csvRows = exportData.data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      );
      
      const csv = [csvHeaders, ...csvRows].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="progress-${timeframe}-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } else {
      // JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="progress-${timeframe}-${new Date().toISOString().split('T')[0]}.json"`);
      res.json(exportData);
    }

  } catch (error) {
    console.error('Export progress error:', error);
    res.status(500).json({
      message: 'Server error exporting progress'
    });
  }
});

module.exports = router;
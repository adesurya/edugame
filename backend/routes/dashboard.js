// backend/routes/dashboard.js
const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Mock storage references - in production these would reference database
const progressStorage = {}; // This would reference the same storage as progress.js
const usersStorage = {}; // Mock user storage

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview for parent/teacher
// @access  Private (parent/teacher only)
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const { userType, userId } = req.user;

    if (userType !== 'parent' && userType !== 'teacher') {
      return res.status(403).json({
        message: 'Access denied. Parents and teachers only.'
      });
    }

    // In production, you would get all children associated with this parent/teacher
    // For now, we'll use mock data that represents aggregate statistics
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Mock calculation of overview statistics
    const allProgress = Object.values(progressStorage).flat();
    const recentProgress = allProgress.filter(p => new Date(p.createdAt) >= oneWeekAgo);
    
    const overview = {
      totalChildren: 3, // Mock data
      activeToday: 2,
      totalGamesPlayed: allProgress.length || 45,
      totalPlayTime: allProgress.reduce((sum, p) => sum + (p.playTime || 0), 0) || 12600, // in seconds
      averageScore: allProgress.length > 0 ? 
        Math.round(allProgress.reduce((sum, p) => sum + (p.score || 0), 0) / allProgress.length) : 78,
      improvementTrend: '+15%', // Mock calculation
      achievements: {
        total: allProgress.reduce((sum, p) => sum + (p.achievements?.length || 0), 0) || 23,
        thisWeek: recentProgress.reduce((sum, p) => sum + (p.achievements?.length || 0), 0) || 5
      },
      topPerformers: [
        { name: 'Emma', score: 95, avatar: '👧', id: 'child1' },
        { name: 'Alex', score: 87, avatar: '👦', id: 'child2' },
        { name: 'Sophie', score: 82, avatar: '👧', id: 'child3' }
      ],
      gamePopularity: [
        { 
          gameId: 'color-matching', 
          plays: allProgress.filter(p => p.gameId === 'color-matching').length || 18, 
          title: 'Color Matching',
          averageScore: 85
        },
        { 
          gameId: 'number-learning', 
          plays: allProgress.filter(p => p.gameId === 'number-learning').length || 15, 
          title: 'Number Learning',
          averageScore: 78
        },
        { 
          gameId: 'letter-learning', 
          plays: allProgress.filter(p => p.gameId === 'letter-learning').length || 12, 
          title: 'Letter Learning',
          averageScore: 82
        }
      ],
      weeklyActivity: generateWeeklyActivity(recentProgress),
      alerts: [
        { type: 'info', message: 'Emma achieved a perfect score in Color Matching!' },
        { type: 'warning', message: 'Alex hasn\'t played for 2 days' },
        { type: 'success', message: 'Sophie completed 5 games this week' }
      ]
    };

    res.json({ overview });

  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      message: 'Server error fetching dashboard overview'
    });
  }
});

// @route   GET /api/dashboard/children
// @desc    Get detailed progress for all children
// @access  Private (parent/teacher only)
router.get('/children', authMiddleware, async (req, res) => {
  try {
    const { userType } = req.user;

    if (userType !== 'parent' && userType !== 'teacher') {
      return res.status(403).json({
        message: 'Access denied. Parents and teachers only.'
      });
    }

    // In production, you would query the database for actual children
    // For now, we'll generate mock data with realistic statistics
    
    const children = [
      {
        id: 'child1',
        name: 'Emma Johnson',
        age: 5,
        avatar: '👧',
        totalSessions: calculateUserSessions('child1'),
        totalScore: calculateUserTotalScore('child1'),
        averageScore: calculateUserAverageScore('child1'),
        totalPlayTime: calculateUserPlayTime('child1'),
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        favoriteGame: getMostPlayedGame('child1'),
        achievements: getUserAchievements('child1'),
        weeklyProgress: generateWeeklyProgress('child1'),
        gameProgress: generateGameProgress('child1'),
        learningStats: {
          strengths: ['Color Recognition', 'Pattern Matching'],
          improvements: ['Number Sequencing'],
          currentLevel: 2,
          masteredSkills: 8,
          totalSkills: 15
        }
      },
      {
        id: 'child2',
        name: 'Alex Smith',
        age: 4,
        avatar: '👦',
        totalSessions: calculateUserSessions('child2'),
        totalScore: calculateUserTotalScore('child2'),
        averageScore: calculateUserAverageScore('child2'),
        totalPlayTime: calculateUserPlayTime('child2'),
        lastActive: new Date(), // Today
        favoriteGame: getMostPlayedGame('child2'),
        achievements: getUserAchievements('child2'),
        weeklyProgress: generateWeeklyProgress('child2'),
        gameProgress: generateGameProgress('child2'),
        learningStats: {
          strengths: ['Number Recognition', 'Counting'],
          improvements: ['Letter Recognition', 'Fine Motor Skills'],
          currentLevel: 1,
          masteredSkills: 5,
          totalSkills: 12
        }
      },
      {
        id: 'child3',
        name: 'Sophie Chen',
        age: 6,
        avatar: '👧',
        totalSessions: calculateUserSessions('child3'),
        totalScore: calculateUserTotalScore('child3'),
        averageScore: calculateUserAverageScore('child3'),
        totalPlayTime: calculateUserPlayTime('child3'),
        lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        favoriteGame: getMostPlayedGame('child3'),
        achievements: getUserAchievements('child3'),
        weeklyProgress: generateWeeklyProgress('child3'),
        gameProgress: generateGameProgress('child3'),
        learningStats: {
          strengths: ['Letter Recognition', 'Phonics', 'Reading Readiness'],
          improvements: ['Math Concepts'],
          currentLevel: 3,
          masteredSkills: 12,
          totalSkills: 18
        }
      }
    ];

    res.json({ children });

  } catch (error) {
    console.error('Dashboard children error:', error);
    res.status(500).json({
      message: 'Server error fetching children data'
    });
  }
});

// @route   GET /api/dashboard/reports/export
// @desc    Export comprehensive report
// @access  Private (parent/teacher only)
router.get('/reports/export', authMiddleware, async (req, res) => {
  try {
    const { userType } = req.user;
    const { format = 'json', timeframe = 'month', childId } = req.query;

    if (userType !== 'parent' && userType !== 'teacher') {
      return res.status(403).json({
        message: 'Access denied. Parents and teachers only.'
      });
    }

    // Generate comprehensive report
    const reportData = {
      generatedAt: new Date().toISOString(),
      generatedBy: req.user.userId,
      timeframe,
      childId: childId || 'all',
      summary: generateReportSummary(timeframe, childId),
      detailedProgress: generateDetailedProgress(timeframe, childId),
      learningInsights: generateLearningInsights(timeframe, childId),
      recommendations: generateRecommendations(timeframe, childId),
      gameAnalytics: generateGameAnalytics(timeframe, childId),
      achievementHistory: generateAchievementHistory(timeframe, childId)
    };

    if (format === 'csv') {
      // Convert detailed progress to CSV
      const csv = convertProgressToCSV(reportData.detailedProgress);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 
        `attachment; filename="learning-report-${timeframe}-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } else if (format === 'pdf') {
      // In a real implementation, you would generate a PDF report
      res.status(501).json({
        message: 'PDF export not yet implemented',
        suggestion: 'Use JSON or CSV format for now'
      });
    } else {
      // JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 
        `attachment; filename="learning-report-${timeframe}-${new Date().toISOString().split('T')[0]}.json"`);
      res.json(reportData);
    }

  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({
      message: 'Server error generating report'
    });
  }
});

// @route   GET /api/dashboard/analytics
// @desc    Get advanced learning analytics
// @access  Private (parent/teacher only)
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    const { userType } = req.user;
    const { period = '30d', childId } = req.query;

    if (userType !== 'parent' && userType !== 'teacher') {
      return res.status(403).json({
        message: 'Access denied. Parents and teachers only.'
      });
    }

    // Generate analytics data
    const analytics = {
      period,
      childId: childId || 'all',
      learningTrends: {
        engagement: {
          current: 78,
          previous: 72,
          trend: 'increasing',
          weeklyData: [65, 70, 72, 75, 76, 78, 80]
        },
        performance: {
          current: 84,
          previous: 81,
          trend: 'increasing',
          weeklyData: [80, 81, 79, 82, 83, 84, 85]
        },
        consistency: {
          current: 85,
          previous: 88,
          trend: 'decreasing',
          weeklyData: [88, 87, 86, 85, 84, 85, 85]
        }
      },
      skillDevelopment: [
        { skill: 'Color Recognition', level: 95, improvement: '+12%', category: 'Visual Processing' },
        { skill: 'Number Recognition', level: 82, improvement: '+8%', category: 'Math Readiness' },
        { skill: 'Letter Recognition', level: 76, improvement: '+15%', category: 'Literacy' },
        { skill: 'Pattern Matching', level: 70, improvement: '+5%', category: 'Logic' },
        { skill: 'Fine Motor Skills', level: 68, improvement: '+10%', category: 'Physical Development' }
      ],
      timeAnalysis: {
        optimalPlayTime: '15-20 minutes',
        currentAverage: '18 minutes',
        bestPerformanceTime: '10:00 AM - 11:00 AM',
        engagement: {
          morning: 85,
          afternoon: 72,
          evening: 45
        },
        weeklyPattern: {
          monday: 80,
          tuesday: 85,
          wednesday: 78,
          thursday: 82,
          friday: 75,
          saturday: 70,
          sunday: 65
        }
      },
      difficultyProgression: [
        { level: 1, mastery: 95, gamesCompleted: 15, averageScore: 88 },
        { level: 2, mastery: 78, gamesCompleted: 8, averageScore: 82 },
        { level: 3, mastery: 45, gamesCompleted: 3, averageScore: 75 }
      ],
      comparativeAnalysis: {
        peerComparison: {
          performance: 'above_average',
          percentile:
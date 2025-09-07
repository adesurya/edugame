// backend/models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  // References
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: String,
    required: true
  },
  
  // Session information
  sessionId: {
    type: String,
    required: true
  },
  
  // Game performance
  score: {
    type: Number,
    required: true,
    min: 0
  },
  maxPossibleScore: {
    type: Number,
    required: true
  },
  completionPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // Time tracking
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  playTime: {
    type: Number, // in seconds
    required: true
  },
  pauseTime: {
    type: Number, // total pause time in seconds
    default: 0
  },
  
  // Game progress details
  level: {
    type: Number,
    default: 1
  },
  round: {
    type: Number,
    default: 1
  },
  totalRounds: {
    type: Number,
    required: true
  },
  
  // Answer tracking
  answers: [{
    round: Number,
    question: String,
    userAnswer: mongoose.Schema.Types.Mixed,
    correctAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    responseTime: Number, // in milliseconds
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Performance metrics
  correctAnswers: {
    type: Number,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    default: 0
  },
  skippedAnswers: {
    type: Number,
    default: 0
  },
  averageResponseTime: {
    type: Number, // in milliseconds
    default: 0
  },
  
  // Achievements earned in this session
  achievementsEarned: [{
    achievementId: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Difficulty progression
  initialDifficulty: {
    type: Number,
    required: true
  },
  finalDifficulty: {
    type: Number,
    required: true
  },
  difficultyAdjustments: [{
    round: Number,
    oldDifficulty: Number,
    newDifficulty: Number,
    reason: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Game completion status
  completed: {
    type: Boolean,
    required: true
  },
  exitReason: {
    type: String,
    enum: ['completed', 'quit', 'timeout', 'error'],
    required: true
  },
  
  // Learning insights
  strengthAreas: [String],
  improvementAreas: [String],
  
  // Device and context
  deviceInfo: {
    userAgent: String,
    screenSize: String,
    isMobile: Boolean,
    platform: String
  },
  
  // Parent/teacher notes
  notes: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We're managing our own timestamps
});

// Indexes for performance
progressSchema.index({ userId: 1, gameId: 1 });
progressSchema.index({ userId: 1, createdAt: -1 });
progressSchema.index({ gameId: 1, createdAt: -1 });
progressSchema.index({ sessionId: 1 });
progressSchema.index({ completed: 1 });
progressSchema.index({ score: -1 });

// Compound indexes for analytics
progressSchema.index({ userId: 1, gameId: 1, createdAt: -1 });
progressSchema.index({ gameId: 1, completed: 1, score: -1 });

// Virtual for accuracy percentage
progressSchema.virtual('accuracyPercentage').get(function() {
  const totalAnswers = this.correctAnswers + this.wrongAnswers;
  if (totalAnswers === 0) return 0;
  return (this.correctAnswers / totalAnswers) * 100;
});

// Virtual for performance grade
progressSchema.virtual('performanceGrade').get(function() {
  const percentage = (this.score / this.maxPossibleScore) * 100;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
});

// Method to add an answer
progressSchema.methods.addAnswer = function(round, question, userAnswer, correctAnswer, responseTime) {
  const isCorrect = userAnswer === correctAnswer;
  
  this.answers.push({
    round,
    question,
    userAnswer,
    correctAnswer,
    isCorrect,
    responseTime
  });
  
  if (isCorrect) {
    this.correctAnswers += 1;
  } else {
    this.wrongAnswers += 1;
  }
  
  // Update average response time
  const totalAnswers = this.answers.length;
  const totalResponseTime = this.answers.reduce((sum, answer) => sum + answer.responseTime, 0);
  this.averageResponseTime = totalResponseTime / totalAnswers;
  
  return this;
};

// Method to calculate learning insights
progressSchema.methods.calculateInsights = function() {
  const accuracy = this.accuracyPercentage;
  const avgResponseTime = this.averageResponseTime;
  
  this.strengthAreas = [];
  this.improvementAreas = [];
  
  if (accuracy >= 80) {
    this.strengthAreas.push('accuracy');
  } else {
    this.improvementAreas.push('accuracy');
  }
  
  if (avgResponseTime <= 3000) { // 3 seconds
    this.strengthAreas.push('speed');
  } else {
    this.improvementAreas.push('speed');
  }
  
  if (this.completionPercentage >= 90) {
    this.strengthAreas.push('persistence');
  } else if (this.completionPercentage < 50) {
    this.improvementAreas.push('persistence');
  }
  
  return this;
};

// Static method to get user progress summary
progressSchema.statics.getUserProgressSummary = async function(userId, timeframe = 'week') {
  const timeAgo = new Date();
  
  switch (timeframe) {
    case 'day':
      timeAgo.setDate(timeAgo.getDate() - 1);
      break;
    case 'week':
      timeAgo.setDate(timeAgo.getDate() - 7);
      break;
    case 'month':
      timeAgo.setMonth(timeAgo.getMonth() - 1);
      break;
    case 'all':
      timeAgo.setFullYear(timeAgo.getFullYear() - 10);
      break;
  }
  
  const pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: timeAgo }
      }
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        completedSessions: {
          $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
        },
        totalScore: { $sum: '$score' },
        totalPlayTime: { $sum: '$playTime' },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracyPercentage' },
        bestScore: { $max: '$score' },
        gamesPlayed: { $addToSet: '$gameId' },
        totalAchievements: { $sum: { $size: '$achievementsEarned' } }
      }
    },
    {
      $project: {
        _id: 0,
        totalSessions: 1,
        completedSessions: 1,
        completionRate: {
          $multiply: [
            { $divide: ['$completedSessions', '$totalSessions'] },
            100
          ]
        },
        totalScore: 1,
        totalPlayTime: 1,
        averageScore: { $round: ['$averageScore', 2] },
        averageAccuracy: { $round: ['$averageAccuracy', 2] },
        bestScore: 1,
        uniqueGamesPlayed: { $size: '$gamesPlayed' },
        totalAchievements: 1
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalSessions: 0,
    completedSessions: 0,
    completionRate: 0,
    totalScore: 0,
    totalPlayTime: 0,
    averageScore: 0,
    averageAccuracy: 0,
    bestScore: 0,
    uniqueGamesPlayed: 0,
    totalAchievements: 0
  };
};

// Method to export progress data
progressSchema.methods.toExportFormat = function() {
  return {
    sessionId: this.sessionId,
    gameId: this.gameId,
    date: this.createdAt.toISOString().split('T')[0],
    time: this.createdAt.toTimeString().split(' ')[0],
    score: this.score,
    maxScore: this.maxPossibleScore,
    percentage: Math.round((this.score / this.maxPossibleScore) * 100),
    accuracy: Math.round(this.accuracyPercentage),
    playTime: Math.round(this.playTime / 60), // in minutes
    completed: this.completed,
    level: this.level,
    correctAnswers: this.correctAnswers,
    wrongAnswers: this.wrongAnswers,
    achievementsEarned: this.achievementsEarned.length,
    strengthAreas: this.strengthAreas.join(', '),
    improvementAreas: this.improvementAreas.join(', ')
  };
};

module.exports = mongoose.model('Progress', progressSchema);
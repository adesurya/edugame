// backend/models/Achievement.js
const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  // Achievement identification
  achievementId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Visual representation
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#FFD700'
  },
  
  // Achievement classification
  category: {
    type: String,
    enum: ['score', 'speed', 'accuracy', 'streak', 'exploration', 'persistence', 'improvement'],
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  
  // Game association
  gameId: {
    type: String,
    default: null // null means global achievement
  },
  
  // Unlock conditions
  conditions: {
    scoreThreshold: Number,
    accuracyThreshold: Number,
    speedThreshold: Number,
    streakLength: Number,
    gamesCompleted: Number,
    perfectScores: Number,
    totalPlayTime: Number,
    consecutiveDays: Number
  },
  
  // Point value
  points: {
    type: Number,
    default: 10
  },
  
  // Visibility and availability
  isVisible: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Statistics
  stats: {
    totalUnlocked: {
      type: Number,
      default: 0
    },
    firstUnlockedDate: Date,
    lastUnlockedDate: Date
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
achievementSchema.index({ achievementId: 1 });
achievementSchema.index({ category: 1 });
achievementSchema.index({ gameId: 1 });
achievementSchema.index({ rarity: 1 });
achievementSchema.index({ isActive: 1, isVisible: 1 });

// Method to check if user qualifies for this achievement
achievementSchema.methods.checkQualification = function(userProgress, gameProgress) {
  const conditions = this.conditions;
  
  // Score-based achievements
  if (conditions.scoreThreshold && gameProgress.score < conditions.scoreThreshold) {
    return false;
  }
  
  // Accuracy-based achievements
  if (conditions.accuracyThreshold && gameProgress.accuracyPercentage < conditions.accuracyThreshold) {
    return false;
  }
  
  // Speed-based achievements
  if (conditions.speedThreshold && gameProgress.averageResponseTime > conditions.speedThreshold) {
    return false;
  }
  
  // All conditions met
  return true;
};

// Static method to get available achievements for user
achievementSchema.statics.getAvailableAchievements = async function(userId, gameId = null) {
  const query = {
    isActive: true,
    isVisible: true
  };
  
  if (gameId) {
    query.$or = [
      { gameId: gameId },
      { gameId: null }
    ];
  }
  
  return this.find(query).sort({ rarity: 1, points: 1 });
};

module.exports = mongoose.model('Achievement', achievementSchema);
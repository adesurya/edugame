// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic user information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 30
  },
  email: {
    type: String,
    required: function() {
      return this.userType === 'parent' || this.userType === 'teacher';
    },
    unique: true,
    sparse: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return this.userType === 'parent' || this.userType === 'teacher';
    },
    minlength: 6
  },
  
  // User type and permissions
  userType: {
    type: String,
    enum: ['child', 'parent', 'teacher'],
    required: true,
    default: 'child'
  },
  
  // Child-specific information
  childProfile: {
    age: {
      type: Number,
      min: 3,
      max: 12
    },
    grade: {
      type: String,
      enum: ['preschool', 'kindergarten', 'grade1', 'grade2']
    },
    avatar: {
      type: String,
      default: '👶'
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Parent/Teacher information
  adultProfile: {
    firstName: String,
    lastName: String,
    phone: String,
    children: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  
  // Game statistics
  gameStats: {
    totalScore: {
      type: Number,
      default: 0
    },
    gamesCompleted: {
      type: Number,
      default: 0
    },
    totalPlayTime: {
      type: Number,
      default: 0 // in seconds
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    }
  },
  
  // Achievements
  achievements: [{
    achievementId: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    gameId: String
  }],
  
  // Settings and preferences
  settings: {
    volume: {
      type: Number,
      default: 80,
      min: 0,
      max: 100
    },
    musicEnabled: {
      type: Boolean,
      default: true
    },
    soundEffectsEnabled: {
      type: Boolean,
      default: true
    },
    animationsEnabled: {
      type: Boolean,
      default: true
    },
    autoAdjustDifficulty: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'id', 'es', 'fr']
    }
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Privacy and safety
  parentalConsent: {
    type: Boolean,
    default: false
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

// Indexes for performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ 'childProfile.parentId': 1 });
userSchema.index({ 'gameStats.lastActiveDate': -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last active date
userSchema.methods.updateLastActive = function() {
  this.gameStats.lastActiveDate = new Date();
  return this.save();
};

// Add achievement
userSchema.methods.addAchievement = function(achievementId, gameId) {
  const existingAchievement = this.achievements.find(
    achievement => achievement.achievementId === achievementId
  );
  
  if (!existingAchievement) {
    this.achievements.push({
      achievementId,
      gameId,
      unlockedAt: new Date()
    });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Get child-safe user data
userSchema.methods.toChildSafeJSON = function() {
  const obj = this.toObject();
  
  // Remove sensitive information
  delete obj.password;
  delete obj.email;
  delete obj.adultProfile;
  
  return {
    id: obj._id,
    username: obj.username,
    userType: obj.userType,
    childProfile: obj.childProfile,
    gameStats: obj.gameStats,
    achievements: obj.achievements,
    settings: obj.settings,
    createdAt: obj.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
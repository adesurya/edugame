    // backend/models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  // Game identification
  gameId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Game categorization
  category: {
    type: String,
    required: true,
    enum: ['colors', 'numbers', 'letters', 'shapes', 'sounds', 'memory', 'logic', 'creativity']
  },
  
  // Age and difficulty
  ageGroup: {
    min: {
      type: Number,
      required: true,
      min: 3,
      max: 12
    },
    max: {
      type: Number,
      required: true,
      min: 3,
      max: 12
    }
  },
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Game mechanics
  estimatedDuration: {
    type: Number, // in minutes
    required: true,
    min: 1,
    max: 30
  },
  maxScore: {
    type: Number,
    default: 100
  },
  hasTimeLimit: {
    type: Boolean,
    default: false
  },
  timeLimit: {
    type: Number, // in seconds
    default: null
  },
  
  // Educational objectives
  learningObjectives: [{
    type: String,
    required: true
  }],
  skills: [{
    type: String,
    enum: [
      'color-recognition', 'number-recognition', 'letter-recognition',
      'pattern-matching', 'memory', 'problem-solving', 'creativity',
      'fine-motor', 'hand-eye-coordination', 'logical-thinking'
    ]
  }],
  
  // Game assets and resources
  assets: {
    icon: {
      type: String,
      required: true
    },
    thumbnail: String,
    sounds: [String],
    images: [String]
  },
  
  // Game configuration
  config: {
    rounds: {
      type: Number,
      default: 10
    },
    lives: {
      type: Number,
      default: 3
    },
    scoringSystem: {
      correctAnswer: {
        type: Number,
        default: 10
      },
      wrongAnswer: {
        type: Number,
        default: -2
      },
      timeBonus: {
        type: Number,
        default: 5
      }
    }
  },
  
  // Adaptive difficulty
  adaptiveDifficulty: {
    enabled: {
      type: Boolean,
      default: true
    },
    adjustmentFactor: {
      type: Number,
      default: 0.1
    },
    minDifficulty: {
      type: Number,
      default: 1
    },
    maxDifficulty: {
      type: Number,
      default: 5
    }
  },
  
  // Game status
  isActive: {
    type: Boolean,
    default: true
  },
  version: {
    type: String,
    required: true,
    default: '1.0.0'
  },
  
  // Analytics
  analytics: {
    totalPlays: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageCompletionTime: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
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
gameSchema.index({ gameId: 1 });
gameSchema.index({ category: 1 });
gameSchema.index({ 'ageGroup.min': 1, 'ageGroup.max': 1 });
gameSchema.index({ difficulty: 1 });
gameSchema.index({ isActive: 1 });

// Virtual for age range display
gameSchema.virtual('ageRange').get(function() {
  if (this.ageGroup.min === this.ageGroup.max) {
    return `${this.ageGroup.min}`;
  }
  return `${this.ageGroup.min}-${this.ageGroup.max}`;
});

// Method to check if game is suitable for age
gameSchema.methods.isSuitableForAge = function(age) {
  return age >= this.ageGroup.min && age <= this.ageGroup.max;
};

// Method to update analytics
gameSchema.methods.updateAnalytics = function(score, completionTime, completed) {
  this.analytics.totalPlays += 1;
  
  if (completed) {
    // Update average score
    const currentAvg = this.analytics.averageScore;
    const totalCompleted = this.analytics.totalPlays * this.analytics.completionRate / 100;
    this.analytics.averageScore = ((currentAvg * totalCompleted) + score) / (totalCompleted + 1);
    
    // Update average completion time
    const currentTimeAvg = this.analytics.averageCompletionTime;
    this.analytics.averageCompletionTime = ((currentTimeAvg * totalCompleted) + completionTime) / (totalCompleted + 1);
    
    // Update completion rate
    this.analytics.completionRate = ((totalCompleted + 1) / this.analytics.totalPlays) * 100;
  }
  
  return this.save();
};

module.exports = mongoose.model('Game', gameSchema);
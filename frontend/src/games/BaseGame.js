/**
 * Debug BaseGame - Minimal version untuk testing
 */
class BaseGame {
  constructor(gameConfig) {
    console.log('BaseGame constructor called with config:', gameConfig);
    
    this.config = {
      id: gameConfig.id || 'unknown-game',
      title: gameConfig.title || 'Unknown Game',
      category: gameConfig.category || 'general',
      ageGroup: gameConfig.ageGroup || '3-6',
      difficulty: gameConfig.difficulty || 1,
      maxScore: gameConfig.maxScore || 100,
      timeLimit: gameConfig.timeLimit || null,
      ...gameConfig
    };
    
    // Game state
    this.isPlaying = false;
    this.isPaused = false;
    this.isDestroyed = false;
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.startTime = null;
    this.endTime = null;
    this.mistakes = 0;
    this.achievements = [];
    
    // Progress tracking
    this.progress = {
      totalAttempts: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeSpent: 0,
      bestScore: 0,
      completionRate: 0
    };
    
    // UI elements - simplified
    this.gameContainer = null;
    this.uiElements = {};
    
    // Audio manager
    this.audioManager = window.audioManager;
    
    console.log('BaseGame initialized:', this.config.title);
    
    // Simple initialization
    try {
      this.simpleInit();
    } catch (error) {
      console.error('BaseGame initialization failed:', error);
    }
  }
  
  simpleInit() {
    console.log('BaseGame simple init');
    // Don't create container here - let child classes handle it
    // This prevents conflicts
  }
  
  // Simplified start method
  start() {
    if (this.isDestroyed) {
      console.warn('Cannot start destroyed game');
      return;
    }
    
    console.log('Starting game:', this.config.title);
    this.isPlaying = true;
    this.startTime = new Date();
    this.progress.totalAttempts++;
    
    // Play start sound if available
    if (this.audioManager && this.audioManager.playSound) {
      try {
        this.audioManager.playSound('gameStart');
      } catch (error) {
        console.warn('Failed to play start sound:', error);
      }
    }
    
    this.onGameStart();
  }
  
  // Simplified end method
  end(reason = 'completed') {
    if (!this.isPlaying || this.isDestroyed) {
      console.warn('Cannot end game - not playing or destroyed');
      return;
    }
    
    console.log('Ending game:', this.config.title, 'Reason:', reason);
    this.isPlaying = false;
    this.endTime = new Date();
    
    if (this.startTime) {
      this.progress.timeSpent = (this.endTime - this.startTime) / 1000;
    }
    
    this.calculateFinalProgress();
    this.onGameEnd(reason);
  }
  
  // Simplified score update
  updateScore(points) {
    if (this.isDestroyed) return;
    
    const oldScore = this.score;
    this.score = Math.max(0, this.score + points);
    
    if (points > 0) {
      this.progress.correctAnswers++;
      console.log('Correct answer! Score:', this.score);
      
      if (this.audioManager && this.audioManager.playSound) {
        try {
          this.audioManager.playSound('correct');
        } catch (error) {
          console.warn('Failed to play correct sound:', error);
        }
      }
    } else if (points < 0) {
      this.progress.wrongAnswers++;
      this.mistakes++;
      console.log('Wrong answer! Score:', this.score);
      
      if (this.audioManager && this.audioManager.playSound) {
        try {
          this.audioManager.playSound('wrong');
        } catch (error) {
          console.warn('Failed to play wrong sound:', error);
        }
      }
    }
    
    this.updateUI();
    this.onScoreUpdate(oldScore, this.score);
  }
  
  // Simplified UI update
  updateUI() {
    if (this.isDestroyed) return;
    
    // Try to update score display if it exists
    const scoreEl = document.getElementById('score-value');
    if (scoreEl) {
      scoreEl.textContent = this.score;
    }
    
    const levelEl = document.getElementById('level-value');
    if (levelEl) {
      levelEl.textContent = this.level;
    }
    
    const livesEl = document.getElementById('lives-value');
    if (livesEl) {
      livesEl.textContent = this.lives;
    }
    
    console.log('UI updated - Score:', this.score, 'Level:', this.level);
  }
  
  // Simplified feedback
  showFeedback(type, message) {
    console.log(`Feedback (${type}):`, message);
    
    // Try to show visual feedback if container exists
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
      const feedback = document.createElement('div');
      feedback.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 20px 30px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        font-size: 18px;
        font-weight: bold;
        z-index: 2000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        color: ${type === 'correct' ? '#4CAF50' : type === 'wrong' ? '#f44336' : '#FF9800'};
        border-left: 5px solid ${type === 'correct' ? '#4CAF50' : type === 'wrong' ? '#f44336' : '#FF9800'};
      `;
      feedback.textContent = message;
      
      gameContainer.appendChild(feedback);
      
      // Remove after delay
      setTimeout(() => {
        if (feedback.parentElement) {
          feedback.remove();
        }
      }, 2000);
    }
  }
  
  calculateFinalProgress() {
    const total = this.progress.correctAnswers + this.progress.wrongAnswers;
    this.progress.completionRate = total > 0 ? (this.progress.correctAnswers / total) * 100 : 0;
    this.progress.bestScore = Math.max(this.progress.bestScore, this.score);
    
    console.log('Final progress calculated:', this.progress);
  }
  
  // Simplified destroy
  destroy() {
    if (this.isDestroyed) {
      console.warn('Game already destroyed');
      return;
    }
    
    console.log('Destroying game:', this.config.title);
    this.isDestroyed = true;
    
    // End game if still playing
    if (this.isPlaying) {
      this.end('exit');
    }
    
    // Clear references
    this.gameContainer = null;
    this.uiElements = {};
    this.audioManager = null;
    
    console.log('Game destroyed:', this.config.title);
  }
  
  // Abstract methods - child classes should override these
  onGameStart() {
    console.log('Game started (override this method in child class)');
  }
  
  onGameEnd(reason) {
    console.log('Game ended (override this method in child class):', reason);
  }
  
  onScoreUpdate(oldScore, newScore) {
    console.log('Score updated (override this method in child class):', oldScore, '->', newScore);
  }
  
  getHelpContent() {
    return 'Help content not implemented in child class';
  }
  
  // Optional methods that child classes can override
  onGamePause() {
    console.log('Game paused');
  }
  
  onGameResume() {
    console.log('Game resumed');
  }
}

// Make available globally
window.BaseGame = BaseGame;
console.log('Debug BaseGame class defined');
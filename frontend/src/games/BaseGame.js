/**
 * BaseGame - Abstract base class for all educational games
 * Provides common functionality for progress tracking, audio, UI, and game lifecycle
 */
class BaseGame {
  constructor(gameConfig) {
    this.config = {
      id: gameConfig.id,
      title: gameConfig.title,
      category: gameConfig.category,
      ageGroup: gameConfig.ageGroup,
      difficulty: gameConfig.difficulty || 1,
      maxScore: gameConfig.maxScore || 100,
      timeLimit: gameConfig.timeLimit || null,
      ...gameConfig
    };
    
    // Game state
    this.isPlaying = false;
    this.isPaused = false;
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
    
    // UI elements
    this.canvas = null;
    this.ctx = null;
    this.gameContainer = null;
    this.uiElements = {};
    
    // Socket connection for real-time updates
    this.socket = window.io ? window.io() : null;
    
    // Audio manager
    this.audioManager = window.audioManager;
    
    this.init();
  }
  
  /**
   * Initialize game - to be implemented by child classes
   */
  init() {
    this.createGameContainer();
    this.setupUI();
    this.bindEvents();
    console.log(`Game ${this.config.title} initialized`);
  }
  
  /**
   * Create main game container
   */
  createGameContainer() {
    this.gameContainer = document.getElementById('game-container') || 
                        document.createElement('div');
    this.gameContainer.id = 'game-container';
    this.gameContainer.className = 'game-container';
    
    if (!document.getElementById('game-container')) {
      document.body.appendChild(this.gameContainer);
    }
    
    this.gameContainer.innerHTML = `
      <div class="game-header">
        <div class="game-title">${this.config.title}</div>
        <div class="game-stats">
          <span class="score">Score: <span id="score-value">0</span></span>
          <span class="level">Level: <span id="level-value">1</span></span>
          <span class="lives">❤️ <span id="lives-value">3</span></span>
        </div>
        <div class="game-controls">
          <button id="pause-btn" class="btn-control">⏸️</button>
          <button id="help-btn" class="btn-control">❓</button>
          <button id="exit-btn" class="btn-control">🚪</button>
        </div>
      </div>
      <div class="game-content" id="game-content">
        <!-- Game-specific content goes here -->
      </div>
      <div class="game-footer">
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
      </div>
    `;
  }
  
  /**
   * Setup common UI elements
   */
  setupUI() {
    // Store references to common UI elements
    this.uiElements = {
      scoreValue: document.getElementById('score-value'),
      levelValue: document.getElementById('level-value'),
      livesValue: document.getElementById('lives-value'),
      progressFill: document.getElementById('progress-fill'),
      gameContent: document.getElementById('game-content'),
      pauseBtn: document.getElementById('pause-btn'),
      helpBtn: document.getElementById('help-btn'),
      exitBtn: document.getElementById('exit-btn')
    };
    
    this.updateUI();
  }
  
  /**
   * Bind common event listeners
   */
  bindEvents() {
    // Control buttons
    if (this.uiElements.pauseBtn) {
      this.uiElements.pauseBtn.addEventListener('click', () => this.togglePause());
    }
    
    if (this.uiElements.helpBtn) {
      this.uiElements.helpBtn.addEventListener('click', () => this.showHelp());
    }
    
    if (this.uiElements.exitBtn) {
      this.uiElements.exitBtn.addEventListener('click', () => this.exitGame());
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case ' ': // Spacebar for pause
        case 'Escape':
          e.preventDefault();
          this.togglePause();
          break;
        case 'h':
        case 'H':
          this.showHelp();
          break;
      }
    });
  }
  
  /**
   * Start the game
   */
  start() {
    this.isPlaying = true;
    this.startTime = new Date();
    this.progress.totalAttempts++;
    
    this.audioManager?.playSound('gameStart');
    this.onGameStart();
    
    // Emit to socket for tracking
    if (this.socket) {
      this.socket.emit('game-started', {
        gameId: this.config.id,
        timestamp: this.startTime
      });
    }
    
    console.log(`Game ${this.config.title} started`);
  }
  
  /**
   * Pause/Resume game
   */
  togglePause() {
    if (!this.isPlaying) return;
    
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.onGamePause();
      this.uiElements.pauseBtn.textContent = '▶️';
    } else {
      this.onGameResume();
      this.uiElements.pauseBtn.textContent = '⏸️';
    }
  }
  
  /**
   * End the game
   */
  end(reason = 'completed') {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    this.endTime = new Date();
    this.progress.timeSpent = (this.endTime - this.startTime) / 1000;
    
    // Calculate final progress metrics
    this.calculateFinalProgress();
    
    // Check for achievements
    this.checkAchievements();
    
    this.onGameEnd(reason);
    
    // Emit completion event
    if (this.socket) {
      this.socket.emit('game-completed', {
        gameId: this.config.id,
        finalScore: this.score,
        progress: this.progress,
        achievements: this.achievements,
        reason: reason
      });
    }
    
    // Save progress to backend
    this.saveProgress();
    
    console.log(`Game ${this.config.title} ended:`, reason);
  }
  
  /**
   * Update score and trigger related events
   */
  updateScore(points) {
    const oldScore = this.score;
    this.score = Math.max(0, this.score + points);
    
    if (points > 0) {
      this.progress.correctAnswers++;
      this.audioManager?.playSound('correct');
      this.showFeedback('correct', `+${points}!`);
    } else if (points < 0) {
      this.progress.wrongAnswers++;
      this.mistakes++;
      this.audioManager?.playSound('wrong');
      this.showFeedback('wrong', 'Try again!');
    }
    
    this.updateUI();
    this.onScoreUpdate(oldScore, this.score);
  }
  
  /**
   * Update UI elements
   */
  updateUI() {
    if (this.uiElements.scoreValue) {
      this.uiElements.scoreValue.textContent = this.score;
    }
    if (this.uiElements.levelValue) {
      this.uiElements.levelValue.textContent = this.level;
    }
    if (this.uiElements.livesValue) {
      this.uiElements.livesValue.textContent = this.lives;
    }
    
    // Update progress bar
    const progress = Math.min(100, (this.score / this.config.maxScore) * 100);
    if (this.uiElements.progressFill) {
      this.uiElements.progressFill.style.width = `${progress}%`;
    }
  }
  
  /**
   * Show visual feedback
   */
  showFeedback(type, message) {
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${type}`;
    feedback.textContent = message;
    
    this.gameContainer.appendChild(feedback);
    
    // Animate and remove
    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transform = 'translateY(-50px)';
      setTimeout(() => feedback.remove(), 300);
    }, 1000);
  }
  
  /**
   * Show help dialog
   */
  showHelp() {
    const helpContent = this.getHelpContent();
    // Implementation would show a modal with help content
    console.log('Help:', helpContent);
  }
  
  /**
   * Exit game and return to menu
   */
  exitGame() {
    this.end('exit');
    // Navigate back to game selection
    window.location.hash = '#games';
  }
  
  /**
   * Calculate final progress metrics
   */
  calculateFinalProgress() {
    const total = this.progress.correctAnswers + this.progress.wrongAnswers;
    this.progress.completionRate = total > 0 ? (this.progress.correctAnswers / total) * 100 : 0;
    this.progress.bestScore = Math.max(this.progress.bestScore, this.score);
  }
  
  /**
   * Check for achievements
   */
  checkAchievements() {
    // Perfect score achievement
    if (this.mistakes === 0 && this.score >= this.config.maxScore * 0.8) {
      this.achievements.push('perfect-score');
    }
    
    // Speed achievement
    if (this.progress.timeSpent < 60) {
      this.achievements.push('speed-demon');
    }
    
    // First completion
    if (this.progress.totalAttempts === 1) {
      this.achievements.push('first-try');
    }
  }
  
  /**
   * Save progress to backend
   */
  async saveProgress() {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          gameId: this.config.id,
          score: this.score,
          level: this.level,
          progress: this.progress,
          achievements: this.achievements,
          playTime: this.progress.timeSpent
        })
      });
      
      if (response.ok) {
        console.log('Progress saved successfully');
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }
  
  // Abstract methods to be implemented by child classes
  onGameStart() { console.log('Override onGameStart() in child class'); }
  onGamePause() { console.log('Override onGamePause() in child class'); }
  onGameResume() { console.log('Override onGameResume() in child class'); }
  onGameEnd(reason) { console.log('Override onGameEnd() in child class'); }
  onScoreUpdate(oldScore, newScore) { console.log('Override onScoreUpdate() in child class'); }
  getHelpContent() { return 'Override getHelpContent() in child class'; }
  
  /**
   * Cleanup resources
   */
  destroy() {
    if (this.gameContainer) {
      this.gameContainer.remove();
    }
    
    // Remove event listeners
    document.removeEventListener('keydown', this.boundKeyHandler);
    
    console.log(`Game ${this.config.title} destroyed`);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaseGame;
} else {
  window.BaseGame = BaseGame;
}
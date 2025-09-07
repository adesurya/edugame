/**
 * ColorMatching - Educational color matching game for ages 3-4
 * Children learn to identify and match colors through interactive gameplay
 */
class ColorMatchingGame extends BaseGame {
  constructor() {
    super({
      id: 'color-matching',
      title: 'Color Matching Fun!',
      category: 'colors',
      ageGroup: '3-4',
      difficulty: 1,
      maxScore: 100,
      timeLimit: null // No time pressure for young children
    });
    
    // Game-specific properties
    this.colors = [
      { name: 'Red', hex: '#FF4444', rgb: 'rgb(255, 68, 68)' },
      { name: 'Blue', hex: '#4444FF', rgb: 'rgb(68, 68, 255)' },
      { name: 'Green', hex: '#44FF44', rgb: 'rgb(68, 255, 68)' },
      { name: 'Yellow', hex: '#FFFF44', rgb: 'rgb(255, 255, 68)' },
      { name: 'Orange', hex: '#FF8844', rgb: 'rgb(255, 136, 68)' },
      { name: 'Purple', hex: '#8844FF', rgb: 'rgb(136, 68, 255)' }
    ];
    
    this.currentRound = 1;
    this.totalRounds = 10;
    this.targetColor = null;
    this.colorOptions = [];
    this.selectedColor = null;
    this.roundsCompleted = 0;
  }
  
  /**
   * Initialize color matching game
   */
  init() {
    super.init();
    this.setupColorMatchingUI();
    console.log('Color Matching Game ready!');
  }
  
  /**
   * Setup game-specific UI
   */
  setupColorMatchingUI() {
    const gameContent = this.uiElements.gameContent;
    gameContent.innerHTML = `
      <div class="color-game-container">
        <div class="instruction-panel">
          <h2 class="instruction-text" id="instruction">Welcome to Color Matching!</h2>
          <div class="start-panel" id="start-panel">
            <button class="btn-start" id="start-btn">🎨 Let's Play!</button>
          </div>
        </div>
        
        <div class="game-area" id="game-area" style="display: none;">
          <div class="target-section">
            <h3>Find this color:</h3>
            <div class="target-color" id="target-color">
              <div class="color-circle target-circle" id="target-circle"></div>
              <div class="color-name" id="target-name">Red</div>
            </div>
          </div>
          
          <div class="options-section">
            <h3>Click on the matching color:</h3>
            <div class="color-options" id="color-options">
              <!-- Color option circles will be generated here -->
            </div>
          </div>
          
          <div class="feedback-area" id="feedback-area">
            <!-- Success/error messages appear here -->
          </div>
          
          <div class="round-info">
            Round: <span id="current-round">1</span> / <span id="total-rounds">10</span>
          </div>
        </div>
        
        <div class="completion-panel" id="completion-panel" style="display: none;">
          <div class="completion-content">
            <h2>🎉 Congratulations!</h2>
            <div class="final-stats">
              <p>You matched <span id="final-correct">0</span> colors correctly!</p>
              <p>Final Score: <span id="final-score">0</span></p>
            </div>
            <div class="achievement-badges" id="achievement-badges"></div>
            <button class="btn-restart" id="restart-btn">Play Again</button>
            <button class="btn-menu" id="menu-btn">Back to Games</button>
          </div>
        </div>
      </div>
    `;
    
    // Bind game-specific events
    this.bindColorMatchingEvents();
  }
  
  /**
   * Bind color matching specific events
   */
  bindColorMatchingEvents() {
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const menuBtn = document.getElementById('menu-btn');
    
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }
    
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restartGame());
    }
    
    if (menuBtn) {
      menuBtn.addEventListener('click', () => this.exitGame());
    }
  }
  
  /**
   * Start the color matching game
   */
  startGame() {
    this.start(); // Call parent start method
    
    // Hide start panel, show game area
    document.getElementById('start-panel').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    
    this.nextRound();
  }
  
  /**
   * Start next round
   */
  nextRound() {
    if (this.roundsCompleted >= this.totalRounds) {
      this.completeGame();
      return;
    }
    
    this.currentRound = this.roundsCompleted + 1;
    this.generateRound();
    this.updateRoundUI();
    
    // Announce the color name for audio learning
    this.announceTargetColor();
  }
  
  /**
   * Generate a new round with target color and options
   */
  generateRound() {
    // Select random target color
    this.targetColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    // Create color options (target + 2-3 random colors)
    this.colorOptions = [this.targetColor];
    
    // Add 2-3 random different colors
    const numOptions = Math.min(4, 2 + Math.floor(this.currentRound / 3)); // Gradually increase difficulty
    
    while (this.colorOptions.length < numOptions) {
      const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      
      // Make sure we don't add duplicate colors
      if (!this.colorOptions.find(color => color.name === randomColor.name)) {
        this.colorOptions.push(randomColor);
      }
    }
    
    // Shuffle the options so target isn't always first
    this.shuffleArray(this.colorOptions);
  }
  
  /**
   * Update UI for current round
   */
  updateRoundUI() {
    // Update target color display
    const targetCircle = document.getElementById('target-circle');
    const targetName = document.getElementById('target-name');
    const currentRoundSpan = document.getElementById('current-round');
    const totalRoundsSpan = document.getElementById('total-rounds');
    
    if (targetCircle) {
      targetCircle.style.backgroundColor = this.targetColor.hex;
      targetCircle.style.border = '4px solid #333';
    }
    
    if (targetName) {
      targetName.textContent = this.targetColor.name;
      targetName.style.color = this.targetColor.hex;
      targetName.style.fontWeight = 'bold';
    }
    
    if (currentRoundSpan) currentRoundSpan.textContent = this.currentRound;
    if (totalRoundsSpan) totalRoundsSpan.textContent = this.totalRounds;
    
    // Generate color option buttons
    this.generateColorOptions();
  }
  
  /**
   * Generate clickable color options
   */
  generateColorOptions() {
    const optionsContainer = document.getElementById('color-options');
    if (!optionsContainer) return;
    
    optionsContainer.innerHTML = '';
    
    this.colorOptions.forEach((color, index) => {
      const colorOption = document.createElement('div');
      colorOption.className = 'color-option';
      colorOption.innerHTML = `
        <div class="color-circle option-circle" 
             style="background-color: ${color.hex};" 
             data-color-name="${color.name}">
        </div>
        <div class="option-label">${color.name}</div>
      `;
      
      // Add click handler
      colorOption.addEventListener('click', () => this.selectColor(color));
      
      // Add hover effects for better UX
      colorOption.addEventListener('mouseenter', () => {
        colorOption.style.transform = 'scale(1.1)';
        this.audioManager?.playSound('hover');
      });
      
      colorOption.addEventListener('mouseleave', () => {
        colorOption.style.transform = 'scale(1)';
      });
      
      optionsContainer.appendChild(colorOption);
    });
  }
  
  /**
   * Handle color selection
   */
  selectColor(selectedColor) {
    if (!this.isPlaying || this.isPaused) return;
    
    this.selectedColor = selectedColor;
    
    // Check if correct
    if (selectedColor.name === this.targetColor.name) {
      this.handleCorrectSelection();
    } else {
      this.handleIncorrectSelection();
    }
  }
  
  /**
   * Handle correct color selection
   */
  handleCorrectSelection() {
    const points = 10 + (this.level * 2); // More points for higher levels
    this.updateScore(points);
    
    // Visual feedback
    this.showColorFeedback('correct', '🎉 Perfect! Well done!');
    
    // Celebrate with animation
    this.celebrateCorrectAnswer();
    
    // Move to next round after delay
    setTimeout(() => {
      this.roundsCompleted++;
      this.nextRound();
    }, 2000);
  }
  
  /**
   * Handle incorrect color selection
   */
  handleIncorrectSelection() {
    this.updateScore(-2); // Small penalty
    
    // Visual feedback
    this.showColorFeedback('incorrect', `Try again! Look for ${this.targetColor.name}`);
    
    // Highlight the correct answer briefly
    this.highlightCorrectAnswer();
    
    // Don't advance round, let them try again
  }
  
  /**
   * Show feedback with color-specific styling
   */
  showColorFeedback(type, message) {
    const feedbackArea = document.getElementById('feedback-area');
    if (!feedbackArea) return;
    
    feedbackArea.innerHTML = `
      <div class="color-feedback ${type}">
        <div class="feedback-icon">${type === 'correct' ? '✅' : '❌'}</div>
        <div class="feedback-message">${message}</div>
      </div>
    `;
    
    // Auto-clear feedback
    setTimeout(() => {
      if (type === 'incorrect') {
        feedbackArea.innerHTML = '';
      }
    }, 3000);
  }
  
  /**
   * Celebrate correct answer with animations
   */
  celebrateCorrectAnswer() {
    // Add celebration class to target color
    const targetCircle = document.getElementById('target-circle');
    if (targetCircle) {
      targetCircle.classList.add('celebrate');
      setTimeout(() => targetCircle.classList.remove('celebrate'), 1500);
    }
    
    // Create floating celebration particles
    this.createCelebrationParticles();
  }
  
  /**
   * Highlight correct answer when wrong selection is made
   */
  highlightCorrectAnswer() {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
      const circle = option.querySelector('.color-circle');
      const colorName = circle.dataset.colorName;
      
      if (colorName === this.targetColor.name) {
        option.classList.add('highlight-correct');
        setTimeout(() => option.classList.remove('highlight-correct'), 2000);
      }
    });
  }
  
  /**
   * Create celebration particle effects
   */
  createCelebrationParticles() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = (i * 0.1) + 's';
      particle.textContent = ['🎉', '⭐', '🌟', '✨'][Math.floor(Math.random() * 4)];
      
      gameArea.appendChild(particle);
      
      setTimeout(() => particle.remove(), 2000);
    }
  }
  
  /**
   * Announce target color for audio learning
   */
  announceTargetColor() {
    // Update instruction text
    const instruction = document.getElementById('instruction');
    if (instruction) {
      instruction.textContent = `Find the ${this.targetColor.name} color!`;
    }
    
    // Play color name audio if available
    this.audioManager?.playSound(`color_${this.targetColor.name.toLowerCase()}`);
  }
  
  /**
   * Complete the game
   */
  completeGame() {
    this.end('completed');
    
    // Show completion panel
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('completion-panel').style.display = 'block';
    
    // Update final stats
    document.getElementById('final-correct').textContent = this.progress.correctAnswers;
    document.getElementById('final-score').textContent = this.score;
    
    // Show achievements
    this.displayAchievements();
    
    // Celebration sound
    this.audioManager?.playSound('gameComplete');
  }
  
  /**
   * Display earned achievements
   */
  displayAchievements() {
    const achievementBadges = document.getElementById('achievement-badges');
    if (!achievementBadges || this.achievements.length === 0) return;
    
    const achievementMessages = {
      'perfect-score': '🏆 Perfect Score!',
      'speed-demon': '⚡ Speed Master!',
      'first-try': '🌟 First Try Champion!',
      'color-expert': '🎨 Color Expert!'
    };
    
    achievementBadges.innerHTML = this.achievements.map(achievement => 
      `<div class="achievement-badge">${achievementMessages[achievement] || achievement}</div>`
    ).join('');
  }
  
  /**
   * Restart the game
   */
  restartGame() {
    // Reset game state
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.mistakes = 0;
    this.achievements = [];
    this.roundsCompleted = 0;
    this.currentRound = 1;
    
    // Reset progress
    this.progress = {
      totalAttempts: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeSpent: 0,
      bestScore: 0,
      completionRate: 0
    };
    
    // Hide completion panel, show start panel
    document.getElementById('completion-panel').style.display = 'none';
    document.getElementById('start-panel').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
    
    // Update UI
    this.updateUI();
    
    // Reset instruction
    const instruction = document.getElementById('instruction');
    if (instruction) {
      instruction.textContent = 'Welcome to Color Matching!';
    }
  }
  
  /**
   * Shuffle array utility
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  /**
   * Override parent methods
   */
  onGameStart() {
    console.log('Color Matching Game started!');
  }
  
  onGamePause() {
    // Pause any animations or timers
    console.log('Color Matching Game paused');
  }
  
  onGameResume() {
    // Resume animations or timers
    console.log('Color Matching Game resumed');
  }
  
  onGameEnd(reason) {
    console.log(`Color Matching Game ended: ${reason}`);
  }
  
  onScoreUpdate(oldScore, newScore) {
    // Level up logic based on score
    const newLevel = Math.floor(newScore / 50) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.audioManager?.playSound('levelUp');
      this.showFeedback('level-up', `Level ${this.level}! 🎊`);
    }
  }
  
  getHelpContent() {
    return `
      <h3>How to Play Color Matching:</h3>
      <ol>
        <li>Look at the target color at the top</li>
        <li>Listen to the color name</li>
        <li>Click on the matching color below</li>
        <li>Try to match all ${this.totalRounds} colors!</li>
      </ol>
      <p>Don't worry about mistakes - keep trying until you find the right color!</p>
    `;
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#color-matching' || 
      window.location.pathname.includes('color-matching')) {
    window.currentGame = new ColorMatchingGame();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ColorMatchingGame;
} else {
  window.ColorMatchingGame = ColorMatchingGame;
}
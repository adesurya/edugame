/**
 * NumberLearning - Educational number learning game for ages 3-5
 */
class NumberLearningGame extends BaseGame {
  constructor() {
    super({
      id: 'number-learning',
      title: 'Number Fun Adventure!',
      category: 'numbers',
      ageGroup: '3-5',
      difficulty: 1,
      maxScore: 150,
      timeLimit: null
    });
    
    this.numbers = [
      { value: 1, name: 'One', objects: ['🍎'] },
      { value: 2, name: 'Two', objects: ['🍎', '🍎'] },
      { value: 3, name: 'Three', objects: ['🍎', '🍎', '🍎'] },
      { value: 4, name: 'Four', objects: ['🍎', '🍎', '🍎', '🍎'] },
      { value: 5, name: 'Five', objects: ['🍎', '🍎', '🍎', '🍎', '🍎'] },
      { value: 6, name: 'Six', objects: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎'] },
      { value: 7, name: 'Seven', objects: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'] },
      { value: 8, name: 'Eight', objects: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'] },
      { value: 9, name: 'Nine', objects: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'] },
      { value: 10, name: 'Ten', objects: new Array(10).fill('🍎') }
    ];
    
    this.gameTypes = ['counting', 'recognition', 'matching'];
    this.currentGameType = 'counting';
    this.currentNumber = null;
    this.targetCount = 0;
    this.userCount = 0;
    this.currentRound = 1;
    this.totalRounds = 12;
    this.roundsCompleted = 0;
    this.maxNumber = 5;
    
    this.objectTypes = ['🍎', '⭐', '🎈', '🐶', '🚗', '🌺', '🍪', '⚽', '🧸', '🎨'];
    this.currentObjects = [];
  }
  
  init() {
    super.init();
    this.setupNumberGameUI();
    console.log('Number Learning Game ready!');
  }
  
  setupNumberGameUI() {
    const gameContent = this.uiElements.gameContent;
    gameContent.innerHTML = `
      <div class="number-game-container">
        <div class="instruction-panel">
          <h2 class="instruction-text" id="instruction">Welcome to Number Fun!</h2>
          <div class="start-panel" id="start-panel">
            <div class="game-mode-selection">
              <h3>Choose Your Adventure:</h3>
              <div class="mode-buttons">
                <button class="btn-mode" data-mode="counting">
                  <div class="mode-icon">🔢</div>
                  <div class="mode-title">Counting Fun</div>
                  <div class="mode-desc">Count the objects!</div>
                </button>
                <button class="btn-mode" data-mode="recognition">
                  <div class="mode-icon">👁️</div>
                  <div class="mode-title">Number Detective</div>
                  <div class="mode-desc">Find the right number!</div>
                </button>
                <button class="btn-mode" data-mode="matching">
                  <div class="mode-icon">🎯</div>
                  <div class="mode-title">Match Master</div>
                  <div class="mode-desc">Match numbers with counts!</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="game-area" id="game-area" style="display: none;">
          <div class="counting-game" id="counting-game" style="display: none;">
            <div class="counting-instruction">
              <h3 id="counting-question">Count the objects below:</h3>
            </div>
            <div class="objects-container" id="objects-container">
            </div>
            <div class="counting-input">
              <h4>How many do you see?</h4>
              <div class="number-buttons" id="number-buttons">
              </div>
            </div>
          </div>
          
          <div class="recognition-game" id="recognition-game" style="display: none;">
            <div class="recognition-instruction">
              <h3 id="recognition-question">Find the number:</h3>
            </div>
            <div class="target-number-display">
              <div class="big-number" id="target-number">5</div>
              <div class="number-word" id="target-number-word">Five</div>
            </div>
            <div class="number-options" id="number-options">
            </div>
          </div>
          
          <div class="matching-game" id="matching-game" style="display: none;">
            <div class="matching-instruction">
              <h3>Match the number with the correct count!</h3>
            </div>
            <div class="matching-pairs" id="matching-pairs">
            </div>
          </div>
          
          <div class="feedback-area" id="feedback-area">
          </div>
          
          <div class="round-info">
            Round: <span id="current-round">1</span> / <span id="total-rounds">12</span>
            <span class="difficulty-level">Level: <span id="difficulty-level">1</span></span>
          </div>
        </div>
        
        <div class="completion-panel" id="completion-panel" style="display: none;">
          <div class="completion-content">
            <h2>🎊 Amazing Work!</h2>
            <div class="final-stats">
              <p>You learned <span id="numbers-mastered">0</span> numbers!</p>
              <p>Correct answers: <span id="final-correct">0</span></p>
              <p>Final Score: <span id="final-score">0</span></p>
            </div>
            <div class="achievement-badges" id="achievement-badges"></div>
            <button class="btn-restart" id="restart-btn">Play Again</button>
            <button class="btn-menu" id="menu-btn">Back to Games</button>
          </div>
        </div>
      </div>
    `;
    
    this.bindNumberGameEvents();
  }
  
  bindNumberGameEvents() {
    const modeButtons = document.querySelectorAll('.btn-mode');
    modeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.selectGameMode(mode);
      });
    });
    
    const restartBtn = document.getElementById('restart-btn');
    const menuBtn = document.getElementById('menu-btn');
    
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restartGame());
    }
    
    if (menuBtn) {
      menuBtn.addEventListener('click', () => this.exitGame());
    }
  }
  
  selectGameMode(mode) {
    this.currentGameType = mode;
    this.startGame();
  }
  
  startGame() {
    this.start();
    
    document.getElementById('start-panel').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    
    this.adjustInitialDifficulty();
    this.nextRound();
  }
  
  adjustInitialDifficulty() {
    this.maxNumber = Math.min(5 + Math.floor(this.level / 2), 10);
    document.getElementById('difficulty-level').textContent = this.level;
  }
  
  nextRound() {
    if (this.roundsCompleted >= this.totalRounds) {
      this.completeGame();
      return;
    }
    
    this.currentRound = this.roundsCompleted + 1;
    this.generateRound();
    this.updateRoundUI();
    this.announceRoundStart();
  }
  
  generateRound() {
    document.getElementById('counting-game').style.display = 'none';
    document.getElementById('recognition-game').style.display = 'none';
    document.getElementById('matching-game').style.display = 'none';
    
    document.getElementById('feedback-area').innerHTML = '';
    
    switch (this.currentGameType) {
      case 'counting':
        this.generateCountingRound();
        break;
      case 'recognition':
        this.generateRecognitionRound();
        break;
      case 'matching':
        this.generateMatchingRound();
        break;
    }
  }
  
  generateCountingRound() {
    document.getElementById('counting-game').style.display = 'block';
    
    this.targetCount = Math.floor(Math.random() * this.maxNumber) + 1;
    this.currentNumber = this.numbers.find(n => n.value === this.targetCount);
    
    const objectType = this.objectTypes[Math.floor(Math.random() * this.objectTypes.length)];
    this.currentObjects = new Array(this.targetCount).fill(objectType);
    
    document.getElementById('counting-question').textContent = 
      `Count the ${this.getObjectName(objectType)} below:`;
    
    this.generateObjectsDisplay();
    this.generateNumberButtons();
  }
  
  generateRecognitionRound() {
    document.getElementById('recognition-game').style.display = 'block';
    
    this.targetCount = Math.floor(Math.random() * this.maxNumber) + 1;
    this.currentNumber = this.numbers.find(n => n.value === this.targetCount);
    
    document.getElementById('target-number').textContent = this.targetCount;
    document.getElementById('target-number-word').textContent = this.currentNumber.name;
    
    this.generateNumberOptions();
  }
  
  generateMatchingRound() {
    document.getElementById('matching-game').style.display = 'block';
    this.generateMatchingPairs();
  }
  
  generateObjectsDisplay() {
    const container = document.getElementById('objects-container');
    container.innerHTML = '';
    
    const gridSize = Math.ceil(Math.sqrt(this.targetCount));
    container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    container.className = 'objects-grid';
    
    this.currentObjects.forEach((obj, index) => {
      const objectEl = document.createElement('div');
      objectEl.className = 'counting-object';
      objectEl.textContent = obj;
      objectEl.style.animationDelay = `${index * 0.1}s`;
      
      objectEl.addEventListener('click', () => {
        objectEl.style.transform = 'scale(1.2)';
        setTimeout(() => {
          objectEl.style.transform = 'scale(1)';
        }, 200);
        if (window.audioManager) {
          window.audioManager.playSound('click');
        }
      });
      
      container.appendChild(objectEl);
    });
  }
  
  generateNumberButtons() {
    const container = document.getElementById('number-buttons');
    container.innerHTML = '';
    
    const maxOption = Math.min(this.maxNumber + 2, 10);
    const numbers = [];
    
    for (let i = 1; i <= maxOption; i++) {
      numbers.push(i);
    }
    
    this.shuffleArray(numbers);
    
    numbers.slice(0, 4).forEach(num => {
      const button = document.createElement('button');
      button.className = 'number-btn';
      button.textContent = num;
      button.dataset.number = num;
      
      button.addEventListener('click', () => {
        this.selectCountingAnswer(parseInt(num));
      });
      
      container.appendChild(button);
    });
  }
  
  generateNumberOptions() {
    const container = document.getElementById('number-options');
    container.innerHTML = '';
    
    const options = [this.targetCount];
    
    while (options.length < 4) {
      const randomNum = Math.floor(Math.random() * this.maxNumber) + 1;
      if (!options.includes(randomNum)) {
        options.push(randomNum);
      }
    }
    
    this.shuffleArray(options);
    
    options.forEach(num => {
      const option = document.createElement('div');
      option.className = 'number-option';
      option.innerHTML = `
        <div class="option-number">${num}</div>
        <div class="option-word">${this.numbers.find(n => n.value === num)?.name || ''}</div>
      `;
      
      option.addEventListener('click', () => {
        this.selectRecognitionAnswer(num);
      });
      
      container.appendChild(option);
    });
  }
  
  generateMatchingPairs() {
    const container = document.getElementById('matching-pairs');
    container.innerHTML = '';
    
    const pairCount = 3;
    const usedNumbers = [];
    
    for (let i = 0; i < pairCount; i++) {
      let num;
      do {
        num = Math.floor(Math.random() * this.maxNumber) + 1;
      } while (usedNumbers.includes(num));
      
      usedNumbers.push(num);
      
      const objectType = this.objectTypes[i % this.objectTypes.length];
      
      const pair = document.createElement('div');
      pair.className = 'matching-pair';
      pair.innerHTML = `
        <div class="number-card" data-number="${num}">
          <div class="card-number">${num}</div>
          <div class="card-word">${this.numbers.find(n => n.value === num).name}</div>
        </div>
        <div class="count-card" data-count="${num}">
          <div class="count-objects">
            ${new Array(num).fill(objectType).map(obj => `<span class="match-object">${obj}</span>`).join('')}
          </div>
        </div>
      `;
      
      container.appendChild(pair);
    }
    
    this.setupMatching();
  }
  
  selectCountingAnswer(selectedNumber) {
    if (!this.isPlaying || this.isPaused) return;
    
    if (selectedNumber === this.targetCount) {
      this.handleCorrectAnswer(`Perfect! There are ${this.targetCount} objects!`);
    } else {
      this.handleIncorrectAnswer(`Not quite! Count again. There are ${this.targetCount} objects.`);
    }
  }
  
  selectRecognitionAnswer(selectedNumber) {
    if (!this.isPlaying || this.isPaused) return;
    
    if (selectedNumber === this.targetCount) {
      this.handleCorrectAnswer(`Excellent! You found the number ${this.targetCount}!`);
    } else {
      this.handleIncorrectAnswer(`Try again! Look for the number ${this.targetCount}.`);
    }
  }
  
  setupMatching() {
    setTimeout(() => {
      this.handleCorrectAnswer('Great job matching numbers with counts!');
    }, 2000);
  }
  
  handleCorrectAnswer(message) {
    const points = 10 + (this.level * 5);
    this.updateScore(points);
    
    this.showNumberFeedback('correct', message);
    this.celebrateCorrectAnswer();
    
    setTimeout(() => {
      this.roundsCompleted++;
      this.nextRound();
    }, 2500);
  }
  
  handleIncorrectAnswer(message) {
    this.updateScore(-3);
    
    this.showNumberFeedback('incorrect', message);
    this.highlightCorrectAnswer();
  }
  
  showNumberFeedback(type, message) {
    const feedbackArea = document.getElementById('feedback-area');
    if (!feedbackArea) return;
    
    feedbackArea.innerHTML = `
      <div class="number-feedback ${type}">
        <div class="feedback-icon">${type === 'correct' ? '🎉' : '💭'}</div>
        <div class="feedback-message">${message}</div>
      </div>
    `;
    
    setTimeout(() => {
      if (type === 'incorrect') {
        feedbackArea.innerHTML = '';
      }
    }, 3000);
  }
  
  celebrateCorrectAnswer() {
    this.createNumberCelebration();
  }
  
  highlightCorrectAnswer() {
    switch (this.currentGameType) {
      case 'counting':
        const correctBtn = document.querySelector(`[data-number="${this.targetCount}"]`);
        if (correctBtn) {
          correctBtn.classList.add('highlight-correct');
          setTimeout(() => correctBtn.classList.remove('highlight-correct'), 2000);
        }
        break;
      case 'recognition':
        const correctOption = document.querySelector(`.number-option [data-number="${this.targetCount}"]`);
        if (correctOption) {
          correctOption.closest('.number-option').classList.add('highlight-correct');
          setTimeout(() => correctOption.closest('.number-option').classList.remove('highlight-correct'), 2000);
        }
        break;
    }
  }
  
  createNumberCelebration() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'number-celebration-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = (i * 0.1) + 's';
      particle.textContent = ['🌟', '✨', '🎊', '🎉', '⭐', '💫'][i];
      
      gameArea.appendChild(particle);
      
      setTimeout(() => particle.remove(), 2000);
    }
  }
  
  updateRoundUI() {
    document.getElementById('current-round').textContent = this.currentRound;
    document.getElementById('total-rounds').textContent = this.totalRounds;
  }
  
  announceRoundStart() {
    const instruction = document.getElementById('instruction');
    if (instruction) {
      const gameTypeNames = {
        counting: 'Counting Adventure',
        recognition: 'Number Detective',
        matching: 'Match Master'
      };
      instruction.textContent = `${gameTypeNames[this.currentGameType]} - Round ${this.currentRound}`;
    }
    
    if (window.audioManager) {
      window.audioManager.playSound('levelUp');
    }
  }
  
  completeGame() {
    this.end('completed');
    
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('completion-panel').style.display = 'block';
    
    const numbersMastered = Math.min(this.maxNumber, this.progress.correctAnswers);
    document.getElementById('numbers-mastered').textContent = numbersMastered;
    document.getElementById('final-correct').textContent = this.progress.correctAnswers;
    document.getElementById('final-score').textContent = this.score;
    
    this.displayAchievements();
    
    if (window.audioManager) {
      window.audioManager.playSound('gameComplete');
    }
  }
  
  restartGame() {
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.mistakes = 0;
    this.achievements = [];
    this.roundsCompleted = 0;
    this.currentRound = 1;
    this.currentGameType = 'counting';
    
    this.progress = {
      totalAttempts: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeSpent: 0,
      bestScore: 0,
      completionRate: 0
    };
    
    document.getElementById('completion-panel').style.display = 'none';
    document.getElementById('start-panel').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
    
    this.updateUI();
    
    const instruction = document.getElementById('instruction');
    if (instruction) {
      instruction.textContent = 'Welcome to Number Fun!';
    }
  }
  
  getObjectName(objectType) {
    const names = {
      '🍎': 'apples',
      '⭐': 'stars',
      '🎈': 'balloons',
      '🐶': 'puppies',
      '🚗': 'cars',
      '🌺': 'flowers',
      '🍪': 'cookies',
      '⚽': 'balls',
      '🧸': 'bears',
      '🎨': 'brushes'
    };
    return names[objectType] || 'objects';
  }
  
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  onGameStart() {
    console.log('Number Learning Game started!');
  }
  
  onGamePause() {
    console.log('Number Learning Game paused');
  }
  
  onGameResume() {
    console.log('Number Learning Game resumed');
  }
  
  onGameEnd(reason) {
    console.log(`Number Learning Game ended: ${reason}`);
  }
  
  onScoreUpdate(oldScore, newScore) {
    const newLevel = Math.floor(newScore / 75) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.maxNumber = Math.min(5 + Math.floor(newLevel / 2), 10);
      if (window.audioManager) {
        window.audioManager.playSound('levelUp');
      }
      this.showFeedback('level-up', `Level ${this.level}! Harder numbers unlocked!`);
    }
  }
  
  getHelpContent() {
    return `
      <h3>How to Play Number Fun:</h3>
      <ul>
        <li><strong>Counting:</strong> Count the objects and click the right number</li>
        <li><strong>Recognition:</strong> Find the number that matches what you hear</li>
        <li><strong>Matching:</strong> Connect numbers with the right amount of objects</li>
      </ul>
      <p>Take your time and have fun learning numbers!</p>
    `;
  }
}

window.NumberLearningGame = NumberLearningGame;
{ letter: 'H', name: 'H', sound: '/h/', words: ['House', 'Hat', 'Horse'], emoji: '🏠' },
      { letter: 'I', name: 'I', sound: '/ɪ/', words: ['Ice', 'Igloo', 'Island'], emoji: '🧊' },
      { letter: 'J', name: 'J', sound: '/dʒ/', words: ['Juice', 'Jump', 'Jellyfish'], emoji: '🧃' },
      { letter: 'K', name: 'K', sound: '/k/', words: ['Kite', 'Key', 'Kangaroo'], emoji: '🪁' },
      { letter: 'L', name: 'L', sound: '/l/', words: ['Lion', 'Lamp', 'Leaf'], emoji: '🦁' },
      { letter: 'M', name: 'M', sound: '/m/', words: ['Mouse', 'Moon', 'Music'], emoji: '🐭' },
      { letter: 'N', name: 'N', sound: '/n/', words: ['Nest', 'Night', 'Nose'], emoji: '🌙' },
      { letter: 'O', name: 'O', sound: '/ɒ/', words: ['Orange', 'Ocean', 'Owl'], emoji: '🍊' },
      { letter: 'P', name: 'P', sound: '/p/', words: ['Penguin', 'Pizza', 'Piano'], emoji: '🐧' },
      { letter: 'Q', name: 'Q', sound: '/kw/', words: ['Queen', 'Quiet', 'Quilt'], emoji: '👸' },
      { letter: 'R', name: 'R', sound: '/r/', words: ['Rainbow', 'Robot', 'Rose'], emoji: '🌈' },
      { letter: 'S', name: 'S', sound: '/s/', words: ['Sun', 'Snake', 'Star'], emoji: '☀️' },
      { letter: 'T', name: 'T', sound: '/t/', words: ['Tiger', 'Tree', 'Toy'], emoji: '🐯' },
      { letter: 'U', name: 'U', sound: '/ʌ/', words: ['Umbrella', 'Up', 'Uncle'], emoji: '☂️' },
      { letter: 'V', name: 'V', sound: '/v/', words: ['Violin', 'Volcano', 'Van'], emoji: '🎻' },
      { letter: 'W', name: 'W', sound: '/w/', words: ['Whale', 'Water', 'Wind'], emoji: '🐋' },
      { letter: 'X', name: 'X', sound: '/ks/', words: ['Xylophone', 'X-ray', 'Fox'], emoji: '🎵' },
      { letter: 'Y', name: 'Y', sound: '/j/', words: ['Yellow', 'Yacht', 'Yawn'], emoji: '💛' },
      { letter: 'Z', name: 'Z', sound: '/z/', words: ['Zebra', 'Zoo', 'Zipper'], emoji: '🦓' }
    ];
    
    this.gameTypes = ['recognition', 'phonics', 'matching', 'tracing'];
    this.currentGameType = 'recognition';
    this.currentLetter = null;
    this.currentRound = 1;
    this.totalRounds = 15;
    this.roundsCompleted = 0;
    this.letterRange = { start: 0, end: 5 }; // Start with A-F, expand based on progress
    this.showUppercase = true;
    this.showLowercase = false;
    
    // Progress tracking for each letter
    this.letterProgress = {};
    this.alphabet.forEach(letter => {
      this.letterProgress[letter.letter] = {
        attempts: 0,
        correct: 0,
        mastered: false
      };
    });
  }
  
  /**
   * Initialize letter learning game
   */
  init() {
    super.init();
    this.setupLetterGameUI();
    console.log('Letter Learning Game ready!');
  }
  
  /**
   * Setup game-specific UI
   */
  setupLetterGameUI() {
    const gameContent = this.uiElements.gameContent;
    gameContent.innerHTML = `
      <div class="letter-game-container">
        <div class="instruction-panel">
          <h2 class="instruction-text" id="instruction">Welcome to Alphabet Adventure!</h2>
          <div class="start-panel" id="start-panel">
            <div class="game-mode-selection">
              <h3>Choose Your Learning Adventure:</h3>
              <div class="mode-buttons">
                <button class="btn-mode" data-mode="recognition">
                  <div class="mode-icon">👁️</div>
                  <div class="mode-title">Letter Detective</div>
                  <div class="mode-desc">Find and identify letters!</div>
                </button>
                <button class="btn-mode" data-mode="phonics">
                  <div class="mode-icon">🔊</div>
                  <div class="mode-title">Sound Safari</div>
                  <div class="mode-desc">Match letters with sounds!</div>
                </button>
                <button class="btn-mode" data-mode="matching">
                  <div class="mode-icon">🎯</div>
                  <div class="mode-title">Letter Pairs</div>
                  <div class="mode-desc">Match uppercase & lowercase!</div>
                </button>
                <button class="btn-mode" data-mode="tracing">
                  <div class="mode-icon">✏️</div>
                  <div class="mode-title">Letter Tracer</div>
                  <div class="mode-desc">Practice writing letters!</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="game-area" id="game-area" style="display: none;">
          <!-- Letter Recognition Game -->
          <div class="recognition-game" id="recognition-game" style="display: none;">
            <div class="recognition-instruction">
              <h3 id="recognition-question">Find the letter:</h3>
            </div>
            <div class="target-letter-display">
              <div class="big-letter" id="target-letter">A</div>
              <div class="letter-name" id="target-letter-name">A</div>
              <div class="letter-example" id="target-letter-example">🍎 Apple</div>
            </div>
            <div class="letter-options" id="letter-options">
              <!-- Letter options will be generated here -->
            </div>
          </div>
          
          <!-- Phonics Game -->
          <div class="phonics-game" id="phonics-game" style="display: none;">
            <div class="phonics-instruction">
              <h3>Which letter makes this sound?</h3>
            </div>
            <div class="sound-display">
              <button class="play-sound-btn" id="play-sound-btn">
                <div class="sound-icon">🔊</div>
                <div class="sound-text" id="sound-text">/æ/</div>
                <div class="play-again">Click to hear again</div>
              </button>
            </div>
            <div class="phonics-options" id="phonics-options">
              <!-- Phonics options will be generated here -->
            </div>
          </div>
          
          <!-- Matching Game -->
          <div class="matching-game" id="matching-game" style="display: none;">
            <div class="matching-instruction">
              <h3>Match uppercase letters with lowercase letters!</h3>
            </div>
            <div class="matching-area" id="matching-area">
              <div class="uppercase-letters" id="uppercase-letters">
                <!-- Uppercase letters will be generated here -->
              </div>
              <div class="matching-line" id="matching-line"></div>
              <div class="lowercase-letters" id="lowercase-letters">
                <!-- Lowercase letters will be generated here -->
              </div>
            </div>
          </div>
          
          <!-- Tracing Game -->
          <div class="tracing-game" id="tracing-game" style="display: none;">
            <div class="tracing-instruction">
              <h3>Trace the letter with your finger or mouse!</h3>
            </div>
            <div class="tracing-area">
              <div class="letter-to-trace" id="letter-to-trace">A</div>
              <canvas id="tracing-canvas" width="300" height="300"></canvas>
              <div class="tracing-controls">
                <button class="btn-clear-trace" id="clear-trace-btn">Clear</button>
                <button class="btn-show-guide" id="show-guide-btn">Show Guide</button>
              </div>
            </div>
          </div>
          
          <div class="feedback-area" id="feedback-area">
            <!-- Success/error messages appear here -->
          </div>
          
          <div class="round-info">
            Round: <span id="current-round">1</span> / <span id="total-rounds">15</span>
            <span class="letter-range">Letters: <span id="letter-range-display">A-F</span></span>
          </div>
        </div>
        
        <div class="completion-panel" id="completion-panel" style="display: none;">
          <div class="completion-content">
            <h2>🎓 Alphabet Master!</h2>
            <div class="final-stats">
              <p>Letters learned: <span id="letters-learned">0</span></p>
              <p>Correct answers: <span id="final-correct">0</span></p>
              <p>Final Score: <span id="final-score">0</span></p>
            </div>
            <div class="achievement-badges" id="achievement-badges"></div>
            <div class="alphabet-progress" id="alphabet-progress">
              <!-- Progress for each letter -->
            </div>
            <button class="btn-restart" id="restart-btn">Play Again</button>
            <button class="btn-menu" id="menu-btn">Back to Games</button>
          </div>
        </div>
      </div>
    `;
    
    // Bind game-specific events
    this.bindLetterGameEvents();
  }
  
  /**
   * Bind letter game specific events
   */
  bindLetterGameEvents() {
    // Mode selection buttons
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
  
  /**
   * Select game mode and start
   */
  selectGameMode(mode) {
    this.currentGameType = mode;
    this.startGame();
  }
  
  /**
   * Start the letter learning game
   */
  startGame() {
    this.start(); // Call parent start method
    
    // Hide start panel, show game area
    document.getElementById('start-panel').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    
    // Adjust difficulty based on user progress
    this.adjustInitialDifficulty();
    
    this.nextRound();
  }
  
  /**
   * Adjust initial difficulty based on previous performance
   */
  adjustInitialDifficulty() {
    // Start with A-F for beginners, expand based on level
    const lettersPerLevel = 4;
    const maxLetters = Math.min(6 + (this.level - 1) * lettersPerLevel, 26);
    this.letterRange.end = maxLetters - 1;
    
    // Show lowercase letters at higher levels
    if (this.level >= 3) {
      this.showLowercase = true;
    }
    
    this.updateLetterRangeDisplay();
  }
  
  /**
   * Update letter range display
   */
  updateLetterRangeDisplay() {
    const startLetter = this.alphabet[this.letterRange.start].letter;
    const endLetter = this.alphabet[this.letterRange.end].letter;
    document.getElementById('letter-range-display').textContent = `${startLetter}-${endLetter}`;
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
    
    // Announce the game type
    this.announceRoundStart();
  }
  
  /**
   * Generate a new round based on current game type
   */
  generateRound() {
    // Hide all game type containers
    document.getElementById('recognition-game').style.display = 'none';
    document.getElementById('phonics-game').style.display = 'none';
    document.getElementById('matching-game').style.display = 'none';
    document.getElementById('tracing-game').style.display = 'none';
    
    // Clear feedback
    document.getElementById('feedback-area').innerHTML = '';
    
    switch (this.currentGameType) {
      case 'recognition':
        this.generateRecognitionRound();
        break;
      case 'phonics':
        this.generatePhonicsRound();
        break;
      case 'matching':
        this.generateMatchingRound();
        break;
      case 'tracing':
        this.generateTracingRound();
        break;
    }
  }
  
  /**
   * Generate recognition game round
   */
  generateRecognitionRound() {
    document.getElementById('recognition-game').style.display = 'block';
    
    // Select random letter within range
    const letterIndex = Math.floor(Math.random() * (this.letterRange.end - this.letterRange.start + 1)) + this.letterRange.start;
    this.currentLetter = this.alphabet[letterIndex];
    
    // Display target letter
    document.getElementById('target-letter').textContent = this.currentLetter.letter;
    document.getElementById('target-letter-name').textContent = `Letter ${this.currentLetter.name}`;
    
    // Show example word with emoji
    const exampleWord = this.currentLetter.words[0];
    document.getElementById('target-letter-example').textContent = `${this.currentLetter.emoji} ${exampleWord}`;
    
    // Generate letter options
    this.generateLetterOptions();
  }
  
  /**
   * Generate phonics game round
   */
  generatePhonicsRound() {
    document.getElementById('phonics-game').style.display = 'block';
    
    // Select random letter within range
    const letterIndex = Math.floor(Math.random() * (this.letterRange.end - this.letterRange.start + 1)) + this.letterRange.start;
    this.currentLetter = this.alphabet[letterIndex];
    
    // Display sound
    document.getElementById('sound-text').textContent = this.currentLetter.sound;
    
    // Setup sound play button
    this.setupSoundButton();
    
    // Generate phonics options
    this.generatePhonicsOptions();
  }
  
  /**
   * Generate matching game round
   */
  generateMatchingRound() {
    document.getElementById('matching-game').style.display = 'block';
    
    // Generate 4 letter pairs for matching
    this.generateLetterPairs();
  }
  
  /**
   * Generate tracing game round
   */
  generateTracingRound() {
    document.getElementById('tracing-game').style.display = 'block';
    
    // Select random letter within range
    const letterIndex = Math.floor(Math.random() * (this.letterRange.end - this.letterRange.start + 1)) + this.letterRange.start;
    this.currentLetter = this.alphabet[letterIndex];
    
    // Display letter to trace
    document.getElementById('letter-to-trace').textContent = this.currentLetter.letter;
    
    // Setup tracing canvas
    this.setupTracingCanvas();
  }
  
  /**
   * Generate letter options for recognition game
   */
  generateLetterOptions() {
    const container = document.getElementById('letter-options');
    container.innerHTML = '';
    
    // Include target letter and 3 distractors
    const options = [this.currentLetter];
    
    while (options.length < 4) {
      const randomIndex = Math.floor(Math.random() * (this.letterRange.end - this.letterRange.start + 1)) + this.letterRange.start;
      const randomLetter = this.alphabet[randomIndex];
      
      if (!options.find(opt => opt.letter === randomLetter.letter)) {
        options.push(randomLetter);
      }
    }
    
    this.shuffleArray(options);
    
    options.forEach(letter => {
      const option = document.createElement('div');
      option.className = 'letter-option';
      option.innerHTML = `
        <div class="option-letter">${letter.letter}</div>
        <div class="option-example">${letter.emoji}</div>
      `;
      
      option.addEventListener('click', () => {
        this.selectRecognitionAnswer(letter);
      });
      
      container.appendChild(option);
    });
  }
  
  /**
   * Generate phonics options
   */
  generatePhonicsOptions() {
    const container = document.getElementById('phonics-options');
    container.innerHTML = '';
    
    // Include target letter and 3 distractors
    const options = [this.currentLetter];
    
    while (options.length < 4) {
      const randomIndex = Math.floor(Math.random() * (this.letterRange.end - this.letterRange.start + 1)) + this.letterRange.start;
      const randomLetter = this.alphabet[randomIndex];
      
      if (!options.find(opt => opt.letter === randomLetter.letter)) {
        options.push(randomLetter);
      }
    }
    
    this.shuffleArray(options);
    
    options.forEach(letter => {
      const option = document.createElement('div');
      option.className = 'phonics-option';
      option.innerHTML = `
        <div class="phonics-letter">${letter.letter}</div>
        <div class="phonics-word">${letter.words[0]}</div>
      `;
      
      option.addEventListener('click', () => {
        this.selectPhonicsAnswer(letter);
      });
      
      container.appendChild(option);
    });
  }
  
  /**
   * Generate letter pairs for matching
   */
  generateLetterPairs() {
    const uppercaseContainer = document.getElementById('uppercase-letters');
    const lowercaseContainer = document.getElementById('lowercase-letters');
    
    uppercaseContainer.innerHTML = '';
    lowercaseContainer.innerHTML = '';
    
    // Select 4 letters for matching
    const selectedLetters = [];
    for (let i = 0; i < 4; i++) {
      const letterIndex = Math.floor(Math.random() * (this.letterRange.end - this.letterRange.start + 1)) + this.letterRange.start;
      const letter = this.alphabet[letterIndex];
      
      if (!selectedLetters.find(l => l.letter === letter.letter)) {
        selectedLetters.push(letter);
      } else {
        i--; // Try again
      }
    }
    
    // Create uppercase letters
    selectedLetters.forEach((letter, index) => {
      const upperEl = document.createElement('div');
      upperEl.className = 'matching-letter uppercase';
      upperEl.textContent = letter.letter;
      upperEl.dataset.letter = letter.letter;
      upperEl.dataset.index = index;
      uppercaseContainer.appendChild(upperEl);
    });
    
    // Create lowercase letters (shuffled)
    const shuffledLetters = [...selectedLetters];
    this.shuffleArray(shuffledLetters);
    
    shuffledLetters.forEach((letter, index) => {
      const lowerEl = document.createElement('div');
      lowerEl.className = 'matching-letter lowercase';
      lowerEl.textContent = letter.letter.toLowerCase();
      lowerEl.dataset.letter = letter.letter;
      lowerEl.dataset.index = index;
      lowercaseContainer.appendChild(lowerEl);
    });
    
    // Setup matching interaction
    this.setupMatching();
  }
  
  /**
   * Setup sound button for phonics
   */
  setupSoundButton() {
    const soundBtn = document.getElementById('play-sound-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        // Play letter sound
        this.playLetterSound(this.currentLetter.letter);
        soundBtn.classList.add('playing');
        setTimeout(() => soundBtn.classList.remove('playing'), 1000);
      });
      
      // Auto-play sound when round starts
      setTimeout(() => soundBtn.click(), 500);
    }
  }
  
  /**
   * Setup tracing canvas
   */
  setupTracingCanvas() {
    const canvas = document.getElementById('tracing-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let hasDrawn = false;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw letter guide (faded)
    this.drawLetterGuide(ctx, this.currentLetter.letter);
    
    // Drawing functions
    const startDrawing = (e) => {
      isDrawing = true;
      hasDrawn = true;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    
    const draw = (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    
    const stopDrawing = () => {
      if (isDrawing && hasDrawn) {
        isDrawing = false;
        // Check if tracing is complete (simplified check)
        setTimeout(() => {
          this.checkTracingComplete();
        }, 500);
      }
    };
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Clear button
    const clearBtn = document.getElementById('clear-trace-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawLetterGuide(ctx, this.currentLetter.letter);
        hasDrawn = false;
      });
    }
    
    // Show guide button
    const guideBtn = document.getElementById('show-guide-btn');
    if (guideBtn) {
      guideBtn.addEventListener('click', () => {
        this.drawLetterGuide(ctx, this.currentLetter.letter, true);
      });
    }
  }
  
  /**
   * Draw letter guide on canvas
   */
  drawLetterGuide(ctx, letter, highlighted = false) {
    ctx.save();
    ctx.font = 'bold 200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (highlighted) {
      ctx.strokeStyle = '#FF9800';
      ctx.lineWidth = 4;
      ctx.strokeText(letter, 150, 150);
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillText(letter, 150, 150);
    }
    
    ctx.restore();
  }
  
  /**
   * Check if tracing is complete
   */
  checkTracingComplete() {
    // Simplified check - in a real implementation, you'd analyze the drawn path
    this.handleCorrectAnswer(`Great tracing of letter ${this.currentLetter.letter}!`);
  }
  
  /**
   * Play letter sound
   */
  playLetterSound(letter) {
    // In a real implementation, you'd play actual audio files
    this.audioManager?.playSound('correct');
    console.log(`Playing sound for letter ${letter}`);
  }
  
  /**
   * Setup matching interaction
   */
  setupMatching() {
    let selectedUpper = null;
    let selectedLower = null;
    let matchesFound = 0;
    
    const uppercaseLetters = document.querySelectorAll('.uppercase');
    const lowercaseLetters = document.querySelectorAll('.lowercase');
    
    uppercaseLetters.forEach(letter => {
      letter.addEventListener('click', () => {
        // Clear previous selection
        uppercaseLetters.forEach(l => l.classList.remove('selected'));
        letter.classList.add('selected');
        selectedUpper = letter;
        
        this.checkMatch();
      });
    });
    
    lowercaseLetters.forEach(letter => {
      letter.addEventListener('click', () => {
        // Clear previous selection
        lowercaseLetters.forEach(l => l.classList.remove('selected'));
        letter.classList.add('selected');
        selectedLower = letter;
        
        this.checkMatch();
      });
    });
    
    const checkMatch = () => {
      if (selectedUpper && selectedLower) {
        if (selectedUpper.dataset.letter === selectedLower.dataset.letter) {
          // Correct match
          selectedUpper.classList.add('matched');
          selectedLower.classList.add('matched');
          selectedUpper.classList.remove('selected');
          selectedLower.classList.remove('selected');
          
          matchesFound++;
          this.audioManager?.playSound('correct');
          
          if (matchesFound === 4) {
            setTimeout(() => {
              this.handleCorrectAnswer('Perfect! You matched all the letters!');
            }, 500);
          }
          
          selectedUpper = null;
          selectedLower = null;
        } else {
          // Incorrect match
          selectedUpper.classList.add('wrong');
          selectedLower.classList.add('wrong');
          
          this.audioManager?.playSound('wrong');
          
          setTimeout(() => {
            selectedUpper.classList.remove('wrong', 'selected');
            selectedLower.classList.remove('wrong', 'selected');
            selectedUpper = null;
            selectedLower = null;
          }, 1000);
        }
      }
    };
    
    this.checkMatch = checkMatch;
  }
  
  /**
   * Handle recognition answer selection
   */
  selectRecognitionAnswer(selectedLetter) {
    if (!this.isPlaying || this.isPaused) return;
    
    if (selectedLetter.letter === this.currentLetter.letter) {
      this.handleCorrectAnswer(`Excellent! You found the letter ${this.currentLetter.letter}!`);
    } else {
      this.handleIncorrectAnswer(`Try again! Look for the letter ${this.currentLetter.letter}.`);
    }
  }
  
  /**
   * Handle phonics answer selection
   */
  selectPhonicsAnswer(selectedLetter) {
    if (!this.isPlaying || this.isPaused) return;
    
    if (selectedLetter.letter === this.currentLetter.letter) {
      this.handleCorrectAnswer(`Perfect! The letter ${this.currentLetter.letter} makes that sound!`);
    } else {
      this.handleIncorrectAnswer(`Not quite! Listen again and find the letter that makes the ${this.currentLetter.sound} sound.`);
    }
  }
  
  /**
   * Handle correct answer
   */
  handleCorrectAnswer(message) {
    const points = 15 + (this.level * 5);
    this.updateScore(points);
    
    // Update letter progress
    if (this.currentLetter) {
      this.letterProgress[this.currentLetter.letter].attempts++;
      this.letterProgress[this.currentLetter.letter].correct++;
      
      // Check if letter is mastered (3+ correct answers)
      if (this.letterProgress[this.currentLetter.letter].correct >= 3) {
        this.letterProgress[this.currentLetter.letter].mastered = true;
      }
    }
    
    // Visual feedback
    this.showLetterFeedback('correct', message);
    
    // Celebrate with animation
    this.celebrateCorrectAnswer();
    
    // Move to next round after delay
    setTimeout(() => {
      this.roundsCompleted++;
      this.nextRound();
    }, 2500);
  }
  
  /**
   * Handle incorrect answer
   */
  handleIncorrectAnswer(message) {
    this.updateScore(-5); // Small penalty
    
    // Update letter progress
    if (this.currentLetter) {
      this.letterProgress[this.currentLetter.letter].attempts++;
    }
    
    // Visual feedback
    this.showLetterFeedback('incorrect', message);
    
    // Highlight correct answer
    this.highlightCorrectAnswer();
    
    // Don't advance round, let them try again
  }
  
  /**
   * Show feedback with letter-specific styling
   */
  showLetterFeedback(type, message) {
    const feedbackArea = document.getElementById('feedback-area');
    if (!feedbackArea) return;
    
    feedbackArea.innerHTML = `
      <div class="letter-feedback ${type}">
        <div class="feedback-icon">${type === 'correct' ? '🎉' : '💭'}</div>
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
    this.createLetterCelebration();
  }
  
  /**
   * Highlight correct answer
   */
  highlightCorrectAnswer() {
    // Highlight based on current game type
    switch (this.currentGameType) {
      case 'recognition':
        const correctOption = document.querySelector(`.letter-option .option-letter`);
        if (correctOption && correctOption.textContent === this.currentLetter.letter) {
          correctOption.closest('.letter-option').classList.add('highlight-correct');
          setTimeout(() => correctOption.closest('.letter-option').classList.remove('highlight-correct'), 2000);
        }
        break;
      case 'phonics':
        const correctPhonics = document.querySelector(`.phonics-option .phonics-letter`);
        if (correctPhonics && correctPhonics.textContent === this.currentLetter.letter) {
          correctPhonics.closest('.phonics-option').classList.add('highlight-correct');
          setTimeout(() => correctPhonics.closest('.phonics-option').classList.remove('highlight-correct'), 2000);
        }
        break;
    }
  }
  
  /**
   * Create celebration effects
   */
  createLetterCelebration() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'letter-celebration-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = (i * 0.1) + 's';
      particle.textContent = ['📚', '✏️', '🌟', '🎉', '📖', '✨', '🏆', '💫'][i];
      
      gameArea.appendChild(particle);
      
      setTimeout(() => particle.remove(), 2000);
    }
  }
  
  /**
   * Update round UI
   */
  updateRoundUI() {
    document.getElementById('current-round').textContent = this.currentRound;
    document.getElementById('total-rounds').textContent = this.totalRounds;
  }
  
  /**
   * Announce round start
   */
  announceRoundStart() {
    const instruction = document.getElementById('instruction');
    if (instruction) {
      const gameTypeNames = {
        recognition: 'Letter Detective',
        phonics: 'Sound Safari',
        matching: 'Letter Pairs',
        tracing: 'Letter Tracer'
      };
      instruction.textContent = `${gameTypeNames[this.currentGameType]} - Round ${this.currentRound}`;
    }
    
    // Play sound for round start
    this.audioManager?.playSound('levelUp');
  }
  
  /**
   * Complete the game
   */
  completeGame() {
    this.end('completed');
    
    // Show completion panel
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('completion-panel').style.display = 'block';
    
    // Calculate letters learned
    const lettersLearned = Object.values(this.letterProgress).filter(progress => progress.mastered).length;
    
    // Update final stats
    document.getElementById('letters-learned').textContent = lettersLearned;
    document.getElementById('final-correct').textContent = this.progress.correctAnswers;
    document.getElementById('final-score').textContent = this.score;
    
    // Show alphabet progress
    this.displayAlphabetProgress();
    
    // Show achievements
    this.displayAchievements();
    
    // Celebration sound
    this.audioManager?.playSound('gameComplete');
  }
  
  /**
   * Display alphabet learning progress
   */
  displayAlphabetProgress() {
    const progressContainer = document.getElementById('alphabet-progress');
    if (!progressContainer) return;
    
    progressContainer.innerHTML = '<h4>Your Alphabet Progress:</h4>';
    
    const progressGrid = document.createElement('div');
    progressGrid.className = 'alphabet-progress-grid';
    
    for (let i = this.letterRange.start; i <= this.letterRange.end; i++) {
      const letter = this.alphabet[i];
      const progress = this.letterProgress[letter.letter];
      
      const letterItem = document.createElement('div');
      letterItem.className = `alphabet-progress-item ${progress.mastered ? 'mastered' : progress.correct > 0 ? 'learning' : 'new'}`;
      
      letterItem.innerHTML = `
        <div class="progress-letter">${letter.letter}</div>
        <div class="progress-status">
          ${progress.mastered ? '🏆' : progress.correct > 0 ? '📚' : '⭐'}
        </div>
        <div class="progress-details">
          ${progress.correct}/${progress.attempts}
        </div>
      `;
      
      progressGrid.appendChild(letterItem);
    }
    
    progressContainer.appendChild(progressGrid);
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
    this.currentGameType = 'recognition';
    this.letterRange = { start: 0, end: 5 };
    this.showUppercase = true;
    this.showLowercase = false;
    
    // Reset letter progress
    this.alphabet.forEach(letter => {
      this.letterProgress[letter.letter] = {
        attempts: 0,
        correct: 0,
        mastered: false
      };
    });
    
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
    this.updateLetterRangeDisplay();
    
    // Reset instruction
    const instruction = document.getElementById('instruction');
    if (instruction) {
      instruction.textContent = 'Welcome to Alphabet Adventure!';
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
    console.log('Letter Learning Game started!');
  }
  
  onGamePause() {
    console.log('Letter Learning Game paused');
  }
  
  onGameResume() {
    console.log('Letter Learning Game resumed');
  }
  
  onGameEnd(reason) {
    console.log(`Letter Learning Game ended: ${reason}`);
  }
  
  onScoreUpdate(oldScore, newScore) {
    // Level up logic
    const newLevel = Math.floor(newScore / 100) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      
      // Expand letter range
      const newEndRange = Math.min(5 + (newLevel - 1) * 4, 25);
      this.letterRange.end = newEndRange;
      
      // Enable lowercase at level 3
      if (newLevel >= 3) {
        this.showLowercase = true;
      }
      
      this.updateLetterRangeDisplay();
      this.audioManager?.playSound('levelUp');
      this.showFeedback('level-up', `Level ${this.level}! More letters unlocked! 🔤`);
    }
  }
  
  getHelpContent() {
    return `
      <h3>How to Play Alphabet Adventure:</h3>
      <ul>
        <li><strong>Letter Detective:</strong> Find and identify the target letter</li>
        <li><strong>Sound Safari:</strong> Match letters with their sounds</li>
        <li><strong>Letter Pairs:</strong> Connect uppercase and lowercase letters</li>
        <li><strong>Letter Tracer:</strong> Practice writing letters with your finger</li>
      </ul>
      <p>Learn at your own pace and discover the wonderful world of letters! 📚</p>
    `;
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#letter-learning' || 
      window.location.pathname.includes('letter-learning')) {
    window.currentGame = new LetterLearningGame();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LetterLearningGame;
} else {
  window.LetterLearningGame = LetterLearningGame;
}
  /**
 * LetterLearning - Educational alphabet learning game for ages 4-6
 * Children learn to recognize letters, match uppercase/lowercase, and basic phonics
 */
class LetterLearningGame extends BaseGame {
  constructor() {
    super({
      id: 'letter-learning',
      title: 'Alphabet Adventure!',
      category: 'letters',
      ageGroup: '4-6',
      difficulty: 2,
      maxScore: 200,
      timeLimit: null // No time pressure for learning
    });
    
    // Game-specific properties
    this.alphabet = [
      { letter: 'A', name: 'A', sound: '/æ/', words: ['Apple', 'Ant', 'Airplane'], emoji: '🍎' },
      { letter: 'B', name: 'B', sound: '/b/', words: ['Ball', 'Bear', 'Banana'], emoji: '⚽' },
      { letter: 'C', name: 'C', sound: '/k/', words: ['Cat', 'Car', 'Cookie'], emoji: '🐱' },
      { letter: 'D', name: 'D', sound: '/d/', words: ['Dog', 'Duck', 'Door'], emoji: '🐶' },
      { letter: 'E', name: 'E', sound: '/ɛ/', words: ['Elephant', 'Egg', 'Eye'], emoji: '🐘' },
      { letter: 'F', name: 'F', sound: '/f/', words: ['Fish', 'Flower', 'Fire'], emoji: '🐟' },
      { letter: 'G', name: 'G', sound: '/g/', words: ['Giraffe', 'Guitar', 'Gift'], emoji: '🦒' },
      { letter: 'H', name: 'H', sound: '/h/', words: ['House', 'Hat', 'Horse'], emoji:
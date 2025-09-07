/**
 * LetterLearning - Educational alphabet learning game for ages 4-6
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
      timeLimit: null
    });
    
    // Game-specific properties
    this.alphabet = [
      { letter: 'A', name: 'A', sound: '/æ/', words: ['Apple', 'Ant', 'Airplane'], emoji: '🍎' },
      { letter: 'B', name: 'B', sound: '/b/', words: ['Ball', 'Bear', 'Banana'], emoji: '⚽' },
      { letter: 'C', name: 'C', sound: '/k/', words: ['Cat', 'Car', 'Cookie'], emoji: '🐱' },
      { letter: 'D', name: 'D', sound: '/d/', words: ['Dog', 'Duck', 'Door'], emoji: '🐶' },
      { letter: 'E', name: 'E', sound: '/ɛ/', words: ['Elephant', 'Egg', 'Eye'], emoji: '🐘' },
      { letter: 'F', name: 'F', sound: '/f/', words: ['Fish', 'Flower', 'Fire'], emoji: '🐟' }
    ];
    
    this.gameTypes = ['recognition', 'phonics', 'matching'];
    this.currentGameType = 'recognition';
    this.currentLetter = null;
    this.currentRound = 1;
    this.totalRounds = 10;
    this.roundsCompleted = 0;
    this.letterRange = { start: 0, end: 5 };
    
    this.letterProgress = {};
    this.alphabet.forEach(letter => {
      this.letterProgress[letter.letter] = {
        attempts: 0,
        correct: 0,
        mastered: false
      };
    });
  }
  
  init() {
    super.init();
    this.setupLetterGameUI();
    console.log('Letter Learning Game ready!');
  }
  
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
              </div>
            </div>
          </div>
        </div>
        
        <div class="game-area" id="game-area" style="display: none;">
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
            </div>
          </div>
          
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
            </div>
          </div>
          
          <div class="matching-game" id="matching-game" style="display: none;">
            <div class="matching-instruction">
              <h3>Match uppercase letters with lowercase letters!</h3>
            </div>
            <div class="matching-area" id="matching-area">
              <div class="uppercase-letters" id="uppercase-letters">
              </div>
              <div class="lowercase-letters" id="lowercase-letters">
              </div>
            </div>
          </div>
          
          <div class="feedback-area" id="feedback-area">
          </div>
          
          <div class="round-info">
            Round: <span id="current-round">1</span> / <span id="total-rounds">10</span>
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
            <button class="btn-restart" id="restart-btn">Play Again</button>
            <button class="btn-menu" id="menu-btn">Back to Games</button>
          </div>
        </div>
      </div>
    `;
    
    this.bindLetterGameEvents();
  }
  
  bindLetterGameEvents() {
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
    const lettersPerLevel = 2;
    const maxLetters = Math.min(4 + (this.level - 1) * lettersPerLevel, 6);
    this.letterRange.end = maxLetters - 1;
    
    this.updateLetterRangeDisplay();
  }
  
  updateLetterRangeDisplay() {
    const startLetter = this.alphabet[this.letterRange.start].letter;
    const endLetter = this.alphabet[this.letterRange.end].letter;
    document.getElementById('letter-range-display').textContent = `${startLetter}-${endLetter}`;
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
    document.getElementById('recognition-game').style.display = 'none';
    document.getElementById('phonics-game').style.display = 'none';
    document.getElementById('matching-game').style.display = 'none';
    
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
    }
  }
  
  generateRecognitionRound() {
    document.getElementById('recognition-game').style.display = 'block';
    
    const letterIndex = Math.floor(Math.random() * (this.letterRange.end - this.letterRange.start + 1)) + this.letterRange.start;
    this.currentLetter = this.alphabet[letterIndex];
    
    document.getElementById('target-letter').textContent = this.currentLetter.letter;
    document.getElementById('target-letter-name').textContent = `Letter ${this.currentLetter.name}`;
    
    const exampleWord = this.currentLetter.words[0];
    document.getElementById('target-letter-example').textContent = `${this.currentLetter.emoji} ${exampleWord}`;
    
    this.generateLetterOptions();
  }
  
  generatePhonicsRound() {
    document.getElementById('phonics-game').style.display = 'block';
    
    const letterIndex = Math.floor(Math.random() * (this.letterRange.end - this.letterRange.start + 1)) + this.letterRange.start;
    this.currentLetter = this.alphabet[letterIndex];
    
    document.getElementById('sound-text').textContent = this.currentLetter.sound;
    
    this.setupSoundButton();
    this.generatePhonicsOptions();
  }
  
  generateMatchingRound() {
    document.getElementById('matching-game').style.display = 'block';
    this.generateLetterPairs();
  }
  
  generateLetterOptions() {
    const container = document.getElementById('letter-options');
    container.innerHTML = '';
    
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
  
  generatePhonicsOptions() {
    const container = document.getElementById('phonics-options');
    container.innerHTML = '';
    
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
  
  generateLetterPairs() {
    const uppercaseContainer = document.getElementById('uppercase-letters');
    const lowercaseContainer = document.getElementById('lowercase-letters');
    
    uppercaseContainer.innerHTML = '';
    lowercaseContainer.innerHTML = '';
    
    const selectedLetters = [];
    for (let i = 0; i < 3; i++) {
      const letterIndex = Math.floor(Math.random() * (this.letterRange.end - this.letterRange.start + 1)) + this.letterRange.start;
      const letter = this.alphabet[letterIndex];
      
      if (!selectedLetters.find(l => l.letter === letter.letter)) {
        selectedLetters.push(letter);
      } else {
        i--;
      }
    }
    
    selectedLetters.forEach((letter, index) => {
      const upperEl = document.createElement('div');
      upperEl.className = 'matching-letter uppercase';
      upperEl.textContent = letter.letter;
      upperEl.dataset.letter = letter.letter;
      upperEl.dataset.index = index;
      uppercaseContainer.appendChild(upperEl);
    });
    
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
    
    this.setupMatching();
  }
  
  setupSoundButton() {
    const soundBtn = document.getElementById('play-sound-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.playLetterSound(this.currentLetter.letter);
        soundBtn.classList.add('playing');
        setTimeout(() => soundBtn.classList.remove('playing'), 1000);
      });
      
      setTimeout(() => soundBtn.click(), 500);
    }
  }
  
  playLetterSound(letter) {
    if (window.audioManager) {
      window.audioManager.playSound('correct');
    }
    console.log(`Playing sound for letter ${letter}`);
  }
  
  setupMatching() {
    let selectedUpper = null;
    let selectedLower = null;
    let matchesFound = 0;
    
    const uppercaseLetters = document.querySelectorAll('.uppercase');
    const lowercaseLetters = document.querySelectorAll('.lowercase');
    
    uppercaseLetters.forEach(letter => {
      letter.addEventListener('click', () => {
        uppercaseLetters.forEach(l => l.classList.remove('selected'));
        letter.classList.add('selected');
        selectedUpper = letter;
        
        this.checkMatch();
      });
    });
    
    lowercaseLetters.forEach(letter => {
      letter.addEventListener('click', () => {
        lowercaseLetters.forEach(l => l.classList.remove('selected'));
        letter.classList.add('selected');
        selectedLower = letter;
        
        this.checkMatch();
      });
    });
    
    const checkMatch = () => {
      if (selectedUpper && selectedLower) {
        if (selectedUpper.dataset.letter === selectedLower.dataset.letter) {
          selectedUpper.classList.add('matched');
          selectedLower.classList.add('matched');
          selectedUpper.classList.remove('selected');
          selectedLower.classList.remove('selected');
          
          matchesFound++;
          if (window.audioManager) {
            window.audioManager.playSound('correct');
          }
          
          if (matchesFound === 3) {
            setTimeout(() => {
              this.handleCorrectAnswer('Perfect! You matched all the letters!');
            }, 500);
          }
          
          selectedUpper = null;
          selectedLower = null;
        } else {
          selectedUpper.classList.add('wrong');
          selectedLower.classList.add('wrong');
          
          if (window.audioManager) {
            window.audioManager.playSound('wrong');
          }
          
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
  
  selectRecognitionAnswer(selectedLetter) {
    if (!this.isPlaying || this.isPaused) return;
    
    if (selectedLetter.letter === this.currentLetter.letter) {
      this.handleCorrectAnswer(`Excellent! You found the letter ${this.currentLetter.letter}!`);
    } else {
      this.handleIncorrectAnswer(`Try again! Look for the letter ${this.currentLetter.letter}.`);
    }
  }
  
  selectPhonicsAnswer(selectedLetter) {
    if (!this.isPlaying || this.isPaused) return;
    
    if (selectedLetter.letter === this.currentLetter.letter) {
      this.handleCorrectAnswer(`Perfect! The letter ${this.currentLetter.letter} makes that sound!`);
    } else {
      this.handleIncorrectAnswer(`Not quite! Listen again and find the letter that makes the ${this.currentLetter.sound} sound.`);
    }
  }
  
  handleCorrectAnswer(message) {
    const points = 15 + (this.level * 5);
    this.updateScore(points);
    
    if (this.currentLetter) {
      this.letterProgress[this.currentLetter.letter].attempts++;
      this.letterProgress[this.currentLetter.letter].correct++;
      
      if (this.letterProgress[this.currentLetter.letter].correct >= 3) {
        this.letterProgress[this.currentLetter.letter].mastered = true;
      }
    }
    
    this.showLetterFeedback('correct', message);
    this.celebrateCorrectAnswer();
    
    setTimeout(() => {
      this.roundsCompleted++;
      this.nextRound();
    }, 2500);
  }
  
  handleIncorrectAnswer(message) {
    this.updateScore(-5);
    
    if (this.currentLetter) {
      this.letterProgress[this.currentLetter.letter].attempts++;
    }
    
    this.showLetterFeedback('incorrect', message);
    this.highlightCorrectAnswer();
  }
  
  showLetterFeedback(type, message) {
    const feedbackArea = document.getElementById('feedback-area');
    if (!feedbackArea) return;
    
    feedbackArea.innerHTML = `
      <div class="letter-feedback ${type}">
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
    this.createLetterCelebration();
  }
  
  highlightCorrectAnswer() {
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
  
  createLetterCelebration() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'letter-celebration-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = (i * 0.1) + 's';
      particle.textContent = ['📚', '✏️', '🌟', '🎉', '📖', '✨'][i];
      
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
        recognition: 'Letter Detective',
        phonics: 'Sound Safari',
        matching: 'Letter Pairs'
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
    
    const lettersLearned = Object.values(this.letterProgress).filter(progress => progress.mastered).length;
    
    document.getElementById('letters-learned').textContent = lettersLearned;
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
    this.currentGameType = 'recognition';
    this.letterRange = { start: 0, end: 5 };
    
    this.alphabet.forEach(letter => {
      this.letterProgress[letter.letter] = {
        attempts: 0,
        correct: 0,
        mastered: false
      };
    });
    
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
    this.updateLetterRangeDisplay();
    
    const instruction = document.getElementById('instruction');
    if (instruction) {
      instruction.textContent = 'Welcome to Alphabet Adventure!';
    }
  }
  
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
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
    const newLevel = Math.floor(newScore / 100) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      
      const newEndRange = Math.min(5 + (newLevel - 1) * 2, 5);
      this.letterRange.end = newEndRange;
      
      this.updateLetterRangeDisplay();
      if (window.audioManager) {
        window.audioManager.playSound('levelUp');
      }
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
      </ul>
      <p>Learn at your own pace and discover the wonderful world of letters!</p>
    `;
  }
}

window.LetterLearningGame = LetterLearningGame;
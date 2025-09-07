/**
 * Force Visible LetterLearning - This WILL show up
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
    
    console.log('LetterLearning constructor called');
    
    // Game properties
    this.alphabet = [
      { letter: 'A', name: 'A', word: 'Apple', emoji: '🍎' },
      { letter: 'B', name: 'B', word: 'Ball', emoji: '⚽' },
      { letter: 'C', name: 'C', word: 'Cat', emoji: '🐱' },
      { letter: 'D', name: 'D', word: 'Dog', emoji: '🐶' },
      { letter: 'E', name: 'E', word: 'Elephant', emoji: '🐘' },
      { letter: 'F', name: 'F', word: 'Fish', emoji: '🐟' }
    ];
    
    this.currentRound = 1;
    this.totalRounds = 10;
    this.targetLetter = null;
    this.letterOptions = [];
    
    // FORCE immediate setup - no delays
    this.forceVisibleSetup();
  }
  
  forceVisibleSetup() {
    console.log('Force visible setup starting for LetterLearning...');
    
    // Remove any existing game containers
    const existingContainers = document.querySelectorAll('#game-container, #force-game-container');
    existingContainers.forEach(c => c.remove());
    
    // Create completely new container with maximum visibility
    const container = document.createElement('div');
    container.id = 'force-game-container';
    
    // CRITICAL: Force maximum visibility with !important styles
    container.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: linear-gradient(45deg, #ab47bc, #7e57c2) !important;
      z-index: 999999 !important;
      display: flex !important;
      flex-direction: column !important;
      font-family: Arial, sans-serif !important;
      overflow-y: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      outline: none !important;
      visibility: visible !important;
      opacity: 1 !important;
    `;
    
    // Force content with inline styles
    container.innerHTML = `
      <div style="
        background: rgba(255,255,255,0.95) !important;
        padding: 30px !important;
        margin: 20px !important;
        border-radius: 15px !important;
        text-align: center !important;
        font-size: 20px !important;
        font-weight: bold !important;
        color: #333 !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
        flex-shrink: 0 !important;
      ">
        <h1 style="
          color: #7e57c2 !important;
          margin: 0 0 20px 0 !important;
          font-size: 2.5rem !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
        ">🔤 Alphabet Adventure!</h1>
        <p style="margin: 10px 0 !important; font-size: 18px !important;">
          Discover letters and learn the alphabet! Click the button below to start.
        </p>
        <button id="force-start-btn" style="
          background: linear-gradient(45deg, #7e57c2, #5e35b1) !important;
          color: white !important;
          border: none !important;
          padding: 20px 40px !important;
          font-size: 18px !important;
          font-weight: bold !important;
          border-radius: 10px !important;
          cursor: pointer !important;
          margin-top: 20px !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
          transition: all 0.3s ease !important;
        ">🚀 START LEARNING</button>
      </div>
      
      <div id="force-game-area" style="
        flex: 1 !important;
        display: none !important;
        justify-content: center !important;
        align-items: center !important;
        padding: 20px !important;
      ">
        <div style="
          background: rgba(255,255,255,0.95) !important;
          padding: 40px !important;
          border-radius: 20px !important;
          text-align: center !important;
          max-width: 700px !important;
          width: 100% !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important;
        ">
          <h2 style="color: #333 !important; margin-bottom: 30px !important; font-size: 1.8rem !important;">
            🎯 Find this letter:
          </h2>
          
          <div id="force-target-letter" style="
            font-size: 120px !important;
            color: #7e57c2 !important;
            font-weight: bold !important;
            font-family: Arial, sans-serif !important;
            margin: 20px auto !important;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.3) !important;
            line-height: 1 !important;
          ">A</div>
          
          <div style="
            background: rgba(126,87,194,0.1) !important;
            padding: 20px !important;
            border-radius: 15px !important;
            margin: 30px 0 !important;
          ">
            <h3 id="force-target-name" style="
              color: #333 !important;
              margin: 0 0 10px 0 !important;
              font-size: 1.4rem !important;
              font-weight: bold !important;
            ">Letter A</h3>
            
            <div id="force-target-example" style="
              font-size: 24px !important;
              color: #666 !important;
              margin: 10px 0 !important;
            ">🍎 Apple</div>
          </div>
          
          <p style="
            margin-bottom: 30px !important;
            font-size: 18px !important;
            color: #666 !important;
          ">Click on the matching letter below:</p>
          
          <div id="force-letter-options" style="
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
            max-width: 400px !important;
            margin: 0 auto 30px auto !important;
          "></div>
          
          <div id="force-feedback" style="
            margin: 20px 0 !important;
            font-size: 20px !important;
            font-weight: bold !important;
            min-height: 40px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          "></div>
          
          <div style="
            display: flex !important;
            justify-content: center !important;
            gap: 15px !important;
            flex-wrap: wrap !important;
          ">
            <button id="force-next-btn" style="
              background: #4caf50 !important;
              color: white !important;
              border: none !important;
              padding: 12px 25px !important;
              font-size: 16px !important;
              border-radius: 8px !important;
              cursor: pointer !important;
              display: none !important;
            ">Next Round</button>
            
            <button id="force-exit-btn" style="
              background: #f44336 !important;
              color: white !important;
              border: none !important;
              padding: 12px 25px !important;
              font-size: 16px !important;
              border-radius: 8px !important;
              cursor: pointer !important;
            ">Exit Game</button>
          </div>
          
          <div style="
            margin-top: 20px !important;
            font-size: 16px !important;
            color: #666 !important;
          ">
            Score: <span id="force-score" style="color: #7e57c2 !important; font-weight: bold !important;">0</span> | 
            Round: <span id="force-round" style="color: #4caf50 !important; font-weight: bold !important;">1</span>/10
          </div>
        </div>
      </div>
    `;
    
    // Force append to body (not dependent on any existing structure)
    document.body.appendChild(container);
    
    // Force hide other elements that might interfere
    const app = document.getElementById('app');
    if (app) app.style.display = 'none';
    
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) gameContainer.style.display = 'none';
    
    console.log('Force container created and added to body for LetterLearning');
    
    // Bind events immediately
    this.bindForceEvents();
    
    // Setup first round
    this.setupFirstRound();
  }
  
  bindForceEvents() {
    console.log('Binding force events for LetterLearning');
    
    const startBtn = document.getElementById('force-start-btn');
    const nextBtn = document.getElementById('force-next-btn');
    const exitBtn = document.getElementById('force-exit-btn');
    
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        console.log('Force start clicked');
        this.startForceGame();
      });
      
      // Add hover effect
      startBtn.addEventListener('mouseenter', () => {
        startBtn.style.transform = 'scale(1.05)';
      });
      startBtn.addEventListener('mouseleave', () => {
        startBtn.style.transform = 'scale(1)';
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        console.log('Force next clicked');
        this.nextForceRound();
      });
    }
    
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        console.log('Force exit clicked');
        this.exitForceGame();
      });
    }
  }
  
  setupFirstRound() {
    // Prepare first round
    this.targetLetter = this.alphabet[0]; // Start with A
    this.letterOptions = [...this.alphabet].slice(0, 4); // Take first 4 letters
    this.letterOptions.sort(() => Math.random() - 0.5); // Shuffle
  }
  
  startForceGame() {
    console.log('Starting force letter game');
    
    // Hide start screen
    const startScreen = document.querySelector('#force-game-container > div:first-child');
    const gameArea = document.getElementById('force-game-area');
    
    if (startScreen) startScreen.style.display = 'none';
    if (gameArea) gameArea.style.display = 'flex';
    
    // Start parent game logic
    this.start();
    
    // Setup first round
    this.updateForceUI();
  }
  
  updateForceUI() {
    console.log('Updating force UI for letter:', this.targetLetter.letter);
    
    // Update target letter
    const targetEl = document.getElementById('force-target-letter');
    const nameEl = document.getElementById('force-target-name');
    const exampleEl = document.getElementById('force-target-example');
    const scoreEl = document.getElementById('force-score');
    const roundEl = document.getElementById('force-round');
    
    if (targetEl) targetEl.textContent = this.targetLetter.letter;
    if (nameEl) nameEl.textContent = `Letter ${this.targetLetter.name}`;
    if (exampleEl) exampleEl.textContent = `${this.targetLetter.emoji} ${this.targetLetter.word}`;
    if (scoreEl) scoreEl.textContent = this.score;
    if (roundEl) roundEl.textContent = this.currentRound;
    
    // Create letter options
    const optionsContainer = document.getElementById('force-letter-options');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      
      this.letterOptions.forEach(letter => {
        const letterButton = document.createElement('div');
        letterButton.style.cssText = `
          background: rgba(255,255,255,0.95) !important;
          padding: 20px !important;
          border-radius: 15px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
          border: 3px solid transparent !important;
          text-align: center !important;
        `;
        
        letterButton.innerHTML = `
          <div style="
            font-size: 48px !important;
            color: #7e57c2 !important;
            font-weight: bold !important;
            margin-bottom: 10px !important;
            font-family: Arial, sans-serif !important;
          ">${letter.letter}</div>
          <div style="
            font-size: 18px !important;
            color: #666 !important;
          ">${letter.emoji}</div>
        `;
        
        letterButton.addEventListener('click', () => {
          console.log('Selected:', letter.letter);
          this.selectForceLetter(letter);
        });
        
        letterButton.addEventListener('mouseenter', () => {
          letterButton.style.transform = 'translateY(-4px)';
          letterButton.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
          letterButton.style.borderColor = '#7e57c2';
        });
        
        letterButton.addEventListener('mouseleave', () => {
          letterButton.style.transform = 'translateY(0)';
          letterButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          letterButton.style.borderColor = 'transparent';
        });
        
        optionsContainer.appendChild(letterButton);
      });
    }
    
    // Hide next button, clear feedback
    const nextBtn = document.getElementById('force-next-btn');
    const feedback = document.getElementById('force-feedback');
    
    if (nextBtn) nextBtn.style.display = 'none';
    if (feedback) feedback.innerHTML = '';
  }
  
  selectForceLetter(selectedLetter) {
    console.log('Checking:', selectedLetter.letter, 'vs', this.targetLetter.letter);
    
    const feedback = document.getElementById('force-feedback');
    const nextBtn = document.getElementById('force-next-btn');
    
    if (selectedLetter.letter === this.targetLetter.letter) {
      // Correct!
      this.updateScore(12);
      
      if (feedback) {
        feedback.innerHTML = `
          <span style="color: #4caf50 !important; font-size: 24px !important;">
            🎉 Perfect! You found the letter ${this.targetLetter.letter}!
          </span>
        `;
      }
      
      this.currentRound++;
      
      if (this.currentRound <= this.totalRounds) {
        if (nextBtn) nextBtn.style.display = 'inline-block';
      } else {
        this.completeForceGame();
      }
      
    } else {
      // Wrong
      this.updateScore(-2);
      
      if (feedback) {
        feedback.innerHTML = `
          <span style="color: #ff5722 !important; font-size: 20px !important;">
            ❌ Try again! Look for the letter ${this.targetLetter.letter}
          </span>
        `;
      }
    }
    
    // Update score display
    const scoreEl = document.getElementById('force-score');
    if (scoreEl) scoreEl.textContent = this.score;
  }
  
  nextForceRound() {
    console.log('Next force round:', this.currentRound);
    
    if (this.currentRound > this.totalRounds) {
      this.completeForceGame();
      return;
    }
    
    // Select new target and options (gradually increase difficulty)
    const maxLetters = Math.min(3 + Math.floor(this.currentRound / 3), 6);
    const letterIndex = Math.floor(Math.random() * maxLetters);
    this.targetLetter = this.alphabet[letterIndex];
    
    // Create options
    this.letterOptions = [this.targetLetter];
    while (this.letterOptions.length < 4) {
      const randomIndex = Math.floor(Math.random() * maxLetters);
      const randomLetter = this.alphabet[randomIndex];
      if (!this.letterOptions.find(opt => opt.letter === randomLetter.letter)) {
        this.letterOptions.push(randomLetter);
      }
    }
    this.letterOptions.sort(() => Math.random() - 0.5);
    
    this.updateForceUI();
  }
  
  completeForceGame() {
    console.log('Force letter game completed with score:', this.score);
    
    const gameArea = document.getElementById('force-game-area');
    if (gameArea) {
      gameArea.innerHTML = `
        <div style="
          background: rgba(255,255,255,0.95) !important;
          padding: 50px !important;
          border-radius: 20px !important;
          text-align: center !important;
          max-width: 500px !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important;
        ">
          <h2 style="
            color: #4caf50 !important;
            margin-bottom: 30px !important;
            font-size: 2.5rem !important;
          ">🎓 Alphabet Master!</h2>
          
          <p style="
            font-size: 20px !important;
            margin-bottom: 15px !important;
            color: #333 !important;
          ">You've completed the alphabet adventure!</p>
          
          <p style="
            font-size: 24px !important;
            margin-bottom: 30px !important;
            color: #7e57c2 !important;
            font-weight: bold !important;
          ">Final Score: ${this.score}</p>
          
          <div style="display: flex !important; justify-content: center !important; gap: 20px !important;">
            <button id="force-restart-btn" style="
              background: #4caf50 !important;
              color: white !important;
              border: none !important;
              padding: 15px 30px !important;
              font-size: 16px !important;
              border-radius: 10px !important;
              cursor: pointer !important;
            ">🔄 Play Again</button>
            
            <button id="force-exit-final-btn" style="
              background: #757575 !important;
              color: white !important;
              border: none !important;
              padding: 15px 30px !important;
              font-size: 16px !important;
              border-radius: 10px !important;
              cursor: pointer !important;
            ">🏠 Back to Games</button>
          </div>
        </div>
      `;
      
      // Bind completion buttons
      const restartBtn = document.getElementById('force-restart-btn');
      const exitFinalBtn = document.getElementById('force-exit-final-btn');
      
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          this.restartForceGame();
        });
      }
      
      if (exitFinalBtn) {
        exitFinalBtn.addEventListener('click', () => {
          this.exitForceGame();
        });
      }
    }
  }
  
  restartForceGame() {
    console.log('Restarting force letter game');
    this.score = 0;
    this.currentRound = 1;
    this.forceVisibleSetup();
  }
  
  exitForceGame() {
    console.log('Exiting force letter game');
    
    // Remove force container
    const forceContainer = document.getElementById('force-game-container');
    if (forceContainer) forceContainer.remove();
    
    // Restore app
    const app = document.getElementById('app');
    if (app) app.style.display = 'block';
    
    // Use parent exit if available
    if (window.gameLoader && window.gameLoader.exitCurrentGame) {
      window.gameLoader.exitCurrentGame();
    } else {
      window.location.hash = 'games';
    }
  }
  
  // Override parent methods
  onGameStart() {
    console.log('Force Letter Learning started!');
  }
  
  onGameEnd(reason) {
    console.log('Force Letter Learning ended:', reason);
  }
  
  onScoreUpdate(oldScore, newScore) {
    console.log('Score updated:', oldScore, '->', newScore);
  }
  
  getHelpContent() {
    return 'Find the correct letter by clicking on it! This is a force-visible version.';
  }
}

// Ensure immediate availability
window.LetterLearningGame = LetterLearningGame;
console.log('Force Visible LetterLearningGame loaded');
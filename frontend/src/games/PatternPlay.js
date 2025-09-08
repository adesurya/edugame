/**
 * Pattern Play Game - Complete simple patterns with shapes!
 * Educational game for children aged 3-4 years
 */
class PatternPlayGame extends BaseGame {
  constructor() {
    super({
      id: 'pattern-play',
      title: 'Pattern Play!',
      category: 'patterns',
      ageGroup: '3-4',
      difficulty: 1,
      maxScore: 160,
      timeLimit: null
    });
    
    console.log('PatternPlay constructor called');
    
    // Game properties
    this.shapes = [
      { name: 'Circle', emoji: '🔴', color: 'red' },
      { name: 'Square', emoji: '🟦', color: 'blue' },
      { name: 'Triangle', emoji: '🔺', color: 'red' },
      { name: 'Star', emoji: '⭐', color: 'yellow' },
      { name: 'Heart', emoji: '💚', color: 'green' },
      { name: 'Diamond', emoji: '🔶', color: 'orange' }
    ];
    
    this.currentRound = 1;
    this.totalRounds = 8;
    this.currentPattern = [];
    this.patternOptions = [];
    this.missingIndex = 0;
    
    this.forceVisibleSetup();
  }
  
  forceVisibleSetup() {
    console.log('Force visible setup starting for PatternPlay...');
    
    const existingContainers = document.querySelectorAll('#game-container, #force-game-container');
    existingContainers.forEach(c => c.remove());
    
    const container = document.createElement('div');
    container.id = 'force-game-container';
    
    container.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: linear-gradient(45deg, #9c27b0, #673ab7) !important;
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
          color: #9c27b0 !important;
          margin: 0 0 20px 0 !important;
          font-size: 2.5rem !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
        ">🔴 Pattern Play!</h1>
        <p style="margin: 10px 0 !important; font-size: 18px !important;">
          Complete simple patterns with colorful shapes! Find what comes next.
        </p>
        <button id="force-start-btn" style="
          background: linear-gradient(45deg, #9c27b0, #7b1fa2) !important;
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
        ">🎨 START PATTERN FUN</button>
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
          max-width: 800px !important;
          width: 100% !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important;
        ">
          <h2 style="color: #333 !important; margin-bottom: 30px !important; font-size: 1.8rem !important;">
            🧩 Complete the pattern!
          </h2>
          
          <div style="
            background: rgba(156,39,176,0.1) !important;
            padding: 30px !important;
            border-radius: 20px !important;
            margin: 30px 0 !important;
          ">
            <h3 style="
              color: #333 !important;
              margin-bottom: 20px !important;
              font-size: 1.4rem !important;
            ">Look at this pattern:</h3>
            
            <div id="force-pattern-display" style="
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
              gap: 15px !important;
              flex-wrap: wrap !important;
              margin: 30px 0 !important;
              min-height: 80px !important;
            "></div>
            
            <div style="
              margin-top: 20px !important;
              padding: 15px !important;
              background: rgba(156,39,176,0.1) !important;
              border-radius: 10px !important;
            ">
              <p style="
                color: #666 !important;
                font-size: 16px !important;
                margin: 0 !important;
              ">What shape should come next? Look for the pattern!</p>
            </div>
          </div>
          
          <p style="
            margin-bottom: 30px !important;
            font-size: 18px !important;
            color: #666 !important;
          ">Choose the missing shape:</p>
          
          <div id="force-pattern-options" style="
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
            max-width: 600px !important;
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
            ">Next Pattern</button>
            
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
            Score: <span id="force-score" style="color: #9c27b0 !important; font-weight: bold !important;">0</span> | 
            Round: <span id="force-round" style="color: #ff9800 !important; font-weight: bold !important;">1</span>/8
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    const app = document.getElementById('app');
    if (app) app.style.display = 'none';
    
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) gameContainer.style.display = 'none';
    
    console.log('Force container created for PatternPlay');
    
    this.bindForceEvents();
    this.setupFirstRound();
  }
  
  bindForceEvents() {
    console.log('Binding force events for PatternPlay');
    
    const startBtn = document.getElementById('force-start-btn');
    const nextBtn = document.getElementById('force-next-btn');
    const exitBtn = document.getElementById('force-exit-btn');
    
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        console.log('Force start clicked');
        this.startForceGame();
      });
      
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
    // Create simple ABAB pattern
    this.currentPattern = [
      this.shapes[0], // Circle
      this.shapes[1], // Square
      this.shapes[0], // Circle
      null // Missing piece
    ];
    this.missingIndex = 3;
    this.patternOptions = [this.shapes[1], this.shapes[0], this.shapes[2]]; // Include correct answer
    this.patternOptions.sort(() => Math.random() - 0.5);
  }
  
  startForceGame() {
    console.log('Starting force pattern play game');
    
    const startScreen = document.querySelector('#force-game-container > div:first-child');
    const gameArea = document.getElementById('force-game-area');
    
    if (startScreen) startScreen.style.display = 'none';
    if (gameArea) gameArea.style.display = 'flex';
    
    this.start();
    this.updateForceUI();
  }
  
  updateForceUI() {
    console.log('Updating force UI for pattern round:', this.currentRound);
    
    const scoreEl = document.getElementById('force-score');
    const roundEl = document.getElementById('force-round');
    
    if (scoreEl) scoreEl.textContent = this.score;
    if (roundEl) roundEl.textContent = this.currentRound;
    
    // Display pattern
    const patternDisplay = document.getElementById('force-pattern-display');
    if (patternDisplay) {
      patternDisplay.innerHTML = '';
      
      this.currentPattern.forEach((shape, index) => {
        const shapeElement = document.createElement('div');
        shapeElement.style.cssText = `
          width: 70px !important;
          height: 70px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 10px !important;
          font-size: 50px !important;
          border: 3px solid #ddd !important;
        `;
        
        if (shape === null) {
          // Missing piece
          shapeElement.style.background = 'rgba(156,39,176,0.1)';
          shapeElement.style.border = '3px dashed #9c27b0';
          shapeElement.innerHTML = '<span style="font-size: 30px; color: #9c27b0;">?</span>';
        } else {
          shapeElement.style.background = 'rgba(255,255,255,0.9)';
          shapeElement.textContent = shape.emoji;
        }
        
        patternDisplay.appendChild(shapeElement);
      });
    }
    
    // Create options
    const optionsContainer = document.getElementById('force-pattern-options');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      
      this.patternOptions.forEach(shape => {
        const optionButton = document.createElement('div');
        optionButton.style.cssText = `
          background: rgba(255,255,255,0.95) !important;
          padding: 20px !important;
          border-radius: 15px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
          border: 3px solid transparent !important;
          text-align: center !important;
        `;
        
        optionButton.innerHTML = `
          <div style="
            font-size: 60px !important;
            margin-bottom: 10px !important;
            line-height: 1 !important;
          ">${shape.emoji}</div>
          <div style="
            font-size: 16px !important;
            color: #666 !important;
            font-weight: bold !important;
          ">${shape.name}</div>
        `;
        
        optionButton.addEventListener('click', () => {
          console.log('Selected shape:', shape.name);
          this.selectForceShape(shape);
        });
        
        optionButton.addEventListener('mouseenter', () => {
          optionButton.style.transform = 'translateY(-4px)';
          optionButton.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
          optionButton.style.borderColor = '#9c27b0';
        });
        
        optionButton.addEventListener('mouseleave', () => {
          optionButton.style.transform = 'translateY(0)';
          optionButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          optionButton.style.borderColor = 'transparent';
        });
        
        optionsContainer.appendChild(optionButton);
      });
    }
    
    const nextBtn = document.getElementById('force-next-btn');
    const feedback = document.getElementById('force-feedback');
    
    if (nextBtn) nextBtn.style.display = 'none';
    if (feedback) feedback.innerHTML = '';
  }
  
  selectForceShape(selectedShape) {
    const correctShape = this.getCorrectShape();
    console.log('Checking:', selectedShape.name, 'vs', correctShape.name);
    
    const feedback = document.getElementById('force-feedback');
    const nextBtn = document.getElementById('force-next-btn');
    
    if (selectedShape.name === correctShape.name) {
      // Correct!
      this.updateScore(20);
      
      // Fill in the pattern
      this.currentPattern[this.missingIndex] = selectedShape;
      this.updatePatternDisplay();
      
      if (feedback) {
        feedback.innerHTML = `
          <span style="color: #4caf50 !important; font-size: 24px !important;">
            🎉 Perfect! You completed the pattern!
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
      this.updateScore(-4);
      
      if (feedback) {
        feedback.innerHTML = `
          <span style="color: #ff5722 !important; font-size: 20px !important;">
            ❌ Try again! Look at the pattern carefully.
          </span>
        `;
      }
    }
    
    const scoreEl = document.getElementById('force-score');
    if (scoreEl) scoreEl.textContent = this.score;
  }
  
  updatePatternDisplay() {
    const patternDisplay = document.getElementById('force-pattern-display');
    if (patternDisplay) {
      patternDisplay.innerHTML = '';
      
      this.currentPattern.forEach((shape, index) => {
        const shapeElement = document.createElement('div');
        shapeElement.style.cssText = `
          width: 70px !important;
          height: 70px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 10px !important;
          font-size: 50px !important;
          border: 3px solid #4caf50 !important;
          background: rgba(76,175,80,0.1) !important;
        `;
        
        shapeElement.textContent = shape.emoji;
        patternDisplay.appendChild(shapeElement);
      });
    }
  }
  
  getCorrectShape() {
    // Determine what shape should come next based on the pattern
    const nonNullShapes = this.currentPattern.filter(s => s !== null);
    
    if (this.currentPattern.length === 4) {
      // ABAB pattern - return the shape that continues the pattern
      if (this.missingIndex === 3) {
        return this.currentPattern[1]; // Should be same as index 1
      }
    }
    
    // Default fallback
    return this.currentPattern[0];
  }
  
  nextForceRound() {
    console.log('Next force round:', this.currentRound);
    
    if (this.currentRound > this.totalRounds) {
      this.completeForceGame();
      return;
    }
    
    // Create new pattern based on difficulty
    this.createNewPattern();
    this.updateForceUI();
  }
  
  createNewPattern() {
    const difficulty = Math.min(Math.floor(this.currentRound / 3) + 1, 3);
    
    if (difficulty === 1) {
      // Simple ABAB pattern
      const shapeA = this.shapes[Math.floor(Math.random() * 3)];
      const shapeB = this.shapes[Math.floor(Math.random() * 3)];
      while (shapeB.name === shapeA.name) {
        shapeB = this.shapes[Math.floor(Math.random() * 3)];
      }
      
      this.currentPattern = [shapeA, shapeB, shapeA, null];
      this.missingIndex = 3;
      this.patternOptions = [shapeB, shapeA, this.shapes[Math.floor(Math.random() * 6)]];
      
    } else if (difficulty === 2) {
      // AAB pattern
      const shapeA = this.shapes[Math.floor(Math.random() * 4)];
      const shapeB = this.shapes[Math.floor(Math.random() * 4)];
      while (shapeB.name === shapeA.name) {
        shapeB = this.shapes[Math.floor(Math.random() * 4)];
      }
      
      this.currentPattern = [shapeA, shapeA, shapeB, null];
      this.missingIndex = 3;
      this.patternOptions = [shapeA, shapeB, this.shapes[Math.floor(Math.random() * 6)]];
      
    } else {
      // ABC pattern
      const shapeA = this.shapes[Math.floor(Math.random() * 6)];
      let shapeB = this.shapes[Math.floor(Math.random() * 6)];
      let shapeC = this.shapes[Math.floor(Math.random() * 6)];
      
      while (shapeB.name === shapeA.name) {
        shapeB = this.shapes[Math.floor(Math.random() * 6)];
      }
      while (shapeC.name === shapeA.name || shapeC.name === shapeB.name) {
        shapeC = this.shapes[Math.floor(Math.random() * 6)];
      }
      
      this.currentPattern = [shapeA, shapeB, shapeC, null];
      this.missingIndex = 3;
      this.patternOptions = [shapeA, shapeB, shapeC];
    }
    
    this.patternOptions.sort(() => Math.random() - 0.5);
  }
  
  completeForceGame() {
    console.log('Force pattern play game completed with score:', this.score);
    
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
          ">🧩 Pattern Master!</h2>
          
          <p style="
            font-size: 20px !important;
            margin-bottom: 15px !important;
            color: #333 !important;
          ">You completed all the patterns perfectly!</p>
          
          <p style="
            font-size: 24px !important;
            margin-bottom: 30px !important;
            color: #9c27b0 !important;
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
    console.log('Restarting force pattern play game');
    this.score = 0;
    this.currentRound = 1;
    this.forceVisibleSetup();
  }
  
  exitForceGame() {
    console.log('Exiting force pattern play game');
    
    const forceContainer = document.getElementById('force-game-container');
    if (forceContainer) forceContainer.remove();
    
    const app = document.getElementById('app');
    if (app) app.style.display = 'block';
    
    if (window.gameLoader && window.gameLoader.exitCurrentGame) {
      window.gameLoader.exitCurrentGame();
    } else {
      window.location.hash = 'games';
    }
  }
  
  onGameStart() {
    console.log('Force Pattern Play started!');
  }
  
  onGameEnd(reason) {
    console.log('Force Pattern Play ended:', reason);
  }
  
  onScoreUpdate(oldScore, newScore) {
    console.log('Score updated:', oldScore, '->', newScore);
  }
  
  getHelpContent() {
    return 'Look at the pattern and find what shape comes next. Patterns repeat in order!';
  }
}

window.PatternPlayGame = PatternPlayGame;
console.log('PatternPlayGame loaded');
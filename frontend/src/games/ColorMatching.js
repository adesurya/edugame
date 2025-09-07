/**
 * Force Visible ColorMatching - This WILL show up
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
      timeLimit: null
    });
    
    console.log('ColorMatching constructor called');
    
    // Game properties
    this.colors = [
      { name: 'Red', hex: '#FF0000' },
      { name: 'Blue', hex: '#0000FF' },
      { name: 'Green', hex: '#00FF00' },
      { name: 'Yellow', hex: '#FFFF00' }
    ];
    
    this.currentRound = 1;
    this.totalRounds = 5;
    this.targetColor = null;
    this.colorOptions = [];
    
    // FORCE immediate setup - no delays
    this.forceVisibleSetup();
  }
  
  forceVisibleSetup() {
    console.log('Force visible setup starting...');
    
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
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4) !important;
      z-index: 999999 !important;
      display: flex !important;
      flex-direction: column !important;
      font-family: Arial, sans-serif !important;
      overflow: hidden !important;
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
          color: #4CAF50 !important;
          margin: 0 0 20px 0 !important;
          font-size: 2.5rem !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
        ">🎨 Color Matching Game!</h1>
        <p style="margin: 10px 0 !important; font-size: 18px !important;">
          Welcome! Click the button below to start playing.
        </p>
        <button id="force-start-btn" style="
          background: linear-gradient(45deg, #4CAF50, #45a049) !important;
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
        ">🚀 START GAME</button>
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
            🎯 Find this color:
          </h2>
          
          <div id="force-target-color" style="
            width: 120px !important;
            height: 120px !important;
            border-radius: 50% !important;
            margin: 20px auto !important;
            border: 5px solid #333 !important;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3) !important;
            background: #FF0000 !important;
          "></div>
          
          <h3 id="force-target-name" style="
            color: #333 !important;
            margin: 20px 0 40px 0 !important;
            font-size: 1.5rem !important;
            font-weight: bold !important;
          ">Red</h3>
          
          <p style="
            margin-bottom: 30px !important;
            font-size: 18px !important;
            color: #666 !important;
          ">Click on the matching color below:</p>
          
          <div id="force-color-options" style="
            display: flex !important;
            justify-content: center !important;
            gap: 25px !important;
            flex-wrap: wrap !important;
            margin-bottom: 30px !important;
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
              background: #2196F3 !important;
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
            Score: <span id="force-score" style="color: #4CAF50 !important; font-weight: bold !important;">0</span> | 
            Round: <span id="force-round" style="color: #2196F3 !important; font-weight: bold !important;">1</span>/5
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
    
    console.log('Force container created and added to body');
    
    // Bind events immediately
    this.bindForceEvents();
    
    // Start first round setup
    this.setupFirstRound();
  }
  
  bindForceEvents() {
    console.log('Binding force events');
    
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
    this.targetColor = this.colors[0]; // Start with Red
    this.colorOptions = [...this.colors].slice(0, 3); // Take first 3 colors
    this.colorOptions.sort(() => Math.random() - 0.5); // Shuffle
  }
  
  startForceGame() {
    console.log('Starting force game');
    
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
    console.log('Updating force UI for:', this.targetColor.name);
    
    // Update target color
    const targetEl = document.getElementById('force-target-color');
    const nameEl = document.getElementById('force-target-name');
    const scoreEl = document.getElementById('force-score');
    const roundEl = document.getElementById('force-round');
    
    if (targetEl) targetEl.style.background = this.targetColor.hex;
    if (nameEl) nameEl.textContent = this.targetColor.name;
    if (scoreEl) scoreEl.textContent = this.score;
    if (roundEl) roundEl.textContent = this.currentRound;
    
    // Create color options
    const optionsContainer = document.getElementById('force-color-options');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      
      this.colorOptions.forEach(color => {
        const colorButton = document.createElement('div');
        colorButton.style.cssText = `
          width: 80px !important;
          height: 80px !important;
          border-radius: 50% !important;
          background: ${color.hex} !important;
          border: 4px solid #333 !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white !important;
          font-weight: bold !important;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.7) !important;
        `;
        
        colorButton.addEventListener('click', () => {
          console.log('Selected:', color.name);
          this.selectForceColor(color);
        });
        
        colorButton.addEventListener('mouseenter', () => {
          colorButton.style.transform = 'scale(1.1)';
          colorButton.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        });
        
        colorButton.addEventListener('mouseleave', () => {
          colorButton.style.transform = 'scale(1)';
          colorButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });
        
        optionsContainer.appendChild(colorButton);
      });
    }
    
    // Hide next button, clear feedback
    const nextBtn = document.getElementById('force-next-btn');
    const feedback = document.getElementById('force-feedback');
    
    if (nextBtn) nextBtn.style.display = 'none';
    if (feedback) feedback.innerHTML = '';
  }
  
  selectForceColor(selectedColor) {
    console.log('Checking:', selectedColor.name, 'vs', this.targetColor.name);
    
    const feedback = document.getElementById('force-feedback');
    const nextBtn = document.getElementById('force-next-btn');
    
    if (selectedColor.name === this.targetColor.name) {
      // Correct!
      this.updateScore(10);
      
      if (feedback) {
        feedback.innerHTML = `
          <span style="color: #4CAF50 !important; font-size: 24px !important;">
            🎉 Perfect! Well done!
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
          <span style="color: #f44336 !important; font-size: 20px !important;">
            ❌ Try again! Look for ${this.targetColor.name}
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
    
    // Select new target and options
    this.targetColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.colorOptions = [...this.colors].slice(0, 3);
    this.colorOptions.sort(() => Math.random() - 0.5);
    
    this.updateForceUI();
  }
  
  completeForceGame() {
    console.log('Force game completed with score:', this.score);
    
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
            color: #4CAF50 !important;
            margin-bottom: 30px !important;
            font-size: 2.5rem !important;
          ">🎉 Congratulations!</h2>
          
          <p style="
            font-size: 20px !important;
            margin-bottom: 15px !important;
            color: #333 !important;
          ">You completed all rounds!</p>
          
          <p style="
            font-size: 24px !important;
            margin-bottom: 30px !important;
            color: #2196F3 !important;
            font-weight: bold !important;
          ">Final Score: ${this.score}</p>
          
          <div style="display: flex !important; justify-content: center !important; gap: 20px !important;">
            <button id="force-restart-btn" style="
              background: #4CAF50 !important;
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
    console.log('Restarting force game');
    this.score = 0;
    this.currentRound = 1;
    this.forceVisibleSetup();
  }
  
  exitForceGame() {
    console.log('Exiting force game');
    
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
    console.log('Force Color Matching started!');
  }
  
  onGameEnd(reason) {
    console.log('Force Color Matching ended:', reason);
  }
  
  onScoreUpdate(oldScore, newScore) {
    console.log('Score updated:', oldScore, '->', newScore);
  }
  
  getHelpContent() {
    return 'This is a force-visible version of Color Matching. Click the correct color!';
  }
}

// Ensure immediate availability
window.ColorMatchingGame = ColorMatchingGame;
console.log('Force Visible ColorMatchingGame loaded');
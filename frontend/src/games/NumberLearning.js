/**
 * Force Visible NumberLearning - This WILL show up
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
    
    console.log('NumberLearning constructor called');
    
    // Game properties
    this.numbers = [
      { value: 1, name: 'One', emoji: '🍎' },
      { value: 2, name: 'Two', emoji: '🍎🍎' },
      { value: 3, name: 'Three', emoji: '🍎🍎🍎' },
      { value: 4, name: 'Four', emoji: '🍎🍎🍎🍎' },
      { value: 5, name: 'Five', emoji: '🍎🍎🍎🍎🍎' }
    ];
    
    this.currentRound = 1;
    this.totalRounds = 8;
    this.targetNumber = null;
    this.currentObjects = [];
    
    // FORCE immediate setup - no delays
    this.forceVisibleSetup();
  }
  
  forceVisibleSetup() {
    console.log('Force visible setup starting for NumberLearning...');
    
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
      background: linear-gradient(45deg, #42a5f5, #66bb6a) !important;
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
          color: #42a5f5 !important;
          margin: 0 0 20px 0 !important;
          font-size: 2.5rem !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
        ">🔢 Number Fun Adventure!</h1>
        <p style="margin: 10px 0 !important; font-size: 18px !important;">
          Learn numbers by counting objects! Click the button below to start.
        </p>
        <button id="force-start-btn" style="
          background: linear-gradient(45deg, #42a5f5, #1976d2) !important;
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
        ">🚀 START COUNTING</button>
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
            🎯 Count the objects:
          </h2>
          
          <div id="force-objects-container" style="
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)) !important;
            gap: 15px !important;
            margin: 30px 0 !important;
            padding: 20px !important;
            background: rgba(240,248,255,0.8) !important;
            border-radius: 15px !important;
            min-height: 120px !important;
            align-items: center !important;
            justify-items: center !important;
          "></div>
          
          <h3 style="
            color: #333 !important;
            margin: 30px 0 20px 0 !important;
            font-size: 1.4rem !important;
          ">How many do you see?</h3>
          
          <div id="force-number-options" style="
            display: flex !important;
            justify-content: center !important;
            gap: 20px !important;
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
              background: #42a5f5 !important;
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
            Score: <span id="force-score" style="color: #42a5f5 !important; font-weight: bold !important;">0</span> | 
            Round: <span id="force-round" style="color: #66bb6a !important; font-weight: bold !important;">1</span>/8
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
    
    // Setup first round
    this.setupFirstRound();
  }
  
  bindForceEvents() {
    console.log('Binding force events for NumberLearning');
    
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
    this.targetNumber = this.numbers[0]; // Start with 1
    this.generateObjects();
  }
  
  startForceGame() {
    console.log('Starting force number game');
    
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
  
  generateObjects() {
    const emojis = ['🍎', '⭐', '🎈', '🚗', '🌸'];
    const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    this.currentObjects = new Array(this.targetNumber.value).fill(selectedEmoji);
  }
  
  updateForceUI() {
    console.log('Updating force UI for number:', this.targetNumber.value);
    
    // Update objects display
    const objectsContainer = document.getElementById('force-objects-container');
    const scoreEl = document.getElementById('force-score');
    const roundEl = document.getElementById('force-round');
    
    if (objectsContainer) {
      objectsContainer.innerHTML = '';
      this.currentObjects.forEach((obj, index) => {
        const objElement = document.createElement('div');
        objElement.style.cssText = `
          font-size: 40px !important;
          cursor: pointer !important;
          transition: transform 0.2s ease !important;
          animation: bounceIn 0.5s ease ${index * 0.1}s both !important;
        `;
        objElement.textContent = obj;
        
        objElement.addEventListener('click', () => {
          objElement.style.transform = 'scale(1.3)';
          setTimeout(() => {
            objElement.style.transform = 'scale(1)';
          }, 200);
        });
        
        objectsContainer.appendChild(objElement);
      });
    }
    
    if (scoreEl) scoreEl.textContent = this.score;
    if (roundEl) roundEl.textContent = this.currentRound;
    
    // Create number options
    this.createNumberOptions();
    
    // Hide next button, clear feedback
    const nextBtn = document.getElementById('force-next-btn');
    const feedback = document.getElementById('force-feedback');
    
    if (nextBtn) nextBtn.style.display = 'none';
    if (feedback) feedback.innerHTML = '';
  }
  
  createNumberOptions() {
    const optionsContainer = document.getElementById('force-number-options');
    if (!optionsContainer) return;
    
    optionsContainer.innerHTML = '';
    
    // Create options including correct answer and some wrong ones
    const options = [this.targetNumber.value];
    const maxOption = Math.min(this.targetNumber.value + 3, 5);
    
    for (let i = 1; i <= maxOption; i++) {
      if (i !== this.targetNumber.value && options.length < 4) {
        options.push(i);
      }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(num => {
      const button = document.createElement('button');
      button.style.cssText = `
        background: linear-gradient(45deg, #66bb6a, #4caf50) !important;
        color: white !important;
        border: none !important;
        width: 60px !important;
        height: 60px !important;
        border-radius: 50% !important;
        font-size: 24px !important;
        font-weight: bold !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
      `;
      button.textContent = num;
      
      button.addEventListener('click', () => {
        this.selectNumber(num);
      });
      
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      });
      
      optionsContainer.appendChild(button);
    });
  }
  
  selectNumber(selectedNumber) {
    console.log('Selected:', selectedNumber, 'vs', this.targetNumber.value);
    
    const feedback = document.getElementById('force-feedback');
    const nextBtn = document.getElementById('force-next-btn');
    
    if (selectedNumber === this.targetNumber.value) {
      // Correct!
      this.updateScore(15);
      
      if (feedback) {
        feedback.innerHTML = `
          <span style="color: #4caf50 !important; font-size: 24px !important;">
            🎉 Perfect! There are ${this.targetNumber.value} objects!
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
      this.updateScore(-3);
      
      if (feedback) {
        feedback.innerHTML = `
          <span style="color: #ff5722 !important; font-size: 18px !important;">
            ❌ Try again! Count carefully - there are ${this.targetNumber.value} objects.
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
    
    // Select new number (gradually increase difficulty)
    const maxNumber = Math.min(2 + Math.floor(this.currentRound / 2), 5);
    const numberIndex = Math.floor(Math.random() * maxNumber);
    this.targetNumber = this.numbers[numberIndex];
    
    this.generateObjects();
    this.updateForceUI();
  }
  
  completeForceGame() {
    console.log('Force number game completed with score:', this.score);
    
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
          ">🎊 Amazing Work!</h2>
          
          <p style="
            font-size: 20px !important;
            margin-bottom: 15px !important;
            color: #333 !important;
          ">You're getting great at counting!</p>
          
          <p style="
            font-size: 24px !important;
            margin-bottom: 30px !important;
            color: #42a5f5 !important;
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
    console.log('Restarting force number game');
    this.score = 0;
    this.currentRound = 1;
    this.forceVisibleSetup();
  }
  
  exitForceGame() {
    console.log('Exiting force number game');
    
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
    console.log('Force Number Learning started!');
  }
  
  onGameEnd(reason) {
    console.log('Force Number Learning ended:', reason);
  }
  
  onScoreUpdate(oldScore, newScore) {
    console.log('Score updated:', oldScore, '->', newScore);
  }
  
  getHelpContent() {
    return 'Count the objects and click the correct number! This is a force-visible version.';
  }
}

// Add CSS animation for bounceIn
const style = document.createElement('style');
style.textContent = `
  @keyframes bounceIn {
    0% { opacity: 0; transform: scale(0.3) translateY(-30px); }
    50% { opacity: 1; transform: scale(1.1) translateY(-10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(style);

// Ensure immediate availability
window.NumberLearningGame = NumberLearningGame;
console.log('Force Visible NumberLearningGame loaded');
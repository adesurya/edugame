/**
 * Fruit Matching Game - Match fruits and learn their names!
 * Educational game for children aged 3-4 years
 */
class FruitMatchingGame extends BaseGame {
  constructor() {
    super({
      id: 'fruit-matching',
      title: 'Fruit Fun!',
      category: 'fruits',
      ageGroup: '3-4',
      difficulty: 1,
      maxScore: 120,
      timeLimit: null
    });
    
    console.log('FruitMatching constructor called');
    
    // Game properties
    this.fruits = [
      { name: 'Apple', emoji: '🍎', color: 'red', taste: 'sweet' },
      { name: 'Banana', emoji: '🍌', color: 'yellow', taste: 'sweet' },
      { name: 'Orange', emoji: '🍊', color: 'orange', taste: 'juicy' },
      { name: 'Grapes', emoji: '🍇', color: 'purple', taste: 'sweet' },
      { name: 'Strawberry', emoji: '🍓', color: 'red', taste: 'sweet' },
      { name: 'Watermelon', emoji: '🍉', color: 'green', taste: 'juicy' }
    ];
    
    this.currentRound = 1;
    this.totalRounds = 8;
    this.targetFruit = null;
    this.fruitOptions = [];
    this.gameMode = 'match'; // 'match' or 'name'
    
    this.forceVisibleSetup();
  }
  
  forceVisibleSetup() {
    console.log('Force visible setup starting for FruitMatching...');
    
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
      background: linear-gradient(45deg, #4caf50, #8bc34a) !important;
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
          color: #4caf50 !important;
          margin: 0 0 20px 0 !important;
          font-size: 2.5rem !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
        ">🍎 Fruit Fun!</h1>
        <p style="margin: 10px 0 !important; font-size: 18px !important;">
          Match fruits and learn their names! Discover delicious fruits and their colors.
        </p>
        <button id="force-start-btn" style="
          background: linear-gradient(45deg, #4caf50, #66bb6a) !important;
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
        ">🍓 START FRUIT ADVENTURE</button>
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
          <h2 id="force-instruction" style="color: #333 !important; margin-bottom: 30px !important; font-size: 1.8rem !important;">
            🎯 Find the matching fruit:
          </h2>
          
          <div id="force-target-display" style="
            background: rgba(76,175,80,0.1) !important;
            padding: 30px !important;
            border-radius: 20px !important;
            margin: 30px 0 !important;
          ">
            <div id="force-target-fruit" style="
              font-size: 120px !important;
              margin: 20px auto !important;
              line-height: 1 !important;
            ">🍎</div>
            
            <h3 id="force-target-name" style="
              color: #333 !important;
              margin: 20px 0 !important;
              font-size: 1.8rem !important;
              font-weight: bold !important;
            ">Apple</h3>
            
            <div id="force-target-info" style="
              background: rgba(76,175,80,0.2) !important;
              padding: 15px !important;
              border-radius: 10px !important;
              margin: 15px 0 !important;
            ">
              <p style="
                margin: 5px 0 !important;
                font-size: 16px !important;
                color: #555 !important;
              ">This fruit is <span id="force-target-color" style="font-weight: bold; color: #4caf50;">red</span></p>
              <p style="
                margin: 5px 0 !important;
                font-size: 16px !important;
                color: #555 !important;
              ">It tastes <span id="force-target-taste" style="font-weight: bold; color: #4caf50;">sweet</span></p>
            </div>
          </div>
          
          <p style="
            margin-bottom: 30px !important;
            font-size: 18px !important;
            color: #666 !important;
          ">Click on the matching fruit:</p>
          
          <div id="force-fruit-options" style="
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
            max-width: 500px !important;
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
            ">Next Fruit</button>
            
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
            Score: <span id="force-score" style="color: #4caf50 !important; font-weight: bold !important;">0</span> | 
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
    
    console.log('Force container created for FruitMatching');
    
    this.bindForceEvents();
    this.setupFirstRound();
  }
  
  bindForceEvents() {
    console.log('Binding force events for FruitMatching');
    
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
    this.targetFruit = this.fruits[0]; // Start with apple
    this.fruitOptions = [...this.fruits].slice(0, 4); // Take first 4 fruits
    this.fruitOptions.sort(() => Math.random() - 0.5); // Shuffle
  }
  
  startForceGame() {
    console.log('Starting force fruit matching game');
    
    const startScreen = document.querySelector('#force-game-container > div:first-child');
    const gameArea = document.getElementById('force-game-area');
    
    if (startScreen) startScreen.style.display = 'none';
    if (gameArea) gameArea.style.display = 'flex';
    
    this.start();
    this.updateForceUI();
  }
  
  updateForceUI() {
    console.log('Updating force UI for fruit:', this.targetFruit.name);
    
    const fruitEl = document.getElementById('force-target-fruit');
    const nameEl = document.getElementById('force-target-name');
    const colorEl = document.getElementById('force-target-color');
    const tasteEl = document.getElementById('force-target-taste');
    const scoreEl = document.getElementById('force-score');
    const roundEl = document.getElementById('force-round');
    
    if (fruitEl) fruitEl.textContent = this.targetFruit.emoji;
    if (nameEl) nameEl.textContent = this.targetFruit.name;
    if (colorEl) colorEl.textContent = this.targetFruit.color;
    if (tasteEl) tasteEl.textContent = this.targetFruit.taste;
    if (scoreEl) scoreEl.textContent = this.score;
    if (roundEl) roundEl.textContent = this.currentRound;
    
    // Update instruction based on game mode
    const instructionEl = document.getElementById('force-instruction');
    if (instructionEl) {
      if (this.gameMode === 'match') {
        instructionEl.textContent = '🎯 Find the matching fruit:';
      } else {
        instructionEl.textContent = '🎯 Which fruit is this?';
      }
    }
    
    // Create fruit options
    const optionsContainer = document.getElementById('force-fruit-options');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      
      this.fruitOptions.forEach(fruit => {
        const fruitButton = document.createElement('div');
        fruitButton.style.cssText = `
          background: rgba(255,255,255,0.95) !important;
          padding: 20px !important;
          border-radius: 15px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
          border: 3px solid transparent !important;
          text-align: center !important;
        `;
        
        if (this.gameMode === 'match') {
          fruitButton.innerHTML = `
            <div style="
              font-size: 64px !important;
              margin-bottom: 10px !important;
              line-height: 1 !important;
            ">${fruit.emoji}</div>
            <div style="
              font-size: 18px !important;
              color: #666 !important;
              font-weight: bold !important;
            ">${fruit.name}</div>
          `;
        } else {
          fruitButton.innerHTML = `
            <div style="
              font-size: 24px !important;
              color: #4caf50 !important;
              font-weight: bold !important;
              margin-bottom: 10px !important;
              font-family: Arial, sans-serif !important;
            ">${fruit.name}</div>
            <div style="
              font-size: 16px !important;
              color: #666 !important;
            ">${fruit.emoji}</div>
          `;
        }
        
        fruitButton.addEventListener('click', () => {
          console.log('Selected fruit:', fruit.name);
          this.selectForceFruit(fruit);
        });
        
        fruitButton.addEventListener('mouseenter', () => {
          fruitButton.style.transform = 'translateY(-4px)';
          fruitButton.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
          fruitButton.style.borderColor = '#4caf50';
        });
        
        fruitButton.addEventListener('mouseleave', () => {
          fruitButton.style.transform = 'translateY(0)';
          fruitButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          fruitButton.style.borderColor = 'transparent';
        });
        
        optionsContainer.appendChild(fruitButton);
      });
    }
    
    const nextBtn = document.getElementById('force-next-btn');
    const feedback = document.getElementById('force-feedback');
    
    if (nextBtn) nextBtn.style.display = 'none';
    if (feedback) feedback.innerHTML = '';
  }
  
  selectForceFruit(selectedFruit) {
    console.log('Checking:', selectedFruit.name, 'vs', this.targetFruit.name);
    
    const feedback = document.getElementById('force-feedback');
    const nextBtn = document.getElementById('force-next-btn');
    
    if (selectedFruit.name === this.targetFruit.name) {
      // Correct!
      this.updateScore(12);
      
      if (feedback) {
        feedback.innerHTML = `
          <span style="color: #4caf50 !important; font-size: 24px !important;">
            🎉 Perfect! You found the ${this.targetFruit.name}!
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
            ❌ Try again! Look for the ${this.targetFruit.name} ${this.targetFruit.emoji}
          </span>
        `;
      }
    }
    
    const scoreEl = document.getElementById('force-score');
    if (scoreEl) scoreEl.textContent = this.score;
  }
  
  nextForceRound() {
    console.log('Next force round:', this.currentRound);
    
    if (this.currentRound > this.totalRounds) {
      this.completeForceGame();
      return;
    }
    
    // Alternate between matching modes
    this.gameMode = (this.currentRound % 3 === 0) ? 'name' : 'match';
    
    // Select new fruit and options
    const maxFruits = Math.min(3 + Math.floor(this.currentRound / 3), 6);
    const fruitIndex = Math.floor(Math.random() * maxFruits);
    this.targetFruit = this.fruits[fruitIndex];
    
    // Create options
    this.fruitOptions = [this.targetFruit];
    while (this.fruitOptions.length < 4) {
      const randomIndex = Math.floor(Math.random() * maxFruits);
      const randomFruit = this.fruits[randomIndex];
      if (!this.fruitOptions.find(opt => opt.name === randomFruit.name)) {
        this.fruitOptions.push(randomFruit);
      }
    }
    this.fruitOptions.sort(() => Math.random() - 0.5);
    
    this.updateForceUI();
  }
  
  completeForceGame() {
    console.log('Force fruit matching game completed with score:', this.score);
    
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
          ">🍎 Fruit Expert!</h2>
          
          <p style="
            font-size: 20px !important;
            margin-bottom: 15px !important;
            color: #333 !important;
          ">You learned about all the delicious fruits!</p>
          
          <p style="
            font-size: 24px !important;
            margin-bottom: 30px !important;
            color: #4caf50 !important;
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
    console.log('Restarting force fruit matching game');
    this.score = 0;
    this.currentRound = 1;
    this.gameMode = 'match';
    this.forceVisibleSetup();
  }
  
  exitForceGame() {
    console.log('Exiting force fruit matching game');
    
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
    console.log('Force Fruit Matching started!');
  }
  
  onGameEnd(reason) {
    console.log('Force Fruit Matching ended:', reason);
  }
  
  onScoreUpdate(oldScore, newScore) {
    console.log('Score updated:', oldScore, '->', newScore);
  }
  
  getHelpContent() {
    return 'Match the fruits by clicking on the correct one. Learn their names and colors!';
  }
}

window.FruitMatchingGame = FruitMatchingGame;
console.log('FruitMatchingGame loaded');
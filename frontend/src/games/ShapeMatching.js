/**
 * Shape Matching Game - Perfect for ages 3-4
 * Learn basic shapes through visual recognition and matching
 */
class ShapeMatchingGame extends BaseGame {
  constructor() {
    super({
      id: 'shape-matching',
      title: 'Shape Fun Adventure!',
      category: 'shapes',
      ageGroup: '3-4',
      difficulty: 1,
      maxScore: 120,
      timeLimit: null
    });
    
    console.log('ShapeMatching constructor called');
    
    // Game properties
    this.shapes = [
      { 
        name: 'Circle', 
        emoji: '🔵', 
        svg: this.createCircleSVG(),
        color: '#2196F3',
        description: 'Round like a ball!'
      },
      { 
        name: 'Square', 
        emoji: '🟦', 
        svg: this.createSquareSVG(),
        color: '#4CAF50',
        description: 'Four equal sides!'
      },
      { 
        name: 'Triangle', 
        emoji: '🔺', 
        svg: this.createTriangleSVG(),
        color: '#FF9800',
        description: 'Three pointy corners!'
      },
      { 
        name: 'Heart', 
        emoji: '❤️', 
        svg: this.createHeartSVG(),
        color: '#E91E63',
        description: 'Shape of love!'
      },
      { 
        name: 'Star', 
        emoji: '⭐', 
        svg: this.createStarSVG(),
        color: '#FFC107',
        description: 'Twinkle twinkle!'
      }
    ];
    
    this.currentRound = 1;
    this.totalRounds = 8;
    this.targetShape = null;
    this.shapeOptions = [];
    this.gameMode = 'recognition'; // 'recognition', 'matching', 'tracing'
    
    // FORCE immediate setup
    this.forceVisibleSetup();
  }
  
  createCircleSVG() {
    return `<svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="35" fill="#2196F3" stroke="#1976D2" stroke-width="3"/>
    </svg>`;
  }
  
  createSquareSVG() {
    return `<svg width="80" height="80" viewBox="0 0 80 80">
      <rect x="10" y="10" width="60" height="60" fill="#4CAF50" stroke="#388E3C" stroke-width="3" rx="5"/>
    </svg>`;
  }
  
  createTriangleSVG() {
    return `<svg width="80" height="80" viewBox="0 0 80 80">
      <polygon points="40,10 70,65 10,65" fill="#FF9800" stroke="#F57C00" stroke-width="3"/>
    </svg>`;
  }
  
  createHeartSVG() {
    return `<svg width="80" height="80" viewBox="0 0 80 80">
      <path d="M40,70 C40,70 10,45 10,25 C10,15 20,10 30,15 C35,10 40,10 40,15 C40,10 45,10 50,15 C60,10 70,15 70,25 C70,45 40,70 40,70 Z" fill="#E91E63" stroke="#C2185B" stroke-width="2"/>
    </svg>`;
  }
  
  createStarSVG() {
    return `<svg width="80" height="80" viewBox="0 0 80 80">
      <polygon points="40,10 46,28 65,28 51,40 57,58 40,46 23,58 29,40 15,28 34,28" fill="#FFC107" stroke="#FFA000" stroke-width="2"/>
    </svg>`;
  }
  
  forceVisibleSetup() {
    console.log('Force visible setup starting for ShapeMatching...');
    
    // Remove any existing containers
    const existingContainers = document.querySelectorAll('#game-container, #force-game-container');
    existingContainers.forEach(c => c.remove());
    
    // Create new container
    const container = document.createElement('div');
    container.id = 'force-game-container';
    
    container.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: linear-gradient(45deg, #81C784, #64B5F6) !important;
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
          color: #4CAF50 !important;
          margin: 0 0 20px 0 !important;
          font-size: 2.5rem !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
        ">🔴 Shape Fun Adventure!</h1>
        <p style="margin: 10px 0 !important; font-size: 18px !important;">
          Learn about shapes! They're everywhere around us. Ready to explore?
        </p>
        <button id="force-start-btn" style="
          background: linear-gradient(45deg, #4CAF50, #66BB6A) !important;
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
        ">🚀 START LEARNING SHAPES</button>
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
            🎯 Find this shape:
          </h2>
          
          <div style="
            background: rgba(76,175,80,0.1) !important;
            padding: 30px !important;
            border-radius: 20px !important;
            margin: 30px 0 !important;
            border: 3px dashed #4CAF50 !important;
          ">
            <div id="force-target-shape" style="
              display: flex !important;
              justify-content: center !important;
              margin-bottom: 20px !important;
            "></div>
            
            <h3 id="force-target-name" style="
              color: #333 !important;
              margin: 0 0 10px 0 !important;
              font-size: 1.6rem !important;
              font-weight: bold !important;
            ">Circle</h3>
            
            <p id="force-target-description" style="
              color: #666 !important;
              font-size: 1.1rem !important;
              margin: 10px 0 !important;
              font-style: italic !important;
            ">Round like a ball!</p>
          </div>
          
          <p style="
            margin-bottom: 30px !important;
            font-size: 18px !important;
            color: #666 !important;
          ">Click on the matching shape below:</p>
          
          <div id="force-shape-options" style="
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 25px !important;
            max-width: 400px !important;
            margin: 0 auto 30px auto !important;
          "></div>
          
          <div id="force-feedback" style="
            margin: 20px 0 !important;
            font-size: 20px !important;
            font-weight: bold !important;
            min-height: 60px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-direction: column !important;
          "></div>
          
          <div style="
            display: flex !important;
            justify-content: center !important;
            gap: 15px !important;
            flex-wrap: wrap !important;
          ">
            <button id="force-next-btn" style="
              background: #4CAF50 !important;
              color: white !important;
              border: none !important;
              padding: 12px 25px !important;
              font-size: 16px !important;
              border-radius: 8px !important;
              cursor: pointer !important;
              display: none !important;
            ">Next Shape</button>
            
            <button id="force-exit-btn" style="
              background: #757575 !important;
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
            Round: <span id="force-round" style="color: #2196F3 !important; font-weight: bold !important;">1</span>/8
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    // Hide other elements
    const app = document.getElementById('app');
    if (app) app.style.display = 'none';
    
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) gameContainer.style.display = 'none';
    
    console.log('Force container created for ShapeMatching');
    
    this.bindForceEvents();
    this.setupFirstRound();
  }
  
  bindForceEvents() {
    console.log('Binding force events for ShapeMatching');
    
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
    // Start with circle - easiest shape for 3-4 year olds
    this.targetShape = this.shapes[0]; // Circle
    this.shapeOptions = [...this.shapes].slice(0, 4); // First 4 shapes
    this.shapeOptions.sort(() => Math.random() - 0.5); // Shuffle
  }
  
  startForceGame() {
    console.log('Starting force shape game');
    
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
    console.log('Updating force UI for shape:', this.targetShape.name);
    
    // Update target shape display
    const targetShapeEl = document.getElementById('force-target-shape');
    const nameEl = document.getElementById('force-target-name');
    const descriptionEl = document.getElementById('force-target-description');
    const scoreEl = document.getElementById('force-score');
    const roundEl = document.getElementById('force-round');
    
    if (targetShapeEl) {
      targetShapeEl.innerHTML = `
        <div style="
          display: inline-block !important;
          background: white !important;
          padding: 20px !important;
          border-radius: 15px !important;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
          transform: scale(1.5) !important;
        ">
          ${this.targetShape.svg}
        </div>
      `;
    }
    
    if (nameEl) nameEl.textContent = this.targetShape.name;
    if (descriptionEl) descriptionEl.textContent = this.targetShape.description;
    if (scoreEl) scoreEl.textContent = this.score;
    if (roundEl) roundEl.textContent = this.currentRound;
    
    // Create shape options
    const optionsContainer = document.getElementById('force-shape-options');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      
      this.shapeOptions.forEach(shape => {
        const shapeButton = document.createElement('div');
        shapeButton.style.cssText = `
          background: rgba(255,255,255,0.95) !important;
          padding: 20px !important;
          border-radius: 15px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          border: 3px solid transparent !important;
          text-align: center !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 10px !important;
        `;
        
        shapeButton.innerHTML = `
          <div style="transform: scale(1.2);">
            ${shape.svg}
          </div>
          <div style="
            font-size: 16px !important;
            font-weight: bold !important;
            color: #333 !important;
          ">${shape.name}</div>
        `;
        
        shapeButton.addEventListener('click', () => {
          console.log('Selected shape:', shape.name);
          this.selectForceShape(shape);
        });
        
        shapeButton.addEventListener('mouseenter', () => {
          shapeButton.style.transform = 'translateY(-8px) scale(1.05)';
          shapeButton.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
          shapeButton.style.borderColor = shape.color;
        });
        
        shapeButton.addEventListener('mouseleave', () => {
          shapeButton.style.transform = 'translateY(0) scale(1)';
          shapeButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          shapeButton.style.borderColor = 'transparent';
        });
        
        optionsContainer.appendChild(shapeButton);
      });
    }
    
    // Hide next button, clear feedback
    const nextBtn = document.getElementById('force-next-btn');
    const feedback = document.getElementById('force-feedback');
    
    if (nextBtn) nextBtn.style.display = 'none';
    if (feedback) feedback.innerHTML = '';
  }
  
  selectForceShape(selectedShape) {
    console.log('Checking:', selectedShape.name, 'vs', this.targetShape.name);
    
    const feedback = document.getElementById('force-feedback');
    const nextBtn = document.getElementById('force-next-btn');
    
    if (selectedShape.name === this.targetShape.name) {
      // Correct!
      this.updateScore(15);
      this.createCelebrationEffect();
      
      if (feedback) {
        feedback.innerHTML = `
          <div style="color: #4CAF50 !important; font-size: 24px !important; margin-bottom: 10px !important;">
            🎉 Amazing! You found the ${this.targetShape.name}!
          </div>
          <div style="color: #666 !important; font-size: 16px !important;">
            Great job recognizing that shape!
          </div>
        `;
      }
      
      this.currentRound++;
      
      if (this.currentRound <= this.totalRounds) {
        if (nextBtn) nextBtn.style.display = 'inline-block';
      } else {
        this.completeForceGame();
      }
      
    } else {
      // Wrong - but gentle feedback for young children
      if (feedback) {
        feedback.innerHTML = `
          <div style="color: #FF9800 !important; font-size: 20px !important; margin-bottom: 10px !important;">
            🤔 That's a ${selectedShape.name}! Try again!
          </div>
          <div style="color: #666 !important; font-size: 16px !important;">
            Look for the ${this.targetShape.name} - ${this.targetShape.description}
          </div>
        `;
      }
    }
    
    // Update score display
    const scoreEl = document.getElementById('force-score');
    if (scoreEl) scoreEl.textContent = this.score;
  }
  
  createCelebrationEffect() {
    // Create floating shapes for celebration
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: fixed !important;
          font-size: 30px !important;
          pointer-events: none !important;
          z-index: 1000000 !important;
          left: ${Math.random() * window.innerWidth}px !important;
          top: ${window.innerHeight}px !important;
          animation: floatUp 3s ease-out forwards !important;
        `;
        
        // Random shape for celebration
        const randomShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
        particle.innerHTML = randomShape.emoji;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
          if (particle.parentElement) {
            particle.remove();
          }
        }, 3000);
      }, i * 200);
    }
    
    // Add CSS animation if not exists
    if (!document.getElementById('celebration-styles')) {
      const style = document.createElement('style');
      style.id = 'celebration-styles';
      style.textContent = `
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  nextForceRound() {
    console.log('Next force round:', this.currentRound);
    
    if (this.currentRound > this.totalRounds) {
      this.completeForceGame();
      return;
    }
    
    // Gradually introduce new shapes and increase difficulty
    const shapesToUse = Math.min(2 + Math.floor(this.currentRound / 2), 5);
    const availableShapes = this.shapes.slice(0, shapesToUse);
    
    // Select random target
    this.targetShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    
    // Create options (always include correct answer)
    this.shapeOptions = [this.targetShape];
    while (this.shapeOptions.length < Math.min(4, shapesToUse + 1)) {
      const randomShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
      if (!this.shapeOptions.find(s => s.name === randomShape.name)) {
        this.shapeOptions.push(randomShape);
      }
    }
    
    this.shapeOptions.sort(() => Math.random() - 0.5);
    this.updateForceUI();
  }
  
  completeForceGame() {
    console.log('Force shape game completed with score:', this.score);
    
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
          ">🌟 Shape Master!</h2>
          
          <div style="margin: 20px 0 !important; font-size: 3rem !important;">
            🔵🟦🔺❤️⭐
          </div>
          
          <p style="
            font-size: 20px !important;
            margin-bottom: 15px !important;
            color: #333 !important;
          ">You learned so many shapes! Amazing work!</p>
          
          <p style="
            font-size: 24px !important;
            margin-bottom: 30px !important;
            color: #4CAF50 !important;
            font-weight: bold !important;
          ">Final Score: ${this.score}</p>
          
          <div style="
            background: rgba(76,175,80,0.1) !important;
            padding: 20px !important;
            border-radius: 15px !important;
            margin: 20px 0 !important;
          ">
            <p style="font-size: 16px !important; color: #666 !important;">
              Now you can find shapes everywhere! Look for circles, squares, and triangles around you!
            </p>
          </div>
          
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
    console.log('Restarting force shape game');
    this.score = 0;
    this.currentRound = 1;
    this.forceVisibleSetup();
  }
  
  exitForceGame() {
    console.log('Exiting force shape game');
    
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
    console.log('Force Shape Matching started!');
  }
  
  onGameEnd(reason) {
    console.log('Force Shape Matching ended:', reason);
  }
  
  onScoreUpdate(oldScore, newScore) {
    console.log('Score updated:', oldScore, '->', newScore);
  }
  
  getHelpContent() {
    return 'Look at the big shape, then find the same shape below! Shapes are everywhere around us.';
  }
}

// Make available globally
window.ShapeMatchingGame = ShapeMatchingGame;
console.log('Shape Matching Game loaded for ages 3-4');
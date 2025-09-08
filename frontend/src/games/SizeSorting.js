/**
 * Size Sorting Game - Sort objects by size - big and small!
 * Educational game for children aged 3-4 years
 */
class SizeSortingGame extends BaseGame {
  constructor() {
    super({
      id: 'size-sorting',
      title: 'Size Sorting Fun!',
      category: 'sizes',
      ageGroup: '3-4',
      difficulty: 1,
      maxScore: 130,
      timeLimit: null
    });
    
    console.log('SizeSorting constructor called');
    
    // Game properties
    this.objects = [
      { name: 'Ball', emoji: '⚽', category: 'toy' },
      { name: 'Apple', emoji: '🍎', category: 'fruit' },
      { name: 'Car', emoji: '🚗', category: 'vehicle' },
      { name: 'House', emoji: '🏠', category: 'building' },
      { name: 'Tree', emoji: '🌳', category: 'nature' },
      { name: 'Cat', emoji: '🐱', category: 'animal' }
    ];
    
    this.currentRound = 1;
    this.totalRounds = 8;
    this.targetSize = 'big'; // 'big' or 'small'
    this.currentObjects = [];
    this.sortingMode = 'identify'; // 'identify', 'compare'
    
    this.forceVisibleSetup();
  }
  
  forceVisibleSetup() {
    console.log('Force visible setup starting for SizeSorting...');
    
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
      background: linear-gradient(45deg, #ff9800, #f57c00) !important;
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
          color: #ff9800 !important;
          margin: 0 0 20px 0 !important;
          font-size: 2.5rem !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
        ">📏 Size Sorting Fun!</h1>
        <p style="margin: 10px 0 !important; font-size: 18px !important;">
          Learn about big and small! Sort objects by their size.
        </p>
        <button id="force-start-btn" style="
          background: linear-gradient(45deg, #ff9800, #f57c00) !important;
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
        ">📏 START SORTING</button>
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
            📏 Find the BIG objects!
          </h2>
          
          <div style="
            background: rgba(255,152,0,0.1) !important;
            padding: 30px !important;
            border-radius: 20px !important;
            margin: 30px 0 !important;
          ">
            <div id="force-size-example" style="
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
              gap: 30px !important;
              margin: 20px 0 !important;
            ">
              <div style="
                text-align: center !important;
                padding: 20px !important;
                background: rgba(76,175,80,0.1) !important;
                border-radius: 15px !important;
                border: 3px solid #4caf50 !important;
              ">
                <div style="font-size: 80px !important; margin-bottom: 10px !important;">🏠</div>
                <div style="font-size: 18px !important; font-weight: bold !important; color: #4caf50 !important;">BIG</div>
              </div>
              
              <div style="
                text-align: center !important;
                padding: 20px !important;
                background: rgba(33,150,243,0.1) !important;
                border-radius: 15px !important;
                border: 3px solid #2196f3 !important;
              ">
                <div style="font-size: 40px !important; margin-bottom: 10px !important;">🍎</div>
                <div style="font-size: 18px !important; font-weight: bold !important; color: #2196f3 !important;">SMALL</div>
              </div>
            </div>
            
            <p style="
              color: #666 !important;
              font-size: 16px !important;
              margin: 15px 0 !important;
            ">A house is BIG, an apple is SMALL</p>
          </div>
          
          <p id="force-task-description" style="
            margin-bottom: 30px !important;
            font-size: 18px !important;
            color: #666 !important;
          ">Click on all the BIG objects:</p>
          
          <div id="force-objects-grid" style="
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
            Score: <span id="force-score" style="color: #ff9800 !important; font-weight: bold !important;">0</span> | 
            Round: <span id="force-round" style="color: #4caf50 !important; font-weight: bold !important;">1</span>/8
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    const app = document.getElementById('app');
    if (app) app.style.display = 'none';
    
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) gameContainer.style.display = 'none';
    
    console.log('Force container created for SizeSorting');
    
    this.bindForceEvents();
    this.setupFirstRound();
  }
  
  bindForceEvents() {
    console.log('Binding force events for SizeSorting');
    
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
    this.targetSize = 'big';
    this.currentObjects = this.generateObjectsWithSizes();
    this.selectedCount = 0;
  }
  
  generateObjectsWithSizes() {
    // Define which objects are typically big or small
    const sizeMappings = {
      'Ball': 'small',
      'Apple': 'small', 
      'Car': 'big',
      'House': 'big',
      'Tree': 'big',
      'Cat': 'small'
    };
    
    return this.objects.map(obj => ({
      ...obj,
      size: sizeMappings[obj.name] || 'small',
      selected: false
    }));
  }
  
  startForceGame() {
    console.log('Starting force size sorting game');
    
    const startScreen = document.querySelector('#force-game-container > div:first-child');
    const gameArea = document.getElementById('force-game-area');
    
    if (startScreen) startScreen.style.display = 'none';
    if (gameArea) gameArea.style.display = 'flex';
    
    this.start();
    this.updateForceUI();
  }
  
  updateForceUI() {
    console.log('Updating force UI for size:', this.targetSize);
    
    const instructionEl = document.getElementById('force-instruction');
    const taskEl = document.getElementById('force-task-description');
    const scoreEl = document.getElementById('force-score');
    const roundEl = document.getElementById('force-round');
    
    if (instructionEl) {
      instructionEl.textContent = this.targetSize === 'big' ? 
        '📏 Find the BIG objects!' : '📏 Find the SMALL objects!';
    }
    
    if (taskEl) {
      taskEl.textContent = this.targetSize === 'big' ?
        'Click on all the BIG objects:' : 'Click on all the SMALL objects:';
    }
    
    if (scoreEl) scoreEl.textContent = this.score;
    if (roundEl) roundEl.textContent = this.currentRound;
    
    // Create objects grid
    const objectsGrid = document.getElementById('force-objects-grid');
    if (objectsGrid) {
      objectsGrid.innerHTML = '';
      
      this.currentObjects.forEach((obj, index) => {
        const objectButton = document.createElement('div');
        objectButton.style.cssText = `
          background: rgba(255,255,255,0.95) !important;
          padding: 20px !important;
          border-radius: 15px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
          border: 3px solid ${obj.selected ? '#4caf50' : 'transparent'} !important;
          text-align: center !important;
        `;
        
        // Adjust emoji size based on object's actual size
        const emojiSize = obj.size === 'big' ? '60px' : '40px';
        
        objectButton.innerHTML = `
          <div style="
            font-size: ${emojiSize} !important;
            margin-bottom: 10px !important;
            line-height: 1 !important;
          ">${obj.emoji}</div>
          <div style="
            font-size: 16px !important;
            color: #666 !important;
            font-weight: bold !important;
          ">${obj.name}</div>
        `;
        
        objectButton.addEventListener('click', () => {
          this.selectForceObject(obj, index);
        });
        
        objectButton.addEventListener('mouseenter', () => {
          if (!obj.selected) {
            objectButton.style.transform = 'translateY(-4px)';
            objectButton.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
            objectButton.style.borderColor = '#ff9800';
          }
        });
        
        objectButton.addEventListener('mouseleave', () => {
          if (!obj.selected) {
            objectButton.style.transform = 'translateY(0)';
            objectButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            objectButton.style.borderColor = 'transparent';
          }
        });
        
        objectsGrid.appendChild(objectButton);
      });
    }
    
    const nextBtn = document.getElementById('force-next-btn');
    const feedback = document.getElementById('force-feedback');
    
    if (nextBtn) nextBtn.style.display = 'none';
    if (feedback) feedback.innerHTML = '';
  }
  
  selectForceObject(obj, index) {
    console.log('Selected object:', obj.name, 'Size:', obj.size, 'Target:', this.targetSize);
    
    if (obj.selected) {
      // Deselect
      obj.selected = false;
      this.selectedCount--;
    } else {
      // Select
      obj.selected = true;
      this.selectedCount++;
    }
    
    // Update visual state
    this.updateObjectVisual(index, obj);
    
    // Check if correct selection
    if (obj.selected && obj.size === this.targetSize) {
      this.updateScore(8);
      this.showObjectFeedback(obj, true);
    } else if (obj.selected && obj.size !== this.targetSize) {
      this.updateScore(-3);
      this.showObjectFeedback(obj, false);
    }
    
    // Check if round complete
    this.checkRoundComplete();
    
    const scoreEl = document.getElementById('force-score');
    if (scoreEl) scoreEl.textContent = this.score;
  }
  
  updateObjectVisual(index, obj) {
    const objectsGrid = document.getElementById('force-objects-grid');
    if (objectsGrid && objectsGrid.children[index]) {
      const objectElement = objectsGrid.children[index];
      objectElement.style.borderColor = obj.selected ? '#4caf50' : 'transparent';
      objectElement.style.background = obj.selected ? 'rgba(76,175,80,0.1)' : 'rgba(255,255,255,0.95)';
    }
  }
  
  showObjectFeedback(obj, isCorrect) {
    const feedback = document.getElementById('force-feedback');
    if (feedback) {
      if (isCorrect) {
        feedback.innerHTML = `
          <span style="color: #4caf50 !important; font-size: 18px !important;">
            ✅ Correct! ${obj.name} is ${obj.size.toUpperCase()}!
          </span>
        `;
      } else {
        feedback.innerHTML = `
          <span style="color: #ff5722 !important; font-size: 18px !important;">
            ❌ ${obj.name} is ${obj.size.toUpperCase()}, not ${this.targetSize.toUpperCase()}!
          </span>
        `;
      }
      
      // Clear feedback after 2 seconds
      setTimeout(() => {
        if (feedback.innerHTML.includes(obj.name)) {
          feedback.innerHTML = '';
        }
      }, 2000);
    }
  }
  
  checkRoundComplete() {
    const correctObjects = this.currentObjects.filter(obj => obj.size === this.targetSize);
    const correctlySelected = this.currentObjects.filter(obj => obj.selected && obj.size === this.targetSize);
    const incorrectlySelected = this.currentObjects.filter(obj => obj.selected && obj.size !== this.targetSize);
    
    // Round complete when all correct objects are selected and no incorrect ones
    if (correctlySelected.length === correctObjects.length && incorrectlySelected.length === 0) {
      this.completeRound();
    }
  }
  
  completeRound() {
    const feedback = document.getElementById('force-feedback');
    const nextBtn = document.getElementById('force-next-btn');
    
    // Bonus points for perfect round
    this.updateScore(10);
    
    if (feedback) {
      feedback.innerHTML = `
        <span style="color: #4caf50 !important; font-size: 24px !important;">
          🎉 Perfect! You found all the ${this.targetSize.toUpperCase()} objects!
        </span>
      `;
    }
    
    this.currentRound++;
    
    if (this.currentRound <= this.totalRounds) {
      if (nextBtn) nextBtn.style.display = 'inline-block';
    } else {
      this.completeForceGame();
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
    
    // Alternate between big and small
    this.targetSize = this.currentRound % 2 === 0 ? 'small' : 'big';
    
    // Reset selections
    this.currentObjects.forEach(obj => obj.selected = false);
    this.selectedCount = 0;
    
    // Shuffle objects for variety
    this.currentObjects.sort(() => Math.random() - 0.5);
    
    this.updateForceUI();
  }
  
  completeForceGame() {
    console.log('Force size sorting game completed with score:', this.score);
    
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
          ">📏 Size Expert!</h2>
          
          <p style="
            font-size: 20px !important;
            margin-bottom: 15px !important;
            color: #333 !important;
          ">You learned all about big and small objects!</p>
          
          <p style="
            font-size: 24px !important;
            margin-bottom: 30px !important;
            color: #ff9800 !important;
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
    console.log('Restarting force size sorting game');
    this.score = 0;
    this.currentRound = 1;
    this.forceVisibleSetup();
  }
  
  exitForceGame() {
    console.log('Exiting force size sorting game');
    
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
    console.log('Force Size Sorting started!');
  }
  
  onGameEnd(reason) {
    console.log('Force Size Sorting ended:', reason);
  }
  
  onScoreUpdate(oldScore, newScore) {
    console.log('Score updated:', oldScore, '->', newScore);
  }
  
  getHelpContent() {
    return 'Learn about big and small! Click on objects that match the size you need to find.';
  }
}

window.SizeSortingGame = SizeSortingGame;
console.log('SizeSortingGame loaded');
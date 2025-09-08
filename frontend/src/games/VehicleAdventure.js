/**
 * Vehicle Adventure Game - Explore different types of vehicles!
 * Educational game for children aged 3-4 years
 */
class VehicleAdventureGame extends BaseGame {
  constructor() {
    super({
      id: 'vehicle-adventure',
      title: 'Vehicle Adventure!',
      category: 'vehicles',
      ageGroup: '3-4',
      difficulty: 1,
      maxScore: 140,
      timeLimit: null
    });
    
    console.log('VehicleAdventure constructor called');
    
    // Game properties
    this.vehicles = [
      { name: 'Car', emoji: '🚗', category: 'land', sound: 'Vroom!', use: 'driving around' },
      { name: 'Bus', emoji: '🚌', category: 'land', sound: 'Beep beep!', use: 'carrying many people' },
      { name: 'Airplane', emoji: '✈️', category: 'air', sound: 'Whoosh!', use: 'flying in the sky' },
      { name: 'Boat', emoji: '⛵', category: 'water', sound: 'Splash!', use: 'sailing on water' },
      { name: 'Train', emoji: '🚂', category: 'land', sound: 'Choo choo!', use: 'riding on tracks' },
      { name: 'Helicopter', emoji: '🚁', category: 'air', sound: 'Whop whop!', use: 'hovering and flying' }
    ];
    
    this.currentRound = 1;
    this.totalRounds = 10;
    this.currentVehicle = null;
    this.vehicleOptions = [];
    this.gameMode = 'identify'; // 'identify', 'category', 'sound'
    
    this.forceVisibleSetup();
  }
  
  forceVisibleSetup() {
    console.log('Force visible setup starting for VehicleAdventure...');
    
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
      background: linear-gradient(45deg, #2196f3, #03a9f4) !important;
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
          color: #2196f3 !important;
          margin: 0 0 20px 0 !important;
          font-size: 2.5rem !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
        ">🚗 Vehicle Adventure!</h1>
        <p style="margin: 10px 0 !important; font-size: 18px !important;">
          Explore amazing vehicles that travel on land, in air, and on water!
        </p>
        <button id="force-start-btn" style="
          background: linear-gradient(45deg, #2196f3, #1976d2) !important;
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
        ">🚀 START ADVENTURE</button>
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
            🎯 What vehicle is this?
          </h2>
          
          <div id="force-vehicle-display" style="
            background: rgba(33,150,243,0.1) !important;
            padding: 30px !important;
            border-radius: 20px !important;
            margin: 30px 0 !important;
          ">
            <div id="force-vehicle-emoji" style="
              font-size: 120px !important;
              margin: 20px auto !important;
              line-height: 1 !important;
            ">🚗</div>
            
            <h3 id="force-vehicle-name" style="
              color: #333 !important;
              margin: 20px 0 !important;
              font-size: 1.8rem !important;
              font-weight: bold !important;
              display: none !important;
            ">Car</h3>
            
            <div id="force-vehicle-info" style="
              background: rgba(33,150,243,0.2) !important;
              padding: 15px !important;
              border-radius: 10px !important;
              margin: 15px 0 !important;
            ">
              <p style="
                margin: 5px 0 !important;
                font-size: 16px !important;
                color: #555 !important;
              ">This vehicle travels on <span id="force-vehicle-category" style="font-weight: bold; color: #2196f3;">land</span></p>
              <p style="
                margin: 5px 0 !important;
                font-size: 16px !important;
                color: #555 !important;
              ">It makes a <span id="force-vehicle-sound" style="font-weight: bold; color: #2196f3;">vroom</span> sound</p>
              <p style="
                margin: 5px 0 !important;
                font-size: 16px !important;
                color: #555 !important;
              ">It's used for <span id="force-vehicle-use" style="font-weight: bold; color: #2196f3;">driving around</span></p>
            </div>
          </div>
          
          <p style="
            margin-bottom: 30px !important;
            font-size: 18px !important;
            color: #666 !important;
          ">Choose the correct answer:</p>
          
          <div id="force-vehicle-options" style="
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
            ">Next Vehicle</button>
            
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
            Score: <span id="force-score" style="color: #2196f3 !important; font-weight: bold !important;">0</span> | 
            Round: <span id="force-round" style="color: #ff9800 !important; font-weight: bold !important;">1</span>/10
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    const app = document.getElementById('app');
    if (app) app.style.display = 'none';
    
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) gameContainer.style.display = 'none';
    
    console.log('Force container created for VehicleAdventure');
    
    this.bindForceEvents();
    this.setupFirstRound();
  }
  
  bindForceEvents() {
    console.log('Binding force events for VehicleAdventure');
    
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
    this.currentVehicle = this.vehicles[0]; // Start with car
    this.vehicleOptions = [...this.vehicles].slice(0, 4); // Take first 4 vehicles
    this.vehicleOptions.sort(() => Math.random() - 0.5); // Shuffle
  }
  
  startForceGame() {
    console.log('Starting force vehicle adventure game');
    
    const startScreen = document.querySelector('#force-game-container > div:first-child');
    const gameArea = document.getElementById('force-game-area');
    
    if (startScreen) startScreen.style.display = 'none';
    if (gameArea) gameArea.style.display = 'flex';
    
    this.start();
    this.updateForceUI();
  }
  
  updateForceUI() {
    console.log('Updating force UI for vehicle:', this.currentVehicle.name);
    
    const emojiEl = document.getElementById('force-vehicle-emoji');
    const nameEl = document.getElementById('force-vehicle-name');
    const categoryEl = document.getElementById('force-vehicle-category');
    const soundEl = document.getElementById('force-vehicle-sound');
    const useEl = document.getElementById('force-vehicle-use');
    const scoreEl = document.getElementById('force-score');
    const roundEl = document.getElementById('force-round');
    const instructionEl = document.getElementById('force-instruction');
    
    if (emojiEl) emojiEl.textContent = this.currentVehicle.emoji;
    if (categoryEl) categoryEl.textContent = this.currentVehicle.category;
    if (soundEl) soundEl.textContent = this.currentVehicle.sound;
    if (useEl) useEl.textContent = this.currentVehicle.use;
    if (scoreEl) scoreEl.textContent = this.score;
    if (roundEl) roundEl.textContent = this.currentRound;
    
    // Update instruction and name visibility based on game mode
    if (this.gameMode === 'identify') {
      if (instructionEl) instructionEl.textContent = '🎯 What vehicle is this?';
      if (nameEl) nameEl.style.display = 'none';
    } else if (this.gameMode === 'category') {
      if (instructionEl) instructionEl.textContent = '🌍 Where does this vehicle travel?';
      if (nameEl) {
        nameEl.textContent = this.currentVehicle.name;
        nameEl.style.display = 'block';
      }
    } else if (this.gameMode === 'sound') {
      if (instructionEl) instructionEl.textContent = '🔊 What sound does this vehicle make?';
      if (nameEl) {
        nameEl.textContent = this.currentVehicle.name;
        nameEl.style.display = 'block';
      }
    }
    
    // Create vehicle options
    const optionsContainer = document.getElementById('force-vehicle-options');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      
      if (this.gameMode === 'identify') {
        this.vehicleOptions.forEach(vehicle => {
          const vehicleButton = document.createElement('div');
          vehicleButton.style.cssText = `
            background: rgba(255,255,255,0.95) !important;
            padding: 20px !important;
            border-radius: 15px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
            border: 3px solid transparent !important;
            text-align: center !important;
          `;
          
          vehicleButton.innerHTML = `
            <div style="
              font-size: 48px !important;
              margin-bottom: 10px !important;
              line-height: 1 !important;
            ">${vehicle.emoji}</div>
            <div style="
              font-size: 18px !important;
              color: #666 !important;
              font-weight: bold !important;
            ">${vehicle.name}</div>
          `;
          
          vehicleButton.addEventListener('click', () => {
            this.selectForceVehicle(vehicle, 'name');
          });
          
          this.addHoverEffect(vehicleButton);
          optionsContainer.appendChild(vehicleButton);
        });
      } else if (this.gameMode === 'category') {
        const categories = ['land', 'air', 'water'];
        const categoryEmojis = { land: '🛣️', air: '☁️', water: '🌊' };
        
        categories.forEach(category => {
          const categoryButton = document.createElement('div');
          categoryButton.style.cssText = `
            background: rgba(255,255,255,0.95) !important;
            padding: 20px !important;
            border-radius: 15px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
            border: 3px solid transparent !important;
            text-align: center !important;
          `;
          
          categoryButton.innerHTML = `
            <div style="
              font-size: 48px !important;
              margin-bottom: 10px !important;
              line-height: 1 !important;
            ">${categoryEmojis[category]}</div>
            <div style="
              font-size: 18px !important;
              color: #666 !important;
              font-weight: bold !important;
              text-transform: capitalize !important;
            ">${category}</div>
          `;
          
          categoryButton.addEventListener('click', () => {
            this.selectForceVehicle({ category }, 'category');
          });
          
          this.addHoverEffect(categoryButton);
          optionsContainer.appendChild(categoryButton);
        });
      } else if (this.gameMode === 'sound') {
        const sounds = this.vehicleOptions.map(v => v.sound);
        
        sounds.forEach(sound => {
          const soundButton = document.createElement('div');
          soundButton.style.cssText = `
            background: rgba(255,255,255,0.95) !important;
            padding: 20px !important;
            border-radius: 15px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
            border: 3px solid transparent !important;
            text-align: center !important;
          `;
          
          soundButton.innerHTML = `
            <div style="
              font-size: 24px !important;
              color: #2196f3 !important;
              font-weight: bold !important;
              margin-bottom: 10px !important;
            ">${sound}</div>
          `;
          
          soundButton.addEventListener('click', () => {
            this.selectForceVehicle({ sound }, 'sound');
          });
          
          this.addHoverEffect(soundButton);
          optionsContainer.appendChild(soundButton);
        });
      }
    }
    
    const nextBtn = document.getElementById('force-next-btn');
    const feedback = document.getElementById('force-feedback');
    
    if (nextBtn) nextBtn.style.display = 'none';
    if (feedback) feedback.innerHTML = '';
  }
  
  addHoverEffect(element) {
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'translateY(-4px)';
      element.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
      element.style.borderColor = '#2196f3';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translateY(0)';
      element.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      element.style.borderColor = 'transparent';
    });
  }
  
  selectForceVehicle(selected, type) {
    console.log('Checking:', selected, 'vs', this.currentVehicle);
    
    const feedback = document.getElementById('force-feedback');
    const nextBtn = document.getElementById('force-next-btn');
    let isCorrect = false;
    
    if (type === 'name' && selected.name === this.currentVehicle.name) {
      isCorrect = true;
    } else if (type === 'category' && selected.category === this.currentVehicle.category) {
      isCorrect = true;
    } else if (type === 'sound' && selected.sound === this.currentVehicle.sound) {
      isCorrect = true;
    }
    
    if (isCorrect) {
      this.updateScore(14);
      
      if (feedback) {
        let message = '';
        if (type === 'name') {
          message = `🎉 Perfect! That's a ${this.currentVehicle.name}!`;
        } else if (type === 'category') {
          message = `🎉 Correct! ${this.currentVehicle.name} travels on ${this.currentVehicle.category}!`;
        } else if (type === 'sound') {
          message = `🎉 Right! ${this.currentVehicle.name} goes ${this.currentVehicle.sound}`;
        }
        
        feedback.innerHTML = `
          <span style="color: #4caf50 !important; font-size: 24px !important;">
            ${message}
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
      this.updateScore(-3);
      
      if (feedback) {
        feedback.innerHTML = `
          <span style="color: #ff5722 !important; font-size: 20px !important;">
            ❌ Try again! Think about the vehicle ${this.currentVehicle.emoji}
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
    
    // Cycle through game modes
    const modes = ['identify', 'category', 'sound'];
    this.gameMode = modes[this.currentRound % 3];
    
    // Select new vehicle and options
    const maxVehicles = Math.min(3 + Math.floor(this.currentRound / 3), 6);
    const vehicleIndex = Math.floor(Math.random() * maxVehicles);
    this.currentVehicle = this.vehicles[vehicleIndex];
    
    // Create options
    this.vehicleOptions = [this.currentVehicle];
    while (this.vehicleOptions.length < 4) {
      const randomIndex = Math.floor(Math.random() * maxVehicles);
      const randomVehicle = this.vehicles[randomIndex];
      if (!this.vehicleOptions.find(opt => opt.name === randomVehicle.name)) {
        this.vehicleOptions.push(randomVehicle);
      }
    }
    this.vehicleOptions.sort(() => Math.random() - 0.5);
    
    this.updateForceUI();
  }
  
  completeForceGame() {
    console.log('Force vehicle adventure game completed with score:', this.score);
    
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
          ">🚗 Vehicle Explorer!</h2>
          
          <p style="
            font-size: 20px !important;
            margin-bottom: 15px !important;
            color: #333 !important;
          ">You discovered all the amazing vehicles!</p>
          
          <p style="
            font-size: 24px !important;
            margin-bottom: 30px !important;
            color: #2196f3 !important;
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
    console.log('Restarting force vehicle adventure game');
    this.score = 0;
    this.currentRound = 1;
    this.gameMode = 'identify';
    this.forceVisibleSetup();
  }
  
  exitForceGame() {
    console.log('Exiting force vehicle adventure game');
    
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
    console.log('Force Vehicle Adventure started!');
  }
  
  onGameEnd(reason) {
    console.log('Force Vehicle Adventure ended:', reason);
  }
  
  onScoreUpdate(oldScore, newScore) {
    console.log('Score updated:', oldScore, '->', newScore);
  }
  
  getHelpContent() {
    return 'Learn about different vehicles and where they travel - on land, in the air, or on water!';
  }
}

window.VehicleAdventureGame = VehicleAdventureGame;
console.log('VehicleAdventureGame loaded');
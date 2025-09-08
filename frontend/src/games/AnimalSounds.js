/**
 * Animal Sounds Game - Learn what sounds animals make!
 * Educational game for children aged 3-4 years
 */
class AnimalSoundsGame extends BaseGame {
  constructor() {
    super({
      id: 'animal-sounds',
      title: 'Animal Sounds Fun!',
      category: 'animals',
      ageGroup: '3-4',
      difficulty: 1,
      maxScore: 150,
      timeLimit: null
    });
    
    console.log('AnimalSounds constructor called');
    
    // Game properties
    this.animals = [
      { name: 'Cow', emoji: '🐮', sound: 'Moo!', audio: 'cow.mp3' },
      { name: 'Dog', emoji: '🐶', sound: 'Woof!', audio: 'dog.mp3' },
      { name: 'Cat', emoji: '🐱', sound: 'Meow!', audio: 'cat.mp3' },
      { name: 'Duck', emoji: '🦆', sound: 'Quack!', audio: 'duck.mp3' },
      { name: 'Pig', emoji: '🐷', sound: 'Oink!', audio: 'pig.mp3' },
      { name: 'Sheep', emoji: '🐑', sound: 'Baa!', audio: 'sheep.mp3' }
    ];
    
    this.currentRound = 1;
    this.totalRounds = 8;
    this.currentAnimal = null;
    this.soundOptions = [];
    
    this.forceVisibleSetup();
  }
  
  forceVisibleSetup() {
    console.log('Force visible setup starting for AnimalSounds...');
    
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
      background: linear-gradient(45deg, #ff9800, #ff5722) !important;
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
          color: #ff5722 !important;
          margin: 0 0 20px 0 !important;
          font-size: 2.5rem !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
        ">🐮 Animal Sounds Fun!</h1>
        <p style="margin: 10px 0 !important; font-size: 18px !important;">
          Learn what sounds different animals make! Listen and match the sounds.
        </p>
        <button id="force-start-btn" style="
          background: linear-gradient(45deg, #ff5722, #e64a19) !important;
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
        ">🎵 START LEARNING</button>
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
            🎵 What sound does this animal make?
          </h2>
          
          <div id="force-animal-display" style="
            background: rgba(255,152,0,0.1) !important;
            padding: 30px !important;
            border-radius: 20px !important;
            margin: 30px 0 !important;
          ">
            <div id="force-animal-emoji" style="
              font-size: 120px !important;
              margin: 20px auto !important;
              line-height: 1 !important;
            ">🐮</div>
            
            <h3 id="force-animal-name" style="
              color: #333 !important;
              margin: 20px 0 !important;
              font-size: 1.8rem !important;
              font-weight: bold !important;
            ">Cow</h3>
            
            <button id="force-play-sound-btn" style="
              background: #4caf50 !important;
              color: white !important;
              border: none !important;
              padding: 15px 25px !important;
              font-size: 16px !important;
              border-radius: 10px !important;
              cursor: pointer !important;
              margin: 10px !important;
            ">🔊 Hear the Sound</button>
          </div>
          
          <p style="
            margin-bottom: 30px !important;
            font-size: 18px !important;
            color: #666 !important;
          ">Click on the correct sound:</p>
          
          <div id="force-sound-options" style="
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
            ">Next Animal</button>
            
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
            Score: <span id="force-score" style="color: #ff5722 !important; font-weight: bold !important;">0</span> | 
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
    
    console.log('Force container created for AnimalSounds');
    
    this.bindForceEvents();
    this.setupFirstRound();
  }
  
  bindForceEvents() {
    console.log('Binding force events for AnimalSounds');
    
    const startBtn = document.getElementById('force-start-btn');
    const nextBtn = document.getElementById('force-next-btn');
    const exitBtn = document.getElementById('force-exit-btn');
    const playSoundBtn = document.getElementById('force-play-sound-btn');
    
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
    
    if (playSoundBtn) {
      playSoundBtn.addEventListener('click', () => {
        this.playAnimalSound();
      });
    }
  }
  
  setupFirstRound() {
    this.currentAnimal = this.animals[0]; // Start with cow
    this.soundOptions = [...this.animals].slice(0, 4); // Take first 4 animals
    this.soundOptions.sort(() => Math.random() - 0.5); // Shuffle
  }
  
  startForceGame() {
    console.log('Starting force animal sounds game');
    
    const startScreen = document.querySelector('#force-game-container > div:first-child');
    const gameArea = document.getElementById('force-game-area');
    
    if (startScreen) startScreen.style.display = 'none';
    if (gameArea) gameArea.style.display = 'flex';
    
    this.start();
    this.updateForceUI();
  }
  
  updateForceUI() {
    console.log('Updating force UI for animal:', this.currentAnimal.name);
    
    const emojiEl = document.getElementById('force-animal-emoji');
    const nameEl = document.getElementById('force-animal-name');
    const scoreEl = document.getElementById('force-score');
    const roundEl = document.getElementById('force-round');
    
    if (emojiEl) emojiEl.textContent = this.currentAnimal.emoji;
    if (nameEl) nameEl.textContent = this.currentAnimal.name;
    if (scoreEl) scoreEl.textContent = this.score;
    if (roundEl) roundEl.textContent = this.currentRound;
    
    // Create sound options
    const optionsContainer = document.getElementById('force-sound-options');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      
      this.soundOptions.forEach(animal => {
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
            color: #ff5722 !important;
            font-weight: bold !important;
            margin-bottom: 10px !important;
            font-family: Arial, sans-serif !important;
          ">${animal.sound}</div>
          <div style="
            font-size: 16px !important;
            color: #666 !important;
          ">${animal.emoji} ${animal.name}</div>
        `;
        
        soundButton.addEventListener('click', () => {
          console.log('Selected sound:', animal.sound);
          this.selectForceSound(animal);
        });
        
        soundButton.addEventListener('mouseenter', () => {
          soundButton.style.transform = 'translateY(-4px)';
          soundButton.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
          soundButton.style.borderColor = '#ff5722';
        });
        
        soundButton.addEventListener('mouseleave', () => {
          soundButton.style.transform = 'translateY(0)';
          soundButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          soundButton.style.borderColor = 'transparent';
        });
        
        optionsContainer.appendChild(soundButton);
      });
    }
    
    const nextBtn = document.getElementById('force-next-btn');
    const feedback = document.getElementById('force-feedback');
    
    if (nextBtn) nextBtn.style.display = 'none';
    if (feedback) feedback.innerHTML = '';
  }
  
  playAnimalSound() {
    console.log('Playing sound for:', this.currentAnimal.name);
    
    // Create a visual feedback for sound playing
    const playSoundBtn = document.getElementById('force-play-sound-btn');
    if (playSoundBtn) {
      const originalText = playSoundBtn.innerHTML;
      playSoundBtn.innerHTML = '🔊 Playing...';
      playSoundBtn.style.background = '#ff9800';
      
      // Simulate sound playing with visual feedback
      setTimeout(() => {
        playSoundBtn.innerHTML = originalText;
        playSoundBtn.style.background = '#4caf50';
      }, 1000);
    }
    
    // Show the sound in a speech bubble temporarily
    const feedback = document.getElementById('force-feedback');
    if (feedback) {
      feedback.innerHTML = `
        <span style="
          background: #4caf50 !important;
          color: white !important;
          padding: 10px 20px !important;
          border-radius: 20px !important;
          font-size: 18px !important;
          animation: fadeInOut 2s ease !important;
        ">${this.currentAnimal.sound}</span>
      `;
      
      setTimeout(() => {
        if (feedback.innerHTML.includes(this.currentAnimal.sound)) {
          feedback.innerHTML = '';
        }
      }, 2000);
    }
  }
  
  selectForceSound(selectedAnimal) {
    console.log('Checking:', selectedAnimal.sound, 'vs', this.currentAnimal.sound);
    
    const feedback = document.getElementById('force-feedback');
    const nextBtn = document.getElementById('force-next-btn');
    
    if (selectedAnimal.name === this.currentAnimal.name) {
      // Correct!
      this.updateScore(15);
      
      if (feedback) {
        feedback.innerHTML = `
          <span style="color: #4caf50 !important; font-size: 24px !important;">
            🎉 Perfect! A ${this.currentAnimal.name} says "${this.currentAnimal.sound}"
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
          <span style="color: #ff5722 !important; font-size: 20px !important;">
            ❌ Try again! Listen to the sound and pick the right one!
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
    
    // Select new animal and options
    const maxAnimals = Math.min(3 + Math.floor(this.currentRound / 3), 6);
    const animalIndex = Math.floor(Math.random() * maxAnimals);
    this.currentAnimal = this.animals[animalIndex];
    
    // Create options
    this.soundOptions = [this.currentAnimal];
    while (this.soundOptions.length < 4) {
      const randomIndex = Math.floor(Math.random() * maxAnimals);
      const randomAnimal = this.animals[randomIndex];
      if (!this.soundOptions.find(opt => opt.name === randomAnimal.name)) {
        this.soundOptions.push(randomAnimal);
      }
    }
    this.soundOptions.sort(() => Math.random() - 0.5);
    
    this.updateForceUI();
  }
  
  completeForceGame() {
    console.log('Force animal sounds game completed with score:', this.score);
    
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
          ">🎵 Animal Expert!</h2>
          
          <p style="
            font-size: 20px !important;
            margin-bottom: 15px !important;
            color: #333 !important;
          ">You learned all the animal sounds!</p>
          
          <p style="
            font-size: 24px !important;
            margin-bottom: 30px !important;
            color: #ff5722 !important;
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
    console.log('Restarting force animal sounds game');
    this.score = 0;
    this.currentRound = 1;
    this.forceVisibleSetup();
  }
  
  exitForceGame() {
    console.log('Exiting force animal sounds game');
    
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
    console.log('Force Animal Sounds started!');
  }
  
  onGameEnd(reason) {
    console.log('Force Animal Sounds ended:', reason);
  }
  
  onScoreUpdate(oldScore, newScore) {
    console.log('Score updated:', oldScore, '->', newScore);
  }
  
  getHelpContent() {
    return 'Listen to the animal and choose the correct sound it makes!';
  }
}

window.AnimalSoundsGame = AnimalSoundsGame;
console.log('AnimalSoundsGame loaded');
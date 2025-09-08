/**
 * Fixed GameLoader untuk mengatasi infinite loop
 */
class GameLoader {
  constructor() {
    this.games = {
      'color-matching': {
        id: 'color-matching',
        title: 'Color Matching Fun!',
        className: 'ColorMatchingGame',
        available: true
      },
      'number-learning': {
        id: 'number-learning', 
        title: 'Number Fun Adventure!',
        className: 'NumberLearningGame',
        available: true
      },
      'letter-learning': {
        id: 'letter-learning',
        title: 'Alphabet Adventure!', 
        className: 'LetterLearningGame',
        available: true
      },
      'shape-matching': {
        id: 'shape-matching',
        title: 'Shape Fun Adventure!',
        className: 'ShapeMatchingGame',
        available: true
      },
      'animal-sounds': {
        id: 'animal-sounds',
        title: 'Animal Sounds Fun!',
        className: 'AnimalSoundsGame',
        available: true // PERBAIKAN: Tambahkan available: true
      },
      'fruit-matching': {
        id: 'fruit-matching', 
        title: 'Fruit Fun!',
        className: 'FruitMatchingGame',
        available: true // PERBAIKAN: Tambahkan available: true
      },
      'vehicle-adventure': {
        id: 'vehicle-adventure',
        title: 'Vehicle Adventure!',
        className: 'VehicleAdventureGame',
        available: true // PERBAIKAN: Tambahkan available: true
      },
      'pattern-play': {
        id: 'pattern-play',
        title: 'Pattern Play!',
        className: 'PatternPlayGame',
        available: true // PERBAIKAN: Tambahkan available: true
      },
      'size-sorting': {
        id: 'size-sorting',
        title: 'Size Sorting!',
        className: 'SizeSortingGame',
        available: true // PERBAIKAN: Tambahkan available: true
      }
    };
    
    this.currentGame = null;
    this.isLaunching = false;
    this.isExiting = false;
    this.lastLaunchedGame = null;
    
    console.log('Game Loader initialized with games:', Object.keys(this.games));
  }
  
  async launchGame(gameId) {
    if (this.isLaunching || this.isExiting) {
      console.warn(`Cannot launch ${gameId} - operation in progress`);
      return;
    }
    
    if (this.lastLaunchedGame === gameId && this.currentGame) {
      console.warn(`Game ${gameId} is already running`);
      return;
    }
    
    const gameConfig = this.games[gameId];
    
    if (!gameConfig) {
      throw new Error(`Game ${gameId} not found`);
    }
    
    if (!gameConfig.available) {
      throw new Error(`Game ${gameConfig.title} not available`);
    }
    
    try {
      this.isLaunching = true;
      console.log(`Launching game: ${gameId}`);
      
      if (this.currentGame) {
        await this.closeCurrentGameSilently();
      }
      
      if (!window[gameConfig.className]) {
        throw new Error(`${gameConfig.className} class not loaded`);
      }
      
      this.prepareGameEnvironment();
      this.currentGame = new window[gameConfig.className]();
      this.lastLaunchedGame = gameId;
      this.updateURLSilently(gameId);
      
      console.log(`Game launched successfully: ${gameId}`);
      return this.currentGame;
      
    } catch (error) {
      console.error(`Failed to launch game ${gameId}:`, error);
      this.lastLaunchedGame = null;
      throw error;
    } finally {
      this.isLaunching = false;
    }
  }
  
  async closeCurrentGameSilently() {
    if (!this.currentGame) return;
    
    try {
      if (typeof this.currentGame.destroy === 'function') {
        this.currentGame.destroy();
      }
    } catch (error) {
      console.warn('Error destroying game:', error);
    }
    
    this.currentGame = null;
  }
  
  exitCurrentGame() {
    if (this.isExiting || this.isLaunching) {
      console.warn('Cannot exit - operation in progress');
      return;
    }
    
    try {
      this.isExiting = true;
      
      if (this.currentGame) {
        try {
          if (typeof this.currentGame.destroy === 'function') {
            this.currentGame.destroy();
          }
        } catch (error) {
          console.warn('Error destroying game:', error);
        }
        this.currentGame = null;
      }
      
      this.lastLaunchedGame = null;
      this.restoreMainApp();
      
      if (window.kidLearnApp && typeof window.kidLearnApp.navigateToScreen === 'function') {
        setTimeout(() => {
          window.kidLearnApp.navigateToScreen('games');
        }, 100);
      }
      
    } finally {
      this.isExiting = false;
    }
  }
  
  prepareGameEnvironment() {
    const app = document.getElementById('app');
    const gameContainer = document.getElementById('game-container');
    
    if (app) {
      app.style.display = 'none';
    }
    
    if (gameContainer) {
      gameContainer.style.display = 'flex';
      gameContainer.style.flexDirection = 'column';
      gameContainer.innerHTML = '';
    }
  }
  
  restoreMainApp() {
    const app = document.getElementById('app');
    const gameContainer = document.getElementById('game-container');
    
    if (gameContainer) {
      gameContainer.style.display = 'none';
      gameContainer.innerHTML = '';
    }
    
    if (app) {
      app.style.display = 'block';
    }
  }
  
  updateURLSilently(gameId) {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, `#${gameId}`);
    } else {
      const currentHandler = window.onhashchange;
      window.onhashchange = null;
      window.location.hash = gameId;
      
      setTimeout(() => {
        window.onhashchange = currentHandler;
      }, 100);
    }
  }
  
  getGameInfo(gameId) {
    return this.games[gameId] || null;
  }
  
  getAvailableGames() {
    return Object.values(this.games).filter(game => game.available);
  }
  
  isGameLoaded(gameId) {
    const gameConfig = this.games[gameId];
    return gameConfig && window[gameConfig.className];
  }
  
  getCurrentGame() {
    return this.currentGame;
  }
  
  isGameRunning() {
    return this.currentGame !== null;
  }
  
  destroy() {
    if (this.currentGame) {
      this.exitCurrentGame();
    }
    this.lastLaunchedGame = null;
  }
}

window.GameLoader = GameLoader;
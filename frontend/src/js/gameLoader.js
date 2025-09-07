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
    }
    };
    
    this.currentGame = null;
    this.isLaunching = false; // Prevent concurrent launches
    this.isExiting = false;   // Prevent concurrent exits
    this.lastLaunchedGame = null;
    
    console.log('Game Loader initialized');
  }
  
  async launchGame(gameId) {
    // Prevent concurrent launches or if already launching
    if (this.isLaunching || this.isExiting) {
      console.warn(`Cannot launch ${gameId} - operation in progress`);
      return;
    }
    
    // Prevent relaunching the same game immediately
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
      
      // Close current game if any (but don't navigate)
      if (this.currentGame) {
        await this.closeCurrentGameSilently();
      }
      
      // Check if game class exists
      if (!window[gameConfig.className]) {
        throw new Error(`${gameConfig.className} class not loaded`);
      }
      
      // Prepare game environment
      this.prepareGameEnvironment();
      
      // Create game instance
      this.currentGame = new window[gameConfig.className]();
      this.lastLaunchedGame = gameId;
      
      // Update URL without triggering hashchange
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
    // Prevent concurrent exits
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
      
      // Navigate to games screen without causing loop
      if (window.kidLearnApp && typeof window.kidLearnApp.navigateToScreen === 'function') {
        // Use setTimeout to break any potential call stack issues
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
      // Clear any previous game content
      gameContainer.innerHTML = '';
    }
  }
  
  restoreMainApp() {
    const app = document.getElementById('app');
    const gameContainer = document.getElementById('game-container');
    
    if (gameContainer) {
      gameContainer.style.display = 'none';
      gameContainer.innerHTML = ''; // Clean up
    }
    
    if (app) {
      app.style.display = 'block';
    }
  }
  
  updateURLSilently(gameId) {
    // Update URL without triggering hashchange event
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, `#${gameId}`);
    } else {
      // Fallback for older browsers - temporarily disable hashchange
      const currentHandler = window.onhashchange;
      window.onhashchange = null;
      window.location.hash = gameId;
      
      // Restore handler after a delay
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
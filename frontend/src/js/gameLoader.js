/**
 * Simple GameLoader for KidLearn Games
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
      }
    };
    
    this.currentGame = null;
    console.log('Game Loader initialized');
  }
  
  async launchGame(gameId) {
    const gameConfig = this.games[gameId];
    
    if (!gameConfig) {
      throw new Error(`Game ${gameId} not found`);
    }
    
    if (!gameConfig.available) {
      throw new Error(`Game ${gameConfig.title} not available`);
    }
    
    console.log(`Launching game: ${gameId}`);
    
    // Close current game if any
    if (this.currentGame) {
      this.exitCurrentGame();
    }
    
    // Check if game class exists
    if (!window[gameConfig.className]) {
      throw new Error(`${gameConfig.className} class not loaded`);
    }
    
    // Hide main app
    this.hideMainApp();
    
    // Create game instance
    this.currentGame = new window[gameConfig.className]();
    
    // Update URL
    window.location.hash = gameId;
    
    console.log(`Game launched successfully: ${gameId}`);
    return this.currentGame;
  }
  
  exitCurrentGame() {
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
    
    this.showMainApp();
    
    // Return to games screen
    if (window.kidLearnApp) {
      window.kidLearnApp.navigateToScreen('games');
    }
  }
  
  hideMainApp() {
    const app = document.getElementById('app');
    const gameContainer = document.getElementById('game-container');
    
    if (app) app.style.display = 'none';
    if (gameContainer) {
      gameContainer.style.display = 'flex';
      gameContainer.style.flexDirection = 'column';
    }
  }
  
  showMainApp() {
    const app = document.getElementById('app');
    const gameContainer = document.getElementById('game-container');
    
    if (gameContainer) gameContainer.style.display = 'none';
    if (app) app.style.display = 'block';
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
  
  destroy() {
    this.exitCurrentGame();
  }
}

window.GameLoader = GameLoader;
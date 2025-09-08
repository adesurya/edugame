/**
 * Fixed Main.js - Mengatasi Infinite Loop pada Routing
 */

class KidLearnApp {
  constructor() {
    this.currentScreen = 'home';
    this.currentGame = null;
    this.isNavigating = false; // Prevent navigation loops
    this.isGameLaunching = false; // Prevent game launch loops
    this.lastHash = ''; // Track hash changes
    
    this.user = {
      id: 'demo-user',
      username: 'Little Learner',
      totalScore: 0,
      gamesCompleted: 0,
      achievementsEarned: 0
    };
    
    this.games = {
      'color-matching': {
        id: 'color-matching',
        title: 'Color Matching Fun!',
        description: 'Match colors and learn their names!',
        icon: '🎨',
        className: 'ColorMatchingGame',
        available: true
      },
      'number-learning': {
        id: 'number-learning',
        title: 'Number Fun Adventure!',
        description: 'Learn to count from 1 to 10!',
        icon: '🔢',
        className: 'NumberLearningGame',
        available: true
      },
      'letter-learning': {
        id: 'letter-learning',
        title: 'Alphabet Adventure!',
        description: 'Discover the alphabet!',
        icon: '🔤',
        className: 'LetterLearningGame',
        available: true
      },
      'shape-matching': {
        id: 'shape-matching',
        title: 'Shape Fun Adventure!',
        description: 'Learn basic shapes through fun recognition!',
        icon: '🔴',
        className: 'ShapeMatchingGame',
        available: true
      },
      'animal-sounds': {
        id: 'animal-sounds',
        title: 'Animal Sounds Fun!',
        description: 'Learn what sounds animals make!',
        icon: '🐮',
        className: 'AnimalSoundsGame',
        available: true
      },
      'fruit-matching': {
        id: 'fruit-matching', 
        title: 'Fruit Fun!',
        description: 'Match fruits and learn their names!',
        icon: '🍎',
        className: 'FruitMatchingGame',
        available: true
      },
      'vehicle-adventure': {
        id: 'vehicle-adventure',
        title: 'Vehicle Adventure!', 
        description: 'Explore different types of vehicles!',
        icon: '🚗',
        className: 'VehicleAdventureGame',
        available: true
      },
      'pattern-play': {
        id: 'pattern-play',
        title: 'Pattern Play!',
        description: 'Complete simple patterns with shapes!', 
        icon: '🔴',
        className: 'PatternPlayGame',
        available: true
      },
      'size-sorting': {
        id: 'size-sorting',
        title: 'Size Sorting!',
        description: 'Sort objects by size - big and small!',
        icon: '📏', 
        className: 'SizeSortingGame',
        available: true
      }
    };
    
    this.components = {
      audioManager: null,
      progressManager: null,
      gameLoader: null,
      uiComponents: null
    };
    
    this.initialized = false;
    this.socket = null;
    this.initializationPromise = null;
    
    // Bind methods to preserve context
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleHashChange = this.handleHashChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    
    this.init();
  }
  
  async init() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = this._performInit();
    return this.initializationPromise;
  }
  
  async _performInit() {
    console.log('Initializing KidLearn Games...');
    
    try {
      await this.waitForDOMReady();
      await this.initializeSystems();
      this.loadUserData();
      this.setupEventListeners();
      this.setupRouting();
      this.navigateToScreen('home');
      
      this.initialized = true;
      console.log('KidLearn Games initialized successfully!');
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError('Failed to load the application. Some features may not work properly.');
      this.setupFallbackMode();
    }
  }
  
  async waitForDOMReady() {
    if (document.readyState === 'complete') {
      return;
    }
    
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }
  
  async initializeSystems() {
    console.log('Initializing systems...');
    
    // Initialize Audio Manager
    try {
      if (window.AudioManager) {
        this.components.audioManager = new window.AudioManager();
        window.audioManager = this.components.audioManager;
        console.log('✅ Audio Manager initialized');
      } else {
        this.components.audioManager = this.createFallbackAudioManager();
      }
    } catch (error) {
      console.warn('AudioManager initialization failed:', error);
      this.components.audioManager = this.createFallbackAudioManager();
    }
    
    // Initialize Progress Manager
    try {
      if (window.ProgressManager) {
        this.components.progressManager = new window.ProgressManager();
        window.progressManager = this.components.progressManager;
        console.log('✅ Progress Manager initialized');
      } else {
        this.components.progressManager = this.createFallbackProgressManager();
      }
    } catch (error) {
      console.warn('ProgressManager initialization failed:', error);
      this.components.progressManager = this.createFallbackProgressManager();
    }
    
    // Initialize UI Components
    try {
      if (window.UIComponents) {
        this.components.uiComponents = new window.UIComponents();
        window.uiComponents = this.components.uiComponents;
        console.log('✅ UI Components initialized');
      } else {
        this.components.uiComponents = this.createFallbackUIComponents();
      }
    } catch (error) {
      console.warn('UIComponents initialization failed:', error);
      this.components.uiComponents = this.createFallbackUIComponents();
    }
    
    // Initialize Game Loader
    try {
      if (window.GameLoader) {
        this.components.gameLoader = new window.GameLoader();
        window.gameLoader = this.components.gameLoader;
        console.log('✅ Game Loader initialized');
      } else {
        this.components.gameLoader = this.createFallbackGameLoader();
      }
    } catch (error) {
      console.warn('GameLoader initialization failed:', error);
      this.components.gameLoader = this.createFallbackGameLoader();
    }
  }
  
  createFallbackAudioManager() {
    return {
      masterVolume: 0.8,
      soundEffectsEnabled: true,
      musicEnabled: true,
      playSound: (sound) => console.log(`🔊 Playing sound: ${sound}`),
      setMasterVolume: (volume) => { this.masterVolume = volume; },
      toggleSoundEffects: (enabled) => { this.soundEffectsEnabled = enabled; },
      toggleMusic: (enabled) => { this.musicEnabled = enabled; }
    };
  }
  
  createFallbackProgressManager() {
    return {
      progressData: {},
      recordGameSession: () => {},
      getProgressSummary: () => ({ totalScore: 0, totalSessions: 0, totalAchievements: 0 }),
      getWeeklyStats: () => ({ gamesPlayed: 0, totalTime: 0, averageScore: 0 }),
      getGameProgress: () => null,
      exportProgress: () => ({ exportDate: new Date().toISOString(), progressData: {} })
    };
  }
  
  createFallbackUIComponents() {
    return {
      showNotification: (message, type = 'info') => {
        console.log(`${type.toUpperCase()}: ${message}`);
        this.showSimpleNotification(message, type);
      },
      showLoading: (message) => console.log(`Loading: ${message}`),
      hideLoading: () => console.log('Loading hidden')
    };
  }
  
  createFallbackGameLoader() {
    return {
      currentGame: null,
      isLaunching: false,
      launchGame: async (gameId) => {
        if (this.isGameLaunching) {
          console.warn('Game launch already in progress');
          return;
        }
        
        this.isGameLaunching = true;
        
        try {
          const game = this.games[gameId];
          if (!game) {
            throw new Error(`Game ${gameId} not found`);
          }
          
          if (!window[game.className]) {
            throw new Error(`${game.title} is not yet available. Please refresh the page.`);
          }
          
          // Hide main app
          const app = document.getElementById('app');
          const gameContainer = document.getElementById('game-container');
          
          if (app) app.style.display = 'none';
          if (gameContainer) {
            gameContainer.style.display = 'flex';
            gameContainer.style.flexDirection = 'column';
            gameContainer.innerHTML = ''; // Clear previous content
          }
          
          // Create game instance
          this.currentGame = new window[game.className]();
          
          // Update URL without causing hashchange loop
          this.updateURLSilently(gameId);
          
          console.log(`Game launched: ${gameId}`);
          
        } catch (error) {
          console.error(`Failed to launch game ${gameId}:`, error);
          this.showNotification(`Failed to start ${this.games[gameId]?.title || gameId}. Please try again.`, 'error');
          this.exitCurrentGame();
        } finally {
          this.isGameLaunching = false;
        }
      },
      exitCurrentGame: () => {
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
        
        const app = document.getElementById('app');
        const gameContainer = document.getElementById('game-container');
        
        if (gameContainer) {
          gameContainer.style.display = 'none';
          gameContainer.innerHTML = '';
        }
        if (app) app.style.display = 'block';
        
        // Navigate to games screen without causing loop
        setTimeout(() => {
          this.navigateToScreen('games');
        }, 100);
      }
    };
  }
  
  updateURLSilently(hash) {
    // Update URL without triggering hashchange
    this.lastHash = hash;
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, `#${hash}`);
    }
  }
  
  setupEventListeners() {
    // Remove existing listeners
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Add event listeners
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Settings handlers
    this.setupSettingsHandlers();
  }
  
  handleDocumentClick(e) {
    // Prevent multiple rapid clicks
    if (this.isNavigating || this.isGameLaunching) {
      e.preventDefault();
      return;
    }
    
    // Navigation buttons
    if (e.target.matches('.nav-btn')) {
      e.preventDefault();
      const route = e.target.dataset.route;
      if (route) {
        this.navigateToScreen(route);
      }
    }
    
    // Game launch buttons
    else if (e.target.matches('.btn-play-game, .btn-play') || e.target.closest('.btn-play-game, .btn-play')) {
      e.preventDefault();
      const button = e.target.matches('.btn-play-game, .btn-play') ? e.target : e.target.closest('.btn-play-game, .btn-play');
      const gameId = button.dataset.game;
      if (gameId && !this.isGameLaunching) {
        this.launchGame(gameId);
      }
    }
    
    // Age filter buttons
    else if (e.target.matches('.filter-btn')) {
      const age = e.target.dataset.age;
      this.filterGamesByAge(age);
      
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
    }
    
    // Settings buttons
    else if (e.target.matches('.btn-parent-dashboard')) {
      this.showNotification('Parent Dashboard feature coming soon!', 'info');
    }
    
    else if (e.target.matches('.btn-export-progress')) {
      this.exportProgress();
    }
  }
  
  handleKeyDown(e) {
    if (e.altKey) {
      switch(e.key) {
        case '1': e.preventDefault(); this.navigateToScreen('home'); break;
        case '2': e.preventDefault(); this.navigateToScreen('games'); break;
        case '3': e.preventDefault(); this.navigateToScreen('progress'); break;
        case '4': e.preventDefault(); this.navigateToScreen('settings'); break;
      }
    }
    
    // ESC key to exit games
    if (e.key === 'Escape' && this.currentGame) {
      this.exitCurrentGame();
    }
  }
  
  setupRouting() {
    // Remove existing hashchange listener
    window.removeEventListener('hashchange', this.handleHashChange);
    
    // Add new hashchange listener
    window.addEventListener('hashchange', this.handleHashChange);
    
    // Handle initial hash
    const initialHash = window.location.hash.slice(1);
    this.lastHash = initialHash;
    
    if (initialHash && this.games[initialHash]) {
      // Delay game launch to ensure everything is loaded
      setTimeout(() => {
        if (!this.isGameLaunching) {
          this.launchGame(initialHash);
        }
      }, 1000);
    } else if (initialHash && ['home', 'games', 'progress', 'settings'].includes(initialHash)) {
      this.currentScreen = initialHash;
    }
  }
  
  handleHashChange() {
    const hash = window.location.hash.slice(1);
    
    // Prevent processing same hash multiple times
    if (hash === this.lastHash) {
      return;
    }
    
    this.lastHash = hash;
    
    // Prevent hashchange loops during navigation
    if (this.isNavigating || this.isGameLaunching) {
      return;
    }
    
    console.log(`Hash changed to: ${hash}`);
    
    if (hash && this.games[hash]) {
      // Game route
      if (!this.isGameLaunching) {
        this.launchGame(hash);
      }
    } else if (hash && ['home', 'games', 'progress', 'settings'].includes(hash)) {
      // App route
      this.navigateToScreen(hash);
    } else if (!hash) {
      // Empty hash - go to home
      this.navigateToScreen('home');
    }
  }
  
  navigateToScreen(screenName) {
    if (!screenName || this.isNavigating) return;
    
    // Prevent navigation loops
    if (this.currentScreen === screenName) {
      return;
    }
    
    this.isNavigating = true;
    
    try {
      const currentScreenEl = document.querySelector('.screen.active');
      if (currentScreenEl) {
        currentScreenEl.classList.remove('active');
      }
      
      const targetScreenEl = document.getElementById(`${screenName}-screen`);
      if (targetScreenEl) {
        targetScreenEl.classList.add('active');
        this.currentScreen = screenName;
        
        this.updateNavigation();
        this.loadScreenContent(screenName);
        
        // Update URL without triggering hashchange
        this.updateURLSilently(screenName);
        
        if (this.components.audioManager && this.components.audioManager.playSound) {
          this.components.audioManager.playSound('click');
        }
      }
    } finally {
      // Release navigation lock after a delay
      setTimeout(() => {
        this.isNavigating = false;
      }, 300);
    }
  }
  
  updateNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.route === this.currentScreen) {
        btn.classList.add('active');
      }
    });
  }
  
  loadScreenContent(screenName) {
    switch (screenName) {
      case 'home': this.loadHomeContent(); break;
      case 'games': 
        this.loadGamesContent(); 
        console.log('Games content loaded');
        break;
      case 'progress': this.loadProgressContent(); break;
      case 'settings': this.loadSettingsContent(); break;
    }
  }
  
  async launchGame(gameId) {
    if (this.isGameLaunching) {
      console.warn('Game launch already in progress');
      return;
    }
    
    const game = this.games[gameId];
    
    if (!game) {
      console.error(`Game ${gameId} not found`);
      return;
    }
    
    if (!game.available) {
      this.showNotification(`${game.title} is coming soon!`, 'info');
      return;
    }
    
    try {
      console.log(`Launching game: ${game.title}`);
      
      if (this.components.gameLoader && this.components.gameLoader.launchGame) {
        await this.components.gameLoader.launchGame(gameId);
      } else {
        await this.launchGameDirect(gameId);
      }
      
    } catch (error) {
      console.error(`Failed to launch game ${gameId}:`, error);
      this.showNotification(`Failed to load ${game.title}. Please try again.`, 'error');
    }
  }
  
  async launchGameDirect(gameId) {
    const game = this.games[gameId];
    
    if (!window[game.className]) {
      throw new Error(`${game.className} class not loaded`);
    }
    
    const app = document.getElementById('app');
    const gameContainer = document.getElementById('game-container');
    
    if (app) app.style.display = 'none';
    if (gameContainer) {
      gameContainer.style.display = 'flex';
      gameContainer.style.flexDirection = 'column';
      gameContainer.innerHTML = '';
    }
    
    this.currentGame = new window[game.className]();
    this.updateURLSilently(gameId);
  }
  
  exitCurrentGame() {
    if (this.components.gameLoader && this.components.gameLoader.exitCurrentGame) {
      this.components.gameLoader.exitCurrentGame();
    } else {
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
      
      const app = document.getElementById('app');
      const gameContainer = document.getElementById('game-container');
      
      if (gameContainer) {
        gameContainer.style.display = 'none';
        gameContainer.innerHTML = '';
      }
      if (app) app.style.display = 'block';
      
      setTimeout(() => {
        this.navigateToScreen('games');
      }, 100);
    }
  }
  
  loadUserData() {
    try {
      const localData = localStorage.getItem('kidlearn-user');
      if (localData) {
        const userData = JSON.parse(localData);
        this.user = { ...this.user, ...userData };
      }
      
      if (this.components.progressManager) {
        const summary = this.components.progressManager.getProgressSummary();
        this.user.totalScore = summary.totalScore || 0;
        this.user.gamesCompleted = summary.totalSessions || 0;
        this.user.achievementsEarned = summary.totalAchievements || 0;
      }
      
      this.updateUserDisplay();
    } catch (error) {
      console.warn('Failed to load user data:', error);
    }
  }
  
  setupFallbackMode() {
    console.log('Setting up fallback mode...');
    this.setupEventListeners();
    this.setupRouting();
    this.loadUserData();
    this.navigateToScreen('home');
    this.initialized = true;
    console.log('Fallback mode ready');
  }
  
  showSimpleNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span>${this.getNotificationIcon(type)} ${message}</span>
      <button class="close-btn" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: 'Comic Neue', cursive;
      max-width: 300px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      background: ${this.getNotificationColor(type)};
      color: white;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }
  
  getNotificationIcon(type) {
    const icons = { success: '✅', error: '⚠️', warning: '⚠️', info: 'ℹ️' };
    return icons[type] || icons.info;
  }
  
  getNotificationColor(type) {
    const colors = { success: '#4CAF50', error: '#f44336', warning: '#FF9800', info: '#2196F3' };
    return colors[type] || colors.info;
  }
  
  showNotification(message, type = 'info') {
    if (this.components.uiComponents && this.components.uiComponents.showNotification) {
      this.components.uiComponents.showNotification(message, type);
    } else {
      this.showSimpleNotification(message, type);
    }
  }
  
  showError(message) {
    console.error('App Error:', message);
    this.showNotification(message, 'error');
  }
  
  // Placeholder methods for content loading
  loadHomeContent() {
    const elements = {
      totalScore: document.getElementById('total-score'),
      gamesCompleted: document.getElementById('games-completed'),
      achievementsEarned: document.getElementById('achievements-earned')
    };
    
    if (elements.totalScore) elements.totalScore.textContent = this.user.totalScore;
    if (elements.gamesCompleted) elements.gamesCompleted.textContent = this.user.gamesCompleted;
    if (elements.achievementsEarned) elements.achievementsEarned.textContent = this.user.achievementsEarned;
  }
  
  loadGamesContent() {
    // Games content is static in HTML
  }
  
  loadProgressContent() {
    // Implement progress loading
  }
  
  loadSettingsContent() {
    // Implement settings loading
  }
  
  filterGamesByAge(ageGroup) {
    document.querySelectorAll('.game-card').forEach(card => {
      const cardAge = card.dataset.age;
      const shouldShow = ageGroup === 'all' || cardAge === ageGroup || 
                        (ageGroup === '5-6' && (cardAge === '4-6' || cardAge === '5-6'));
      card.style.display = shouldShow ? 'block' : 'none';
    });
  }
  
  setupSettingsHandlers() {
    const volumeSlider = document.getElementById('master-volume');
    const volumeValue = document.getElementById('volume-value');
    
    if (volumeSlider && volumeValue) {
      volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value;
        volumeValue.textContent = `${volume}%`;
        if (this.components.audioManager && this.components.audioManager.setMasterVolume) {
          this.components.audioManager.setMasterVolume(volume / 100);
        }
        this.saveSettings();
      });
    }
    
    const musicToggle = document.getElementById('music-enabled');
    if (musicToggle) {
      musicToggle.addEventListener('change', (e) => {
        if (this.components.audioManager && this.components.audioManager.toggleMusic) {
          this.components.audioManager.toggleMusic(e.target.checked);
        }
        this.saveSettings();
      });
    }
    
    const soundToggle = document.getElementById('sound-effects');
    if (soundToggle) {
      soundToggle.addEventListener('change', (e) => {
        if (this.components.audioManager && this.components.audioManager.toggleSoundEffects) {
          this.components.audioManager.toggleSoundEffects(e.target.checked);
        }
        this.saveSettings();
      });
    }
  }
  
  saveSettings() {
    try {
      const settings = {
        volume: parseInt(document.getElementById('master-volume')?.value || 80),
        musicEnabled: document.getElementById('music-enabled')?.checked ?? true,
        soundEffectsEnabled: document.getElementById('sound-effects')?.checked ?? true
      };
      
      localStorage.setItem('kidlearn-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }
  
  updateUserDisplay() {
    const usernameEl = document.getElementById('username');
    if (usernameEl) {
      usernameEl.textContent = this.user.username;
    }
  }
  
  exportProgress() {
    try {
      let progressData = { 
        user: this.user, 
        games: this.games, 
        exportDate: new Date().toISOString() 
      };
      
      if (this.components.progressManager && this.components.progressManager.exportProgress) {
        progressData = this.components.progressManager.exportProgress();
        progressData.user = this.user;
        progressData.games = this.games;
      }
      
      const dataStr = JSON.stringify(progressData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `kidlearn-progress-${this.user.username}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      this.showNotification('Progress data exported successfully!', 'success');
    } catch (error) {
      console.error('Failed to export progress:', error);
      this.showNotification('Failed to export progress data. Please try again.', 'error');
    }
  }
  
  onGameCompleted(gameId, gameData) {
    const { score = 0, achievements = [], timeSpent = 0 } = gameData;
    
    this.user.totalScore += score;
    this.user.gamesCompleted += 1;
    this.user.achievementsEarned += achievements.length;
    
    try {
      localStorage.setItem('kidlearn-user', JSON.stringify(this.user));
    } catch (error) {
      console.warn('Failed to save user data:', error);
    }
    
    if (this.components.progressManager && this.components.progressManager.recordGameSession) {
      this.components.progressManager.recordGameSession(gameId, gameData);
    }
    
    if (this.socket) {
      this.socket.emit('game-completed', {
        userId: this.user.id,
        gameId: gameId,
        finalScore: score,
        achievements: achievements
      });
    }
    
    this.updateUserDisplay();
  }
  
  destroy() {
    // Clean up event listeners
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('hashchange', this.handleHashChange);
    
    // End progress session
    if (this.components.progressManager && this.components.progressManager.endSession) {
      this.components.progressManager.endSession();
    }
    
    // Destroy components
    Object.values(this.components).forEach(component => {
      if (component && component.destroy) {
        try {
          component.destroy();
        } catch (error) {
          console.warn('Error destroying component:', error);
        }
      }
    });
    
    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect();
    }
    
    console.log('KidLearn App destroyed');
  }
}

// Safe initialization dengan throttling
(function() {
  'use strict';
  
  // Prevent multiple initialization
  if (window.kidLearnApp) {
    console.warn('KidLearn App already initialized');
    return;
  }
  
  // Throttle initialization
  let initTimeout;
  
  function initApp() {
    if (initTimeout) {
      clearTimeout(initTimeout);
    }
    
    initTimeout = setTimeout(() => {
      try {
        console.log('Starting KidLearn Games App...');
        window.kidLearnApp = new KidLearnApp();
        window.KidLearnApp = KidLearnApp;
        
      } catch (error) {
        console.error('Critical error starting KidLearn Games App:', error);
        
        // Show user-friendly error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
          <h3>Startup Error</h3>
          <p>The application failed to start properly.</p>
          <p>Please refresh the page to try again.</p>
          <button onclick="window.location.reload()">Refresh Page</button>
        `;
        document.body.appendChild(errorDiv);
        
        // Hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
      }
    }, 100);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (window.kidLearnApp && window.kidLearnApp.destroy) {
      window.kidLearnApp.destroy();
    }
  });
  
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KidLearnApp;
} else {
  window.KidLearnApp = KidLearnApp;
}
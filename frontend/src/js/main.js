/**
 * KidLearn Games - Main Application Controller (Robust Version)
 */

class KidLearnApp {
  constructor() {
    this.currentScreen = 'home';
    this.currentGame = null;
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
    
    this.init();
  }
  
  async init() {
    console.log('Initializing KidLearn Games...');
    
    try {
      this.showLoadingProgress();
      await this.initializeSystems();
      this.loadUserData();
      this.setupEventListeners();
      this.setupRouting();
      this.hideLoadingScreen();
      this.navigateToScreen('home');
      
      this.initialized = true;
      console.log('KidLearn Games initialized successfully!');
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showErrorAndHideLoading('Failed to load the application. Please refresh the page.');
    }
  }
  
  showLoadingProgress() {
    const progressBar = document.getElementById('loading-progress');
    if (progressBar) {
      let progress = 0;
      this.loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(this.loadingInterval);
        }
        progressBar.style.width = `${progress}%`;
      }, 200);
    }
  }
  
  hideLoadingScreen() {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
    }
    
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    if (loadingScreen && app) {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          app.style.opacity = '1';
        }, 500);
      }, 1000);
    }
  }
  
  showErrorAndHideLoading(message) {
    this.hideLoadingScreen();
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #f44336;
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      z-index: 10000;
      font-family: 'Comic Neue', cursive;
      max-width: 400px;
    `;
    errorDiv.innerHTML = `
      <h3>Oops! Something went wrong</h3>
      <p>${message}</p>
      <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; background: white; color: #f44336; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
    `;
    document.body.appendChild(errorDiv);
  }
  
  async initializeSystems() {
    const systems = [
      { name: 'AudioManager', check: () => window.AudioManager },
      { name: 'ProgressManager', check: () => window.ProgressManager },
      { name: 'UIComponents', check: () => window.UIComponents },
      { name: 'GameLoader', check: () => window.GameLoader }
    ];
    
    // Wait for systems to be available
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      const allLoaded = systems.every(system => system.check());
      if (allLoaded) break;
      
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    // Initialize components with error handling
    try {
      if (window.AudioManager) {
        this.components.audioManager = new window.AudioManager();
        window.audioManager = this.components.audioManager;
      }
    } catch (error) {
      console.warn('AudioManager initialization failed:', error);
    }
    
    try {
      if (window.ProgressManager) {
        this.components.progressManager = new window.ProgressManager();
        window.progressManager = this.components.progressManager;
      }
    } catch (error) {
      console.warn('ProgressManager initialization failed:', error);
    }
    
    try {
      if (window.UIComponents) {
        this.components.uiComponents = new window.UIComponents();
        window.uiComponents = this.components.uiComponents;
      }
    } catch (error) {
      console.warn('UIComponents initialization failed:', error);
    }
    
    try {
      if (window.GameLoader) {
        this.components.gameLoader = new window.GameLoader();
        window.gameLoader = this.components.gameLoader;
      }
    } catch (error) {
      console.warn('GameLoader initialization failed:', error);
    }
    
    // Initialize socket if available
    if (window.io) {
      try {
        this.socket = window.io();
        this.socket.on('connect', () => {
          if (this.user?.id) {
            this.socket.emit('join-user-room', this.user.id);
          }
        });
      } catch (error) {
        console.warn('Socket initialization failed:', error);
      }
    }
  }
  
  loadUserData() {
    try {
      const localData = localStorage.getItem('kidlearn-user');
      if (localData) {
        const userData = JSON.parse(localData);
        this.user = { ...this.user, ...userData };
      }
      
      // Load progress summary if available
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
  
  setupEventListeners() {
    // Navigation buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-btn')) {
        const route = e.target.dataset.route;
        if (route) {
          this.navigateToScreen(route);
        }
      }
      
      // Game launch buttons
      if (e.target.matches('.btn-play-game, .btn-play') || e.target.closest('.btn-play-game, .btn-play')) {
        e.preventDefault();
        const button = e.target.matches('.btn-play-game, .btn-play') ? e.target : e.target.closest('.btn-play-game, .btn-play');
        const gameId = button.dataset.game;
        if (gameId) {
          this.launchGame(gameId);
        }
      }
      
      // Age filter buttons
      if (e.target.matches('.filter-btn')) {
        const age = e.target.dataset.age;
        this.filterGamesByAge(age);
        
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      }
    });
    
    // Settings handlers
    this.setupSettingsHandlers();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.altKey) {
        switch(e.key) {
          case '1': e.preventDefault(); this.navigateToScreen('home'); break;
          case '2': e.preventDefault(); this.navigateToScreen('games'); break;
          case '3': e.preventDefault(); this.navigateToScreen('progress'); break;
          case '4': e.preventDefault(); this.navigateToScreen('settings'); break;
        }
      }
    });
    
    // Visibility change handling
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.components.audioManager) {
          this.components.audioManager.stopMusic();
        }
      } else {
        if (this.components.audioManager) {
          this.components.audioManager.playMusic();
        }
      }
    });
    
    // Page unload handling
    window.addEventListener('beforeunload', () => {
      if (this.components.progressManager) {
        this.components.progressManager.endSession();
      }
    });
  }
  
  setupRouting() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      if (hash && this.games[hash]) {
        this.launchGame(hash);
      } else if (hash && ['home', 'games', 'progress', 'settings'].includes(hash)) {
        this.navigateToScreen(hash);
      }
    });
    
    const initialHash = window.location.hash.slice(1);
    if (initialHash && this.games[initialHash]) {
      setTimeout(() => this.launchGame(initialHash), 2000);
    } else if (initialHash && ['home', 'games', 'progress', 'settings'].includes(initialHash)) {
      this.currentScreen = initialHash;
    }
  }
  
  navigateToScreen(screenName) {
    if (!this.initialized) return;
    
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
      
      if (window.location.hash.slice(1) !== screenName) {
        window.location.hash = screenName;
      }
      
      if (this.components.audioManager) {
        this.components.audioManager.playSound('click');
      }
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
      case 'games': this.loadGamesContent(); break;
      case 'progress': this.loadProgressContent(); break;
      case 'settings': this.loadSettingsContent(); break;
    }
  }
  
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
    // Games are already in HTML, just update progress if available
    document.querySelectorAll('.game-card').forEach(card => {
      const gameId = card.dataset.game;
      if (this.components.progressManager && this.games[gameId]) {
        const progress = this.components.progressManager.getGameProgress(gameId);
        if (progress) {
          const progressCircle = card.querySelector('.progress-circle');
          if (progressCircle) {
            const percentage = Math.min(100, (progress.totalPlays / 10) * 100);
            progressCircle.style.background = `conic-gradient(#4CAF50 ${percentage * 3.6}deg, #f0f0f0 0deg)`;
          }
        }
      }
    });
  }
  
  loadProgressContent() {
    this.loadWeeklyStats();
    this.loadAchievements();
    this.loadGameProgress();
  }
  
  loadSettingsContent() {
    this.loadSettingsValues();
  }
  
  filterGamesByAge(ageGroup) {
    document.querySelectorAll('.game-card').forEach(card => {
      const cardAge = card.dataset.age;
      const shouldShow = ageGroup === 'all' || cardAge === ageGroup || 
                        (ageGroup === '5-6' && (cardAge === '4-6' || cardAge === '5-6'));
      card.style.display = shouldShow ? 'block' : 'none';
    });
  }
  
  async launchGame(gameId) {
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
      
      if (this.components.uiComponents) {
        this.components.uiComponents.showLoading(`Loading ${game.title}...`);
      }
      
      if (this.components.gameLoader) {
        this.currentGame = await this.components.gameLoader.launchGame(gameId);
      } else {
        await this.launchGameFallback(gameId);
      }
      
      if (this.components.uiComponents) {
        this.components.uiComponents.hideLoading();
      }
      
    } catch (error) {
      console.error(`Failed to launch game ${gameId}:`, error);
      
      if (this.components.uiComponents) {
        this.components.uiComponents.hideLoading();
        this.components.uiComponents.showNotification(`Failed to load ${game.title}. Please try again.`, 'error');
      } else {
        this.showNotification(`Failed to load ${game.title}. Please try again.`, 'error');
      }
      
      this.exitCurrentGame();
    }
  }
  
  async launchGameFallback(gameId) {
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
    }
    
    this.currentGame = new window[game.className]();
    window.location.hash = gameId;
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
    
    const app = document.getElementById('app');
    const gameContainer = document.getElementById('game-container');
    
    if (gameContainer) gameContainer.style.display = 'none';
    if (app) app.style.display = 'block';
    
    this.navigateToScreen('games');
  }
  
  setupSettingsHandlers() {
    const volumeSlider = document.getElementById('master-volume');
    const volumeValue = document.getElementById('volume-value');
    
    if (volumeSlider && volumeValue) {
      volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value;
        volumeValue.textContent = `${volume}%`;
        if (this.components.audioManager) {
          this.components.audioManager.setMasterVolume(volume / 100);
        }
        this.saveSettings();
      });
    }
    
    const musicToggle = document.getElementById('music-enabled');
    if (musicToggle) {
      musicToggle.addEventListener('change', (e) => {
        if (this.components.audioManager) {
          this.components.audioManager.toggleMusic(e.target.checked);
        }
        this.saveSettings();
      });
    }
    
    const soundToggle = document.getElementById('sound-effects');
    if (soundToggle) {
      soundToggle.addEventListener('change', (e) => {
        if (this.components.audioManager) {
          this.components.audioManager.toggleSoundEffects(e.target.checked);
        }
        this.saveSettings();
      });
    }
    
    const parentDashboardBtn = document.querySelector('.btn-parent-dashboard');
    if (parentDashboardBtn) {
      parentDashboardBtn.addEventListener('click', () => {
        this.showNotification('Parent Dashboard feature coming soon!', 'info');
      });
    }
    
    const exportBtn = document.querySelector('.btn-export-progress');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportProgress();
      });
    }
  }
  
  updateUserDisplay() {
    const usernameEl = document.getElementById('username');
    if (usernameEl) {
      usernameEl.textContent = this.user.username;
    }
  }
  
  loadWeeklyStats() {
    const weeklyStats = document.getElementById('weekly-stats');
    if (!weeklyStats) return;
    
    let stats = { gamesPlayed: 0, totalTime: 0, averageScore: 0 };
    
    if (this.components.progressManager) {
      stats = this.components.progressManager.getWeeklyStats();
    }
    
    weeklyStats.innerHTML = `
      <div class="weekly-stat">
        <div class="stat-label">Games Played</div>
        <div class="stat-value">${stats.gamesPlayed}</div>
      </div>
      <div class="weekly-stat">
        <div class="stat-label">Play Time</div>
        <div class="stat-value">${Math.round(stats.totalTime / 60)}min</div>
      </div>
      <div class="weekly-stat">
        <div class="stat-label">Average Score</div>
        <div class="stat-value">${stats.averageScore}</div>
      </div>
    `;
  }
  
  loadAchievements() {
    const achievementsGrid = document.getElementById('achievements-grid');
    if (!achievementsGrid) return;
    
    const defaultAchievements = [
      { name: 'First Steps', earned: this.user.gamesCompleted > 0, icon: '🏆' },
      { name: 'Color Master', earned: false, icon: '🎨' },
      { name: 'Quick Learner', earned: false, icon: '⚡' },
      { name: 'Explorer', earned: false, icon: '🌟' }
    ];
    
    achievementsGrid.innerHTML = defaultAchievements.map(achievement => `
      <div class="achievement-badge ${achievement.earned ? '' : 'locked'}">
        <div class="achievement-icon">${achievement.earned ? achievement.icon : '🔒'}</div>
        <div class="achievement-name">${achievement.name}</div>
      </div>
    `).join('');
  }
  
  loadGameProgress() {
    const progressList = document.getElementById('progress-list');
    if (!progressList) return;
    
    const availableGames = Object.values(this.games).filter(game => game.available);
    
    progressList.innerHTML = availableGames.map(game => {
      let progress = null;
      if (this.components.progressManager) {
        progress = this.components.progressManager.getGameProgress(game.id);
      }
      
      const bestScore = progress?.bestScore || 0;
      const totalPlays = progress?.totalPlays || 0;
      const progressPercentage = Math.min(100, (totalPlays / 10) * 100);
      
      return `
        <div class="game-progress-item">
          <div class="game-icon">${game.icon}</div>
          <div class="game-details">
            <h4>${game.title}</h4>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercentage}%;"></div>
            </div>
            <div class="progress-stats">Best Score: ${bestScore} | Times Played: ${totalPlays}</div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  loadSettingsValues() {
    try {
      const settings = JSON.parse(localStorage.getItem('kidlearn-settings') || '{}');
      
      const volumeSlider = document.getElementById('master-volume');
      const volumeValue = document.getElementById('volume-value');
      if (volumeSlider && settings.volume !== undefined) {
        volumeSlider.value = settings.volume;
        if (volumeValue) volumeValue.textContent = `${settings.volume}%`;
      }
      
      const musicToggle = document.getElementById('music-enabled');
      if (musicToggle && settings.musicEnabled !== undefined) {
        musicToggle.checked = settings.musicEnabled;
      }
      
      const soundToggle = document.getElementById('sound-effects');
      if (soundToggle && settings.soundEffectsEnabled !== undefined) {
        soundToggle.checked = settings.soundEffectsEnabled;
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
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
  
  showNotification(message, type = 'info') {
    if (this.components.uiComponents) {
      this.components.uiComponents.showNotification(message, type);
    } else {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: 'Comic Neue', cursive;
        max-width: 300px;
      `;
      
      const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
      notification.innerHTML = `${icon} ${message}`;
      
      document.body.appendChild(notification);
      
      setTimeout(() => notification.remove(), 5000);
    }
  }
  
  exportProgress() {
    try {
      let progressData = { 
        user: this.user, 
        games: this.games, 
        exportDate: new Date().toISOString() 
      };
      
      if (this.components.progressManager) {
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
    
    localStorage.setItem('kidlearn-user', JSON.stringify(this.user));
    
    if (this.components.progressManager) {
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
    if (this.components.progressManager) {
      this.components.progressManager.endSession();
    }
    
    Object.values(this.components).forEach(component => {
      if (component && component.destroy) {
        component.destroy();
      }
    });
    
    if (this.socket) {
      this.socket.disconnect();
    }
    
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    try {
      window.kidLearnApp = new KidLearnApp();
    } catch (error) {
      console.error('Failed to start KidLearn Games App:', error);
      
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #f44336;
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        z-index: 10000;
        font-family: 'Comic Neue', cursive;
      `;
      errorDiv.innerHTML = `
        <h3>Oops! Something went wrong</h3>
        <p>Please refresh the page to try again.</p>
        <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; background: white; color: #f44336; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
      `;
      document.body.appendChild(errorDiv);
      
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.display = 'none';
      }
    }
  }, 1000);
});

window.KidLearnApp = KidLearnApp;
/**
 * KidLearn Games - Main Application Controller
 * Handles navigation, initialization, and core app functionality
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
    
    // Available games registry
    this.games = {
      'color-matching': {
        id: 'color-matching',
        title: 'Color Matching Fun!',
        description: 'Match colors and learn their names!',
        category: 'colors',
        ageGroup: '3-4',
        difficulty: 1,
        estimatedTime: 5,
        icon: '🎨',
        className: 'ColorMatchingGame',
        available: true
      },
      'number-fun': {
        id: 'number-fun',
        title: 'Number Fun',
        description: 'Learn to count from 1 to 10!',
        category: 'numbers',
        ageGroup: '3-4',
        difficulty: 1,
        estimatedTime: 7,
        icon: '🔢',
        available: false
      },
      'letter-learning': {
        id: 'letter-learning',
        title: 'Letter Learning',
        description: 'Discover the alphabet!',
        category: 'letters',
        ageGroup: '4-5',
        difficulty: 2,
        estimatedTime: 10,
        icon: '🔤',
        available: false
      }
    };
    
    this.socket = null;
    this.audioManager = null;
    this.progressManager = null;
    
    this.init();
  }
  
  /**
   * Initialize the application
   */
  async init() {
    console.log('🎮 Initializing KidLearn Games...');
    
    try {
      // Show loading screen
      this.showLoadingScreen();
      
      // Initialize core systems
      await this.initializeSystems();
      
      // Load user data
      await this.loadUserData();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Setup routing
      this.setupRouting();
      
      // Hide loading screen and show app
      this.hideLoadingScreen();
      
      // Navigate to initial screen
      this.navigateToScreen('home');
      
      console.log('✅ KidLearn Games initialized successfully!');
      
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      this.showErrorMessage('Failed to load the application. Please refresh the page.');
    }
  }
  
  /**
   * Show loading screen with progress
   */
  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('loading-progress');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      progressBar.style.width = `${progress}%`;
    }, 200);
  }
  
  /**
   * Hide loading screen and show main app
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        app.style.display = 'block';
        app.style.opacity = '0';
        
        // Fade in app
        setTimeout(() => {
          app.style.transition = 'opacity 0.5s ease';
          app.style.opacity = '1';
        }, 50);
      }, 500);
    }, 1000);
  }
  
  /**
   * Initialize core systems
   */
  async initializeSystems() {
    // Initialize Socket.io for real-time features
    this.socket = io();
    
    // Initialize audio manager
    this.audioManager = new AudioManager();
    window.audioManager = this.audioManager;
    
    // Initialize progress manager
    this.progressManager = new ProgressManager();
    window.progressManager = this.progressManager;
    
    // Join user room for real-time updates
    if (this.socket) {
      this.socket.emit('join-user-room', this.user.id);
    }
  }
  
  /**
   * Load user data from local storage and server
   */
  async loadUserData() {
    try {
      // Load from localStorage first
      const localData = localStorage.getItem('kidlearn-user');
      if (localData) {
        const userData = JSON.parse(localData);
        this.user = { ...this.user, ...userData };
      }
      
      // TODO: Load from server when authentication is implemented
      // const serverData = await this.fetchUserData();
      
      this.updateUserDisplay();
      
    } catch (error) {
      console.warn('Failed to load user data:', error);
    }
  }
  
  /**
   * Setup event listeners for navigation and interactions
   */
  setupEventListeners() {
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const route = e.target.dataset.route;
        this.navigateToScreen(route);
      });
    });
    
    // Game launch buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn-play-game') || e.target.closest('.btn-play-game')) {
        const button = e.target.matches('.btn-play-game') ? e.target : e.target.closest('.btn-play-game');
        const gameId = button.dataset.game;
        this.launchGame(gameId);
      }
      
      if (e.target.matches('.btn-play') || e.target.closest('.btn-play')) {
        const button = e.target.matches('.btn-play') ? e.target : e.target.closest('.btn-play');
        const gameId = button.dataset.game;
        this.launchGame(gameId);
      }
    });
    
    // Age filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const age = e.target.dataset.age;
        this.filterGamesByAge(age);
        
        // Update active filter
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
    
    // Settings handlers
    this.setupSettingsHandlers();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.altKey) {
        switch(e.key) {
          case '1':
            e.preventDefault();
            this.navigateToScreen('home');
            break;
          case '2':
            e.preventDefault();
            this.navigateToScreen('games');
            break;
          case '3':
            e.preventDefault();
            this.navigateToScreen('progress');
            break;
          case '4':
            e.preventDefault();
            this.navigateToScreen('settings');
            break;
        }
      }
    });
  }
  
  /**
   * Setup routing for deep linking
   */
  setupRouting() {
    // Handle hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      if (hash && this.games[hash]) {
        this.launchGame(hash);
      } else if (hash) {
        this.navigateToScreen(hash);
      }
    });
    
    // Handle initial hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash && this.games[initialHash]) {
      setTimeout(() => this.launchGame(initialHash), 1500);
    } else if (initialHash) {
      this.currentScreen = initialHash;
    }
  }
  
  /**
   * Navigate to a specific screen
   */
  navigateToScreen(screenName) {
    // Hide current screen
    const currentScreenEl = document.querySelector('.screen.active');
    if (currentScreenEl) {
      currentScreenEl.classList.remove('active');
    }
    
    // Show target screen
    const targetScreenEl = document.getElementById(`${screenName}-screen`);
    if (targetScreenEl) {
      targetScreenEl.classList.add('active');
      this.currentScreen = screenName;
      
      // Update navigation
      this.updateNavigation();
      
      // Load screen-specific content
      this.loadScreenContent(screenName);
      
      // Update URL hash
      window.location.hash = screenName;
      
      // Play navigation sound
      this.audioManager?.playSound('click');
    }
  }
  
  /**
   * Update navigation button states
   */
  updateNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.route === this.currentScreen) {
        btn.classList.add('active');
      }
    });
  }
  
  /**
   * Load content for specific screen
   */
  loadScreenContent(screenName) {
    switch (screenName) {
      case 'home':
        this.loadHomeContent();
        break;
      case 'games':
        this.loadGamesContent();
        break;
      case 'progress':
        this.loadProgressContent();
        break;
      case 'settings':
        this.loadSettingsContent();
        break;
    }
  }
  
  /**
   * Load home screen content
   */
  loadHomeContent() {
    // Update stats
    document.getElementById('total-score').textContent = this.user.totalScore;
    document.getElementById('games-completed').textContent = this.user.gamesCompleted;
    document.getElementById('achievements-earned').textContent = this.user.achievementsEarned;
    
    // Featured game (for now, always color matching)
    const featuredGameCard = document.getElementById('featured-game-card');
    const colorMatchingGame = this.games['color-matching'];
    if (featuredGameCard && colorMatchingGame) {
      featuredGameCard.querySelector('.btn-play').dataset.game = 'color-matching';
    }
  }
  
  /**
   * Load games screen content
   */
  loadGamesContent() {
    const gamesGrid = document.getElementById('games-grid');
    if (!gamesGrid) return;
    
    // Clear existing content except for pre-existing cards
    const existingCards = gamesGrid.querySelectorAll('.game-card');
    
    // Update existing cards with dynamic data
    existingCards.forEach(card => {
      const gameId = card.dataset.game;
      const game = this.games[gameId];
      
      if (game && !game.available) {
        card.classList.add('coming-soon');
      }
    });
  }
  
  /**
   * Load progress screen content
   */
  loadProgressContent() {
    // Load weekly stats
    this.loadWeeklyStats();
    
    // Load achievements
    this.loadAchievements();
    
    // Load game progress
    this.loadGameProgress();
  }
  
  /**
   * Load settings screen content
   */
  loadSettingsContent() {
    // Settings are mostly static HTML with event handlers
    // Volume and preference values are loaded from localStorage
    this.loadSettingsValues();
  }
  
  /**
   * Filter games by age group
   */
  filterGamesByAge(ageGroup) {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
      const cardAge = card.dataset.age;
      
      if (ageGroup === 'all' || cardAge === ageGroup) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  /**
   * Launch a specific game
   */
  async launchGame(gameId) {
    const game = this.games[gameId];
    
    if (!game) {
      console.error(`Game ${gameId} not found`);
      return;
    }
    
    if (!game.available) {
      this.showComingSoonMessage(game.title);
      return;
    }
    
    try {
      // Hide main app
      const app = document.getElementById('app');
      const gameContainer = document.getElementById('game-container');
      
      app.style.display = 'none';
      gameContainer.style.display = 'flex';
      
      // Load and initialize the game
      await this.loadGameClass(gameId);
      
      // Create game instance
      this.currentGame = new window[game.className]();
      
      // Update URL
      window.location.hash = gameId;
      
      console.log(`🎮 Launched game: ${game.title}`);
      
    } catch (error) {
      console.error(`Failed to launch game ${gameId}:`, error);
      this.showErrorMessage(`Failed to load ${game.title}. Please try again.`);
      this.exitCurrentGame();
    }
  }
  
  /**
   * Load game class dynamically
   */
  async loadGameClass(gameId) {
    const game = this.games[gameId];
    
    // Check if class is already loaded
    if (window[game.className]) {
      return;
    }
    
    // For now, all games are loaded in HTML
    // In production, you might load them dynamically
    if (gameId === 'color-matching' && !window.ColorMatchingGame) {
      throw new Error('ColorMatchingGame class not loaded');
    }
    
    if (gameId === 'number-learning' && !window.NumberLearningGame) {
      throw new Error('NumberLearningGame class not loaded');
    }
    
    if (gameId === 'letter-learning' && !window.LetterLearningGame) {
      throw new Error('LetterLearningGame class not loaded');
    }
  }
  
  /**
   * Exit current game and return to app
   */
  exitCurrentGame() {
    if (this.currentGame) {
      this.currentGame.destroy();
      this.currentGame = null;
    }
    
    const app = document.getElementById('app');
    const gameContainer = document.getElementById('game-container');
    
    gameContainer.style.display = 'none';
    app.style.display = 'block';
    
    // Return to games screen
    this.navigateToScreen('games');
  }
  
  /**
   * Setup settings event handlers
   */
  setupSettingsHandlers() {
    // Volume control
    const volumeSlider = document.getElementById('master-volume');
    const volumeValue = document.getElementById('volume-value');
    
    if (volumeSlider && volumeValue) {
      volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value;
        volumeValue.textContent = `${volume}%`;
        this.audioManager?.setMasterVolume(volume / 100);
        this.saveSettings();
      });
    }
    
    // Music toggle
    const musicToggle = document.getElementById('music-enabled');
    if (musicToggle) {
      musicToggle.addEventListener('change', (e) => {
        this.audioManager?.toggleMusic(e.target.checked);
        this.saveSettings();
      });
    }
    
    // Sound effects toggle
    const soundToggle = document.getElementById('sound-effects');
    if (soundToggle) {
      soundToggle.addEventListener('change', (e) => {
        this.audioManager?.toggleSoundEffects(e.target.checked);
        this.saveSettings();
      });
    }
    
    // Parent dashboard button
    const parentDashboardBtn = document.querySelector('.btn-parent-dashboard');
    if (parentDashboardBtn) {
      parentDashboardBtn.addEventListener('click', () => {
        this.openParentDashboard();
      });
    }
    
    // Export progress button
    const exportBtn = document.querySelector('.btn-export-progress');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportProgress();
      });
    }
  }
  
  /**
   * Update user display
   */
  updateUserDisplay() {
    const usernameEl = document.getElementById('username');
    if (usernameEl) {
      usernameEl.textContent = this.user.username;
    }
  }
  
  /**
   * Load weekly stats
   */
  loadWeeklyStats() {
    const weeklyStats = document.getElementById('weekly-stats');
    if (!weeklyStats) return;
    
    // Mock data for demo
    weeklyStats.innerHTML = `
      <div class="weekly-stat">
        <div class="stat-label">Games Played</div>
        <div class="stat-value">${this.user.gamesCompleted}</div>
      </div>
      <div class="weekly-stat">
        <div class="stat-label">Time Spent</div>
        <div class="stat-value">2h 15m</div>
      </div>
      <div class="weekly-stat">
        <div class="stat-label">Best Score</div>
        <div class="stat-value">${this.user.totalScore}</div>
      </div>
    `;
  }
  
  /**
   * Load achievements
   */
  loadAchievements() {
    const achievementsGrid = document.getElementById('achievements-grid');
    if (!achievementsGrid) return;
    
    // Mock achievements for demo
    const achievements = [
      { name: 'First Steps', description: 'Played your first game!', earned: true },
      { name: 'Color Master', description: 'Perfect score in Color Matching!', earned: false },
      { name: 'Quick Learner', description: 'Completed a game in under 1 minute!', earned: false }
    ];
    
    achievementsGrid.innerHTML = achievements.map(achievement => `
      <div class="achievement-badge ${achievement.earned ? '' : 'locked'}">
        <div class="achievement-icon">${achievement.earned ? '🏆' : '🔒'}</div>
        <div class="achievement-name">${achievement.name}</div>
      </div>
    `).join('');
  }
  
  /**
   * Load game progress
   */
  loadGameProgress() {
    const progressList = document.getElementById('progress-list');
    if (!progressList) return;
    
    // Show progress for available games
    const availableGames = Object.values(this.games).filter(game => game.available);
    
    progressList.innerHTML = availableGames.map(game => `
      <div class="game-progress-item">
        <div class="game-icon">${game.icon}</div>
        <div class="game-details">
          <h4>${game.title}</h4>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 60%;"></div>
          </div>
          <div class="progress-stats">Best Score: ${Math.floor(Math.random() * 100)} | Times Played: ${Math.floor(Math.random() * 10)}</div>
        </div>
      </div>
    `).join('');
  }
  
  /**
   * Load settings values from localStorage
   */
  loadSettingsValues() {
    const settings = JSON.parse(localStorage.getItem('kidlearn-settings') || '{}');
    
    // Volume
    const volumeSlider = document.getElementById('master-volume');
    const volumeValue = document.getElementById('volume-value');
    if (volumeSlider && settings.volume !== undefined) {
      volumeSlider.value = settings.volume;
      volumeValue.textContent = `${settings.volume}%`;
    }
    
    // Music
    const musicToggle = document.getElementById('music-enabled');
    if (musicToggle && settings.musicEnabled !== undefined) {
      musicToggle.checked = settings.musicEnabled;
    }
    
    // Sound effects
    const soundToggle = document.getElementById('sound-effects');
    if (soundToggle && settings.soundEffectsEnabled !== undefined) {
      soundToggle.checked = settings.soundEffectsEnabled;
    }
  }
  
  /**
   * Save settings to localStorage
   */
  saveSettings() {
    const settings = {
      volume: document.getElementById('master-volume')?.value || 80,
      musicEnabled: document.getElementById('music-enabled')?.checked ?? true,
      soundEffectsEnabled: document.getElementById('sound-effects')?.checked ?? true,
      animationsEnabled: document.getElementById('animations-enabled')?.checked ?? true,
      difficultyAuto: document.getElementById('difficulty-auto')?.checked ?? true
    };
    
  /**
   * Save settings to localStorage
   */
  saveSettings() {
    const settings = {
      volume: document.getElementById('master-volume')?.value || 80,
      musicEnabled: document.getElementById('music-enabled')?.checked ?? true,
      soundEffectsEnabled: document.getElementById('sound-effects')?.checked ?? true,
      animationsEnabled: document.getElementById('animations-enabled')?.checked ?? true,
      difficultyAuto: document.getElementById('difficulty-auto')?.checked ?? true
    };
    
    localStorage.setItem('kidlearn-settings', JSON.stringify(settings));
  }
  
  /**
   * Show coming soon message
   */
  showComingSoonMessage(gameTitle) {
    this.showNotification(`${gameTitle} is coming soon! 🚀`, 'info');
  }
  
  /**
   * Show error message
   */
  showErrorMessage(message) {
    this.showNotification(message, 'error');
  }
  
  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
  }
  
  /**
   * Open parent dashboard
   */
  openParentDashboard() {
    // This would open a separate parent/teacher interface
    // For demo, just show a placeholder
    this.showNotification('Parent Dashboard feature coming soon! 👨‍👩‍👧‍👦', 'info');
  }
  
  /**
   * Export progress data
   */
  exportProgress() {
    try {
      const progressData = {
        user: this.user,
        games: this.games,
        settings: JSON.parse(localStorage.getItem('kidlearn-settings') || '{}'),
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(progressData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `kidlearn-progress-${this.user.username}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      this.showNotification('Progress data exported successfully! 📊', 'success');
      
    } catch (error) {
      console.error('Failed to export progress:', error);
      this.showErrorMessage('Failed to export progress data. Please try again.');
    }
  }
  
  /**
   * Handle game completion
   */
  onGameCompleted(gameId, score, achievements) {
    // Update user stats
    this.user.totalScore += score;
    this.user.gamesCompleted += 1;
    this.user.achievementsEarned += achievements.length;
    
    // Save to localStorage
    localStorage.setItem('kidlearn-user', JSON.stringify(this.user));
    
    // Emit to socket
    if (this.socket) {
      this.socket.emit('game-completed', {
        userId: this.user.id,
        gameId: gameId,
        finalScore: score,
        achievements: achievements
      });
    }
    
    // Update displays
    this.updateUserDisplay();
    
    console.log(`Game completed: ${gameId}, Score: ${score}`);
  }
  
  /**
   * Handle game progress updates
   */
  onGameProgress(gameId, progress) {
    // Emit to socket for real-time updates
    if (this.socket) {
      this.socket.emit('game-progress', {
        userId: this.user.id,
        gameId: gameId,
        progress: progress
      });
    }
  }
}

/**
 * Audio Manager Class
 * Handles all audio functionality including background music and sound effects
 */
class AudioManager {
  constructor() {
    this.masterVolume = 0.8;
    this.musicEnabled = true;
    this.soundEffectsEnabled = true;
    this.sounds = {};
    this.backgroundMusic = null;
    
    this.init();
  }
  
  async init() {
    try {
      // Initialize background music
      this.backgroundMusic = document.getElementById('bgm');
      
      // Initialize sound effects
      this.sounds = {
        click: document.getElementById('click-sound'),
        correct: document.getElementById('correct-sound'),
        wrong: document.getElementById('wrong-sound'),
        levelUp: document.getElementById('level-up-sound')
      };
      
      // Set initial volumes
      this.setMasterVolume(this.masterVolume);
      
      console.log('🔊 Audio Manager initialized');
      
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }
  
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update all audio elements
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.masterVolume * 0.3; // Background music quieter
    }
    
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.volume = this.masterVolume;
      }
    });
  }
  
  toggleMusic(enabled) {
    this.musicEnabled = enabled;
    
    if (this.backgroundMusic) {
      if (enabled) {
        this.backgroundMusic.play().catch(e => console.warn('Music play failed:', e));
      } else {
        this.backgroundMusic.pause();
      }
    }
  }
  
  toggleSoundEffects(enabled) {
    this.soundEffectsEnabled = enabled;
  }
  
  playSound(soundName) {
    if (!this.soundEffectsEnabled) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.warn(`Sound ${soundName} play failed:`, e));
    }
  }
  
  playMusic() {
    if (this.musicEnabled && this.backgroundMusic) {
      this.backgroundMusic.play().catch(e => console.warn('Music play failed:', e));
    }
  }
  
  stopMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }
}

/**
 * Progress Manager Class
 * Handles progress tracking and analytics
 */
class ProgressManager {
  constructor() {
    this.progressData = {};
    this.sessions = [];
    
    this.init();
  }
  
  init() {
    // Load existing progress
    this.loadProgress();
    
    // Start session tracking
    this.startSession();
    
    console.log('📊 Progress Manager initialized');
  }
  
  loadProgress() {
    try {
      const saved = localStorage.getItem('kidlearn-progress');
      if (saved) {
        this.progressData = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load progress:', error);
      this.progressData = {};
    }
  }
  
  saveProgress() {
    try {
      localStorage.setItem('kidlearn-progress', JSON.stringify(this.progressData));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }
  
  startSession() {
    this.currentSession = {
      id: Date.now(),
      startTime: new Date(),
      games: [],
      totalScore: 0
    };
  }
  
  endSession() {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
      this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
      this.sessions.push(this.currentSession);
      this.saveProgress();
    }
  }
  
  recordGameSession(gameId, score, timeSpent, achievements) {
    if (!this.progressData[gameId]) {
      this.progressData[gameId] = {
        totalPlays: 0,
        bestScore: 0,
        totalScore: 0,
        totalTime: 0,
        achievements: [],
        sessions: []
      };
    }
    
    const gameProgress = this.progressData[gameId];
    
    // Update statistics
    gameProgress.totalPlays++;
    gameProgress.bestScore = Math.max(gameProgress.bestScore, score);
    gameProgress.totalScore += score;
    gameProgress.totalTime += timeSpent;
    
    // Add new achievements
    achievements.forEach(achievement => {
      if (!gameProgress.achievements.includes(achievement)) {
        gameProgress.achievements.push(achievement);
      }
    });
    
    // Record session
    gameProgress.sessions.push({
      date: new Date(),
      score: score,
      timeSpent: timeSpent,
      achievements: achievements
    });
    
    // Update current session
    if (this.currentSession) {
      this.currentSession.games.push({
        gameId: gameId,
        score: score,
        timeSpent: timeSpent
      });
      this.currentSession.totalScore += score;
    }
    
    this.saveProgress();
  }
  
  getGameProgress(gameId) {
    return this.progressData[gameId] || null;
  }
  
  getAllProgress() {
    return this.progressData;
  }
  
  getWeeklyStats() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    let weeklyGames = 0;
    let weeklyScore = 0;
    let weeklyTime = 0;
    
    Object.values(this.progressData).forEach(gameData => {
      gameData.sessions.forEach(session => {
        if (new Date(session.date) >= oneWeekAgo) {
          weeklyGames++;
          weeklyScore += session.score;
          weeklyTime += session.timeSpent;
        }
      });
    });
    
    return {
      gamesPlayed: weeklyGames,
      totalScore: weeklyScore,
      totalTime: weeklyTime
    };
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.kidLearnApp = new KidLearnApp();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.kidLearnApp && window.kidLearnApp.progressManager) {
    window.kidLearnApp.progressManager.endSession();
  }
});

// Handle visibility change (when user switches tabs)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause any running games or music
    if (window.kidLearnApp && window.kidLearnApp.audioManager) {
      window.kidLearnApp.audioManager.stopMusic();
    }
  } else {
    // Resume music if enabled
    if (window.kidLearnApp && window.kidLearnApp.audioManager) {
      window.kidLearnApp.audioManager.playMusic();
    }
  }
});

// Export for use in games
window.KidLearnApp = KidLearnApp;
window.AudioManager = AudioManager;
window.ProgressManager = ProgressManager;
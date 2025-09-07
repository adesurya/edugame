/**
 * Simple ProgressManager for KidLearn Games
 */
class ProgressManager {
  constructor() {
    this.progressData = {};
    this.sessions = [];
    this.currentSession = null;
    
    this.init();
  }
  
  init() {
    this.loadProgress();
    this.startSession();
    console.log('Progress Manager initialized');
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
      this.sessions.push(this.currentSession);
      this.saveProgress();
      this.currentSession = null;
    }
  }
  
  recordGameSession(gameId, gameData) {
    const {
      score = 0,
      timeSpent = 0,
      achievements = [],
      level = 1,
      completed = true
    } = gameData;
    
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
    gameProgress.totalPlays++;
    gameProgress.bestScore = Math.max(gameProgress.bestScore, score);
    gameProgress.totalScore += score;
    gameProgress.totalTime += timeSpent;
    
    achievements.forEach(achievement => {
      if (!gameProgress.achievements.includes(achievement)) {
        gameProgress.achievements.push(achievement);
      }
    });
    
    gameProgress.sessions.push({
      date: new Date(),
      score: score,
      timeSpent: timeSpent,
      achievements: achievements,
      level: level,
      completed: completed
    });
    
    if (this.currentSession) {
      this.currentSession.games.push({ gameId, score, timeSpent });
      this.currentSession.totalScore += score;
    }
    
    this.saveProgress();
    return gameProgress.sessions[gameProgress.sessions.length - 1];
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
      totalTime: weeklyTime,
      averageScore: weeklyGames > 0 ? Math.round(weeklyScore / weeklyGames) : 0
    };
  }
  
  getAchievements() {
    const allAchievements = [];
    Object.entries(this.progressData).forEach(([gameId, data]) => {
      data.achievements.forEach(achievement => {
        allAchievements.push({ gameId, achievement });
      });
    });
    return allAchievements;
  }
  
  getProgressSummary() {
    const totalSessions = Object.values(this.progressData).reduce((sum, game) => sum + game.totalPlays, 0);
    const totalScore = Object.values(this.progressData).reduce((sum, game) => sum + game.totalScore, 0);
    const totalAchievements = this.getAchievements().length;
    
    return {
      totalGames: Object.keys(this.progressData).length,
      totalSessions,
      totalScore,
      totalAchievements,
      averageScore: totalSessions > 0 ? Math.round(totalScore / totalSessions) : 0
    };
  }
  
  exportProgress() {
    return {
      exportDate: new Date().toISOString(),
      progressData: this.progressData,
      sessions: this.sessions,
      summary: this.getProgressSummary()
    };
  }
  
  destroy() {
    this.endSession();
  }
}

window.ProgressManager = ProgressManager;
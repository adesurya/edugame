// backend/routes/games.js
const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Mock game data - in production this would come from database
const GAMES_DATA = {
  'color-matching': {
    id: 'color-matching',
    title: 'Color Matching Fun!',
    description: 'Match colors and learn their names!',
    category: 'colors',
    ageGroup: { min: 3, max: 4 },
    difficulty: 1,
    estimatedDuration: 5,
    maxScore: 100,
    learningObjectives: ['Color recognition', 'Visual matching', 'Color vocabulary'],
    skills: ['color-recognition', 'memory', 'hand-eye-coordination'],
    assets: {
      icon: '🎨',
      thumbnail: '/assets/images/color-matching-thumb.jpg',
      sounds: ['correct.mp3', 'wrong.mp3', 'celebration.mp3'],
      images: ['red.png', 'blue.png', 'green.png', 'yellow.png']
    },
    config: {
      rounds: 10,
      lives: 3,
      scoringSystem: {
        correctAnswer: 10,
        wrongAnswer: -2,
        timeBonus: 5
      }
    },
    isActive: true,
    version: '1.0.0',
    analytics: {
      totalPlays: 245,
      averageScore: 78,
      averageCompletionTime: 320,
      completionRate: 85
    }
  },
  'number-learning': {
    id: 'number-learning',
    title: 'Number Fun Adventure!',
    description: 'Learn to count and recognize numbers!',
    category: 'numbers',
    ageGroup: { min: 3, max: 5 },
    difficulty: 1,
    estimatedDuration: 7,
    maxScore: 150,
    learningObjectives: ['Number recognition', 'Counting skills', 'Basic math concepts'],
    skills: ['number-recognition', 'logical-thinking', 'problem-solving'],
    assets: {
      icon: '🔢',
      thumbnail: '/assets/images/number-learning-thumb.jpg',
      sounds: ['count.mp3', 'number-correct.mp3', 'number-wrong.mp3'],
      images: ['1.png', '2.png', '3.png', '4.png', '5.png']
    },
    config: {
      rounds: 12,
      lives: 3,
      scoringSystem: {
        correctAnswer: 15,
        wrongAnswer: -3,
        timeBonus: 8
      }
    },
    isActive: true,
    version: '1.0.0',
    analytics: {
      totalPlays: 198,
      averageScore: 82,
      averageCompletionTime: 420,
      completionRate: 79
    }
  },
  'letter-learning': {
    id: 'letter-learning',
    title: 'Alphabet Adventure!',
    description: 'Discover letters and learn the alphabet!',
    category: 'letters',
    ageGroup: { min: 4, max: 6 },
    difficulty: 2,
    estimatedDuration: 10,
    maxScore: 200,
    learningObjectives: ['Letter recognition', 'Phonics', 'Alphabet sequence'],
    skills: ['letter-recognition', 'fine-motor', 'memory'],
    assets: {
      icon: '🔤',
      thumbnail: '/assets/images/letter-learning-thumb.jpg',
      sounds: ['letter-a.mp3', 'letter-b.mp3', 'phonics-correct.mp3'],
      images: ['alphabet-chart.png', 'uppercase.png', 'lowercase.png']
    },
    config: {
      rounds: 15,
      lives: 3,
      scoringSystem: {
        correctAnswer: 12,
        wrongAnswer: -2,
        timeBonus: 6
      }
    },
    isActive: true,
    version: '1.0.0',
    analytics: {
      totalPlays: 156,
      averageScore: 75,
      averageCompletionTime: 580,
      completionRate: 73
    }
  }
};

// @route   GET /api/games
// @desc    Get all available games with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, ageGroup, difficulty, active = 'true' } = req.query;
    
    let games = Object.values(GAMES_DATA);
    
    // Filter by active status
    if (active === 'true') {
      games = games.filter(game => game.isActive);
    }
    
    // Filter by category
    if (category) {
      games = games.filter(game => game.category === category);
    }
    
    // Filter by age group
    if (ageGroup) {
      const age = parseInt(ageGroup);
      if (!isNaN(age)) {
        games = games.filter(game => 
          age >= game.ageGroup.min && age <= game.ageGroup.max
        );
      }
    }
    
    // Filter by difficulty
    if (difficulty) {
      const diff = parseInt(difficulty);
      if (!isNaN(diff)) {
        games = games.filter(game => game.difficulty === diff);
      }
    }
    
    // Sort by popularity (total plays)
    games.sort((a, b) => (b.analytics?.totalPlays || 0) - (a.analytics?.totalPlays || 0));
    
    res.json({
      games: games.map(game => ({
        id: game.id,
        title: game.title,
        description: game.description,
        category: game.category,
        ageGroup: `${game.ageGroup.min}-${game.ageGroup.max}`,
        difficulty: game.difficulty,
        estimatedDuration: game.estimatedDuration,
        icon: game.assets.icon,
        thumbnail: game.assets.thumbnail,
        isActive: game.isActive,
        analytics: {
          totalPlays: game.analytics.totalPlays,
          averageScore: game.analytics.averageScore,
          completionRate: game.analytics.completionRate
        }
      })),
      total: games.length,
      filters: {
        category,
        ageGroup,
        difficulty,
        active
      }
    });
    
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      message: 'Server error fetching games'
    });
  }
});

// @route   GET /api/games/:gameId
// @desc    Get specific game details
// @access  Public
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const game = GAMES_DATA[gameId];
    
    if (!game) {
      return res.status(404).json({
        message: 'Game not found'
      });
    }
    
    if (!game.isActive) {
      return res.status(404).json({
        message: 'Game is not available'
      });
    }
    
    res.json({ 
      game: {
        ...game,
        ageRange: `${game.ageGroup.min}-${game.ageGroup.max}`
      }
    });
    
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({
      message: 'Server error fetching game'
    });
  }
});

// @route   GET /api/games/meta/categories
// @desc    Get all game categories
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = [
      { 
        id: 'colors', 
        name: 'Colors', 
        icon: '🎨', 
        description: 'Learn about colors and matching',
        gameCount: Object.values(GAMES_DATA).filter(g => g.category === 'colors' && g.isActive).length
      },
      { 
        id: 'numbers', 
        name: 'Numbers', 
        icon: '🔢', 
        description: 'Counting and number recognition',
        gameCount: Object.values(GAMES_DATA).filter(g => g.category === 'numbers' && g.isActive).length
      },
      { 
        id: 'letters', 
        name: 'Letters', 
        icon: '🔤', 
        description: 'Alphabet and phonics learning',
        gameCount: Object.values(GAMES_DATA).filter(g => g.category === 'letters' && g.isActive).length
      },
      { 
        id: 'shapes', 
        name: 'Shapes', 
        icon: '🔺', 
        description: 'Geometric shapes and patterns',
        gameCount: 0 // Coming soon
      },
      { 
        id: 'sounds', 
        name: 'Sounds', 
        icon: '🔊', 
        description: 'Audio recognition and phonics',
        gameCount: 0 // Coming soon
      },
      { 
        id: 'memory', 
        name: 'Memory', 
        icon: '🧠', 
        description: 'Memory games and concentration',
        gameCount: 0 // Coming soon
      }
    ];
    
    res.json({ 
      categories,
      total: categories.length
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      message: 'Server error fetching categories'
    });
  }
});

// @route   GET /api/games/meta/skills
// @desc    Get all learning skills
// @access  Public
router.get('/meta/skills', async (req, res) => {
  try {
    const skills = [
      { id: 'color-recognition', name: 'Color Recognition', category: 'Visual Processing' },
      { id: 'number-recognition', name: 'Number Recognition', category: 'Math Readiness' },
      { id: 'letter-recognition', name: 'Letter Recognition', category: 'Literacy' },
      { id: 'pattern-matching', name: 'Pattern Matching', category: 'Logic' },
      { id: 'memory', name: 'Memory', category: 'Cognitive' },
      { id: 'problem-solving', name: 'Problem Solving', category: 'Critical Thinking' },
      { id: 'creativity', name: 'Creativity', category: 'Creative Thinking' },
      { id: 'fine-motor', name: 'Fine Motor Skills', category: 'Physical Development' },
      { id: 'hand-eye-coordination', name: 'Hand-Eye Coordination', category: 'Physical Development' },
      { id: 'logical-thinking', name: 'Logical Thinking', category: 'Reasoning' }
    ];
    
    res.json({ 
      skills,
      total: skills.length
    });
    
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      message: 'Server error fetching skills'
    });
  }
});

// @route   POST /api/games/:gameId/analytics
// @desc    Update game analytics (called after game completion)
// @access  Private
router.post('/:gameId/analytics', authMiddleware, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { score, completionTime, completed } = req.body;
    
    const game = GAMES_DATA[gameId];
    
    if (!game) {
      return res.status(404).json({
        message: 'Game not found'
      });
    }
    
    // Update analytics
    game.analytics.totalPlays += 1;
    
    if (completed) {
      // Update average score
      const currentAvg = game.analytics.averageScore;
      const totalCompleted = Math.floor(game.analytics.totalPlays * game.analytics.completionRate / 100);
      game.analytics.averageScore = Math.round(((currentAvg * totalCompleted) + score) / (totalCompleted + 1));
      
      // Update average completion time
      const currentTimeAvg = game.analytics.averageCompletionTime;
      game.analytics.averageCompletionTime = Math.round(((currentTimeAvg * totalCompleted) + completionTime) / (totalCompleted + 1));
      
      // Update completion rate
      game.analytics.completionRate = Math.round(((totalCompleted + 1) / game.analytics.totalPlays) * 100);
    }
    
    res.json({
      message: 'Analytics updated successfully',
      analytics: game.analytics
    });
    
  } catch (error) {
    console.error('Update analytics error:', error);
    res.status(500).json({
      message: 'Server error updating analytics'
    });
  }
});

// @route   GET /api/games/:gameId/leaderboard
// @desc    Get game leaderboard (mock data)
// @access  Public
router.get('/:gameId/leaderboard', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { limit = 10 } = req.query;
    
    const game = GAMES_DATA[gameId];
    
    if (!game) {
      return res.status(404).json({
        message: 'Game not found'
      });
    }
    
    // Mock leaderboard data
    const leaderboard = [];
    const names = ['Emma', 'Alex', 'Sophie', 'Lucas', 'Maya', 'Oliver', 'Aria', 'Noah', 'Zoe', 'Liam'];
    const avatars = ['👧', '👦', '👧', '👦', '👧', '👦', '👧', '👦', '👧', '👦'];
    
    for (let i = 0; i < Math.min(parseInt(limit), 10); i++) {
      leaderboard.push({
        rank: i + 1,
        name: names[i],
        avatar: avatars[i],
        score: Math.floor(Math.random() * (game.maxScore - game.maxScore * 0.6)) + game.maxScore * 0.6,
        completionTime: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
        achievedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Update ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    res.json({
      gameId,
      gameTitle: game.title,
      leaderboard,
      total: leaderboard.length,
      maxScore: game.maxScore
    });
    
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      message: 'Server error fetching leaderboard'
    });
  }
});

// @route   GET /api/games/search
// @desc    Search games by query
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchQuery = query.toLowerCase().trim();
    
    if (searchQuery.length < 2) {
      return res.status(400).json({
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const games = Object.values(GAMES_DATA).filter(game => {
      if (!game.isActive) return false;
      
      return (
        game.title.toLowerCase().includes(searchQuery) ||
        game.description.toLowerCase().includes(searchQuery) ||
        game.category.toLowerCase().includes(searchQuery) ||
        game.learningObjectives.some(obj => obj.toLowerCase().includes(searchQuery)) ||
        game.skills.some(skill => skill.toLowerCase().includes(searchQuery))
      );
    });
    
    res.json({
      query: searchQuery,
      games: games.map(game => ({
        id: game.id,
        title: game.title,
        description: game.description,
        category: game.category,
        ageGroup: `${game.ageGroup.min}-${game.ageGroup.max}`,
        difficulty: game.difficulty,
        icon: game.assets.icon,
        matchedFields: getMatchedFields(game, searchQuery)
      })),
      total: games.length
    });
    
  } catch (error) {
    console.error('Search games error:', error);
    res.status(500).json({
      message: 'Server error searching games'
    });
  }
});

// @route   GET /api/games/recommendations/:userId
// @desc    Get personalized game recommendations
// @access  Private
router.get('/recommendations/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // In production, this would analyze user's progress and preferences
    // For now, we'll return mock recommendations
    
    const recommendations = [
      {
        gameId: 'color-matching',
        reason: 'Great for your age group',
        confidence: 0.9,
        type: 'age_appropriate'
      },
      {
        gameId: 'number-learning',
        reason: 'Next skill to master',
        confidence: 0.8,
        type: 'skill_progression'
      },
      {
        gameId: 'letter-learning',
        reason: 'Popular with similar learners',
        confidence: 0.7,
        type: 'peer_recommendation'
      }
    ];
    
    const recommendedGames = recommendations.map(rec => ({
      ...GAMES_DATA[rec.gameId],
      recommendation: {
        reason: rec.reason,
        confidence: rec.confidence,
        type: rec.type
      }
    })).filter(game => game.isActive);
    
    res.json({
      userId,
      recommendations: recommendedGames,
      total: recommendedGames.length
    });
    
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      message: 'Server error fetching recommendations'
    });
  }
});

// Helper function to identify matched fields in search
function getMatchedFields(game, query) {
  const matches = [];
  
  if (game.title.toLowerCase().includes(query)) {
    matches.push('title');
  }
  if (game.description.toLowerCase().includes(query)) {
    matches.push('description');
  }
  if (game.category.toLowerCase().includes(query)) {
    matches.push('category');
  }
  if (game.learningObjectives.some(obj => obj.toLowerCase().includes(query))) {
    matches.push('learning_objectives');
  }
  if (game.skills.some(skill => skill.toLowerCase().includes(query))) {
    matches.push('skills');
  }
  
  return matches;
}

module.exports = router;
// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const validation = require('../middleware/validation');

const router = express.Router();

// Mock user storage - in production this would use database
let usersStorage = {};

// @route   POST /api/auth/register
// @desc    Register a new user (parent/teacher)
// @access  Public
router.post('/register', validation.validateRegistration, async (req, res) => {
  try {
    const { username, email, password, userType, childProfile, adultProfile } = req.body;

    // Check if user already exists
    const existingUser = Object.values(usersStorage).find(user => 
      user.email === email || user.username === username
    );

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }

    // Hash password for parent/teacher accounts
    let hashedPassword = null;
    if (userType === 'parent' || userType === 'teacher') {
      const salt = await bcrypt.genSalt(12);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Create user object
    const userId = Date.now().toString();
    const userData = {
      id: userId,
      username,
      userType,
      email: userType === 'child' ? null : email,
      password: hashedPassword,
      childProfile: userType === 'child' ? childProfile : null,
      adultProfile: userType !== 'child' ? adultProfile : null,
      gameStats: {
        totalScore: 0,
        gamesCompleted: 0,
        totalPlayTime: 0,
        lastActiveDate: new Date(),
        currentStreak: 0,
        longestStreak: 0
      },
      achievements: [],
      settings: {
        volume: 80,
        musicEnabled: true,
        soundEffectsEnabled: true,
        animationsEnabled: true,
        autoAdjustDifficulty: true,
        language: 'en'
      },
      isActive: true,
      parentalConsent: userType === 'child' ? true : false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    usersStorage[userId] = userData;

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: userId,
        userType: userData.userType
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: getChildSafeUserData(userData)
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validation.validateLogin, async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Find user by email or username
    const user = Object.values(usersStorage).find(u => 
      u.email === email || u.username === username
    );

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(400).json({
        message: 'Account is disabled'
      });
    }

    // For child accounts, no password check needed
    if (user.userType === 'child') {
      if (username && user.username === username) {
        // Generate token
        const token = jwt.sign(
          { 
            userId: user.id,
            userType: user.userType
          },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '24h' } // Shorter for children
        );

        // Update last active
        user.gameStats.lastActiveDate = new Date();
        user.updatedAt = new Date();

        return res.json({
          message: 'Login successful',
          token,
          user: getChildSafeUserData(user)
        });
      }
    }

    // For parent/teacher accounts, check password
    if (user.userType === 'parent' || user.userType === 'teacher') {
      if (!user.password) {
        return res.status(400).json({
          message: 'Invalid credentials'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: 'Invalid credentials'
        });
      }

      // Generate token
      const token = jwt.sign(
        { 
          userId: user.id,
          userType: user.userType
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      // Update last active
      user.gameStats.lastActiveDate = new Date();
      user.updatedAt = new Date();

      return res.json({
        message: 'Login successful',
        token,
        user: getChildSafeUserData(user)
      });
    }

    res.status(400).json({
      message: 'Invalid credentials'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/child-login
// @desc    Simple login for children (username only)
// @access  Public
router.post('/child-login', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        message: 'Username is required'
      });
    }

    // Find child user
    const user = Object.values(usersStorage).find(u => 
      u.username === username && u.userType === 'child' && u.isActive
    );

    if (!user) {
      return res.status(400).json({
        message: 'Child account not found'
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id,
        userType: user.userType
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' } // Shorter token for children
    );

    // Update last active
    user.gameStats.lastActiveDate = new Date();
    user.updatedAt = new Date();

    res.json({
      message: 'Login successful',
      token,
      user: getChildSafeUserData(user)
    });

  } catch (error) {
    console.error('Child login error:', error);
    res.status(500).json({
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = usersStorage[req.user.userId];
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      user: getChildSafeUserData(user)
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Server error during logout'
    });
  }
});

// @route   POST /api/auth/create-child
// @desc    Create a child account (by parent/teacher)
// @access  Private (parent/teacher only)
router.post('/create-child', authMiddleware, validation.validateChildCreation, async (req, res) => {
  try {
    const { username, age, grade, avatar } = req.body;
    const parentId = req.user.userId;

    // Verify parent/teacher
    const parent = usersStorage[parentId];
    if (!parent || (parent.userType !== 'parent' && parent.userType !== 'teacher')) {
      return res.status(403).json({
        message: 'Only parents and teachers can create child accounts'
      });
    }

    // Check if username is available
    const existingChild = Object.values(usersStorage).find(u => u.username === username);
    if (existingChild) {
      return res.status(400).json({
        message: 'Username already taken'
      });
    }

    // Create child account
    const childId = Date.now().toString();
    const childData = {
      id: childId,
      username,
      userType: 'child',
      email: null,
      password: null,
      childProfile: {
        age,
        grade: grade || 'preschool',
        avatar: avatar || '👶',
        parentId: parentId
      },
      adultProfile: null,
      gameStats: {
        totalScore: 0,
        gamesCompleted: 0,
        totalPlayTime: 0,
        lastActiveDate: new Date(),
        currentStreak: 0,
        longestStreak: 0
      },
      achievements: [],
      settings: {
        volume: 80,
        musicEnabled: true,
        soundEffectsEnabled: true,
        animationsEnabled: true,
        autoAdjustDifficulty: true,
        language: 'en'
      },
      isActive: true,
      parentalConsent: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    usersStorage[childId] = childData;

    // Add child to parent's children list
    if (!parent.adultProfile.children) {
      parent.adultProfile.children = [];
    }
    parent.adultProfile.children.push(childId);
    parent.updatedAt = new Date();

    res.status(201).json({
      message: 'Child account created successfully',
      child: getChildSafeUserData(childData)
    });

  } catch (error) {
    console.error('Create child error:', error);
    res
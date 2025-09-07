// backend/middleware/validation.js
const validateRegistration = (req, res, next) => {
  const { username, userType, email, password, childProfile, adultProfile } = req.body;

  // Basic validation
  if (!username || username.trim().length < 2) {
    return res.status(400).json({
      message: 'Username must be at least 2 characters long'
    });
  }

  if (!userType || !['child', 'parent', 'teacher'].includes(userType)) {
    return res.status(400).json({
      message: 'Invalid user type'
    });
  }

  // Validation for parent/teacher
  if (userType === 'parent' || userType === 'teacher') {
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        message: 'Valid email is required for parent/teacher accounts'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    if (!adultProfile || !adultProfile.firstName || !adultProfile.lastName) {
      return res.status(400).json({
        message: 'First name and last name are required'
      });
    }
  }

  // Validation for child
  if (userType === 'child') {
    if (!childProfile || !childProfile.age) {
      return res.status(400).json({
        message: 'Age is required for child accounts'
      });
    }

    if (childProfile.age < 3 || childProfile.age > 12) {
      return res.status(400).json({
        message: 'Age must be between 3 and 12'
      });
    }
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    return res.status(400).json({
      message: 'Email or username is required'
    });
  }

  // For email login, password is required
  if (email && !password) {
    return res.status(400).json({
      message: 'Password is required'
    });
  }

  next();
};

const validateChildCreation = (req, res, next) => {
  const { username, age } = req.body;

  if (!username || username.trim().length < 2) {
    return res.status(400).json({
      message: 'Username must be at least 2 characters long'
    });
  }

  if (!age || age < 3 || age > 12) {
    return res.status(400).json({
      message: 'Age must be between 3 and 12'
    });
  }

  next();
};

const validateGameProgress = (req, res, next) => {
  const { gameId, score, playTime } = req.body;

  if (!gameId || typeof gameId !== 'string') {
    return res.status(400).json({
      message: 'Valid game ID is required'
    });
  }

  if (typeof score !== 'number' || score < 0) {
    return res.status(400).json({
      message: 'Score must be a non-negative number'
    });
  }

  if (typeof playTime !== 'number' || playTime < 0) {
    return res.status(400).json({
      message: 'Play time must be a non-negative number'
    });
  }

  next();
};

// Helper function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateChildCreation,
  validateGameProgress
};


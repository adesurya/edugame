// ====================================================================
// backend/middleware/rateLimiter.js
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Create rate limiters for different endpoints
const authLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 900, // Per 15 minutes
  blockDuration: 900, // Block for 15 minutes
});

const generalLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 900, // Per 15 minutes
  blockDuration: 60, // Block for 1 minute
});

const progressLimiter = new RateLimiterMemory({
  points: 50, // Number of requests
  duration: 60, // Per 1 minute
  blockDuration: 60, // Block for 1 minute
});

// Middleware factory
const createRateLimiter = (limiter) => {
  return async (req, res, next) => {
    try {
      const key = req.ip || req.connection.remoteAddress;
      await limiter.consume(key);
      next();
    } catch (rejRes) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      res.set('Retry-After', String(secs));
      res.status(429).json({
        message: 'Too many requests',
        retryAfter: secs
      });
    }
  };
};

// Export specific limiters
const authRateLimit = createRateLimiter(authLimiter);
const generalRateLimit = createRateLimiter(generalLimiter);
const progressRateLimit = createRateLimiter(progressLimiter);

// Default export (general limiter)
module.exports = generalRateLimit;
module.exports.authRateLimit = authRateLimit;
module.exports.progressRateLimit = progressRateLimit;
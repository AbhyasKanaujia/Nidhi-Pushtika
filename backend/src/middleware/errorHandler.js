// Global error handling middleware for Express
module.exports = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  // Handle validation errors from express-validator or Joi
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details || err.errors || err.message
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Handle MongoDB duplicate key error
  if (err.code && err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate key error', keyValue: err.keyValue });
  }

  // Default to 500 server error
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
};

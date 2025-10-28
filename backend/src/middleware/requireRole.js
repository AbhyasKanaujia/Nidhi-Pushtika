const jwt = require('jsonwebtoken');

const requireRole = (roles) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.access_token;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Support both string and array of roles
      if (typeof roles === 'string') {
        if (decoded.role !== roles) {
          return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }
      } else if (Array.isArray(roles)) {
        if (!roles.includes(decoded.role)) {
          return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }
      } else {
        // Invalid roles parameter
        return res.status(500).json({ message: 'Server error: Invalid roles parameter' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
};

module.exports = requireRole;

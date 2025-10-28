const jwt = require('jsonwebtoken');

const requireRole = (role) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.access_token;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
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

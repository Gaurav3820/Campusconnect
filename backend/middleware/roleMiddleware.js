// backend/middleware/roleMiddleware.js
exports.requireAdmin = (req, res, next) => {
  // req.user must be set by verifyToken middleware
  if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin access required' });
  next();
};

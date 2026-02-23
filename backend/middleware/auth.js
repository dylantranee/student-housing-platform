const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      console.log('Auth middleware: User not found for id', decoded.id);
      return res.status(404).json({ error: 'User not found' });
    }
    next();
  } catch (err) {
    console.error('Auth middleware verification error:', err.message);
    return res.status(403).json({ error: 'Forbidden', details: err.message });
  }
}

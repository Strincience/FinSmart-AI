const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

async function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string' || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const token = header.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const decoded = verifyToken(token);
    const userId = decoded.sub || decoded.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token payload.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      dbUser: user,
    };

    req.authToken = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = authRequired;

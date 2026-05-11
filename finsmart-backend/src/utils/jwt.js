const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const DEFAULT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

function signToken(payload) {
  if (!SECRET) throw new Error('JWT_SECRET is not configured.');
  return jwt.sign(payload, SECRET, { expiresIn: DEFAULT_EXPIRES });
}

function verifyToken(token) {
  if (!SECRET) throw new Error('JWT_SECRET is not configured.');
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };

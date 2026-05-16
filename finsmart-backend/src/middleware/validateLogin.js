const validator = require('validator');

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !validator.isEmail(email.trim())) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  req.body.email = validator.normalizeEmail(email.trim().toLowerCase());
  next();
}

module.exports = validateLogin;

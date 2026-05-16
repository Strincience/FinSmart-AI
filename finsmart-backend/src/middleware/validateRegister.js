const validator = require('validator');

function validateRegister(req, res, next) {
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Full name is required.' });
  }

  if (name.trim().length > 120) {
    return res.status(400).json({ error: 'Name is too long.' });
  }

  if (!email || typeof email !== 'string' || !validator.isEmail(email.trim())) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  if (password.length > 128) {
    return res.status(400).json({ error: 'Password is too long.' });
  }

  req.body.name = name.trim();
  req.body.email = validator.normalizeEmail(email.trim().toLowerCase());
  next();
}

module.exports = validateRegister;

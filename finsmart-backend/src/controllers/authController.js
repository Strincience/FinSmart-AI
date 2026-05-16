const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { signToken } = require('../utils/jwt');

const SALT_ROUNDS = 12;

function userPayload(user) {
  const safe = user.toSafeObject();
  return safe;
}

function issueAuthResponse(user) {
  const token = signToken({ sub: user._id.toString(), email: user.email });
  return {
    token,
    user: userPayload(user),
  };
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash });

    const body = issueAuthResponse(user);
    return res.status(201).json(body);
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ error: 'Could not create account.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const body = issueAuthResponse(user);
    return res.status(200).json(body);
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: 'Could not sign in.' });
  }
}

module.exports = { register, login };

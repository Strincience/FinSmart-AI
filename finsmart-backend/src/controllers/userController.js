const User = require('../models/User');
const { validateBusinessProfilePayload } = require('../validators/businessProfile');

async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ error: 'Could not load profile.' });
  }
}

async function updateBusinessProfile(req, res) {
  try {
    const profile = req.body.businessProfile;
    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({ error: 'businessProfile object is required in the body.' });
    }
    const parsed = validateBusinessProfilePayload(profile);
    if (!parsed.ok) {
      return res.status(400).json({ error: parsed.error });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.businessProfile = parsed.value;
    user.onboardingCompletedAt = new Date();
    await user.save();

    return res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error('updateBusinessProfile error:', err);
    return res.status(500).json({ error: 'Could not save business profile.' });
  }
}

module.exports = { getMe, updateBusinessProfile };

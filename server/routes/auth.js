const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Public signup always creates an employee. HR/manager accounts made by HR or seed.
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already used' });
    const user = await User.create({ name, email, password, role: 'employee' });
    res.status(201).json({ token: sign(user), user });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
    if (!user || !user.active || !(await user.matchPassword(req.body.password || '')))
      return res.status(401).json({ message: 'Wrong email or password' });
    res.json({ token: sign(user), user });
  } catch (e) { next(e); }
});

router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;

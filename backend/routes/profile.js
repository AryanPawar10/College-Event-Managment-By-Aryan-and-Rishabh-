const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth'); // Ensure this exists and exports req.userId

const router = express.Router();

// ✅ Test route to verify this file is working
router.get('/profile-test', (req, res) => {
  res.send('✅ Profile route is working');
});

// ✅ Get Logged-in User Profile (requires JWT)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Return profile
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: err.message });
  }
});

// 🔐 Update Profile (name or email) - JWT Required
router.put('/update-profile', authMiddleware, async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

module.exports = router;
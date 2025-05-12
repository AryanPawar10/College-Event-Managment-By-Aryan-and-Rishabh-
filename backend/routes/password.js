const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// ✅ Test Route
router.get('/test', (req, res) => {
  res.send('✅ Password route working');
});

// ✅ Forgot Password - Generate Token and Send Reset Email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Send email
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await sendEmail(
      user.email,
      'Reset Your Password - College Event System',
      `<p>Hello ${user.name || 'User'},</p>
       <p>You requested a password reset. Click below:</p>
       <a href="${resetLink}">${resetLink}</a>
       <p>This link expires in 15 minutes.</p>`
    );

    console.log(`✅ Reset link sent to ${user.email}: ${resetLink}`);

    res.status(200).json({ message: 'Reset email sent successfully' });
  } catch (err) {
    console.error('❌ Forgot Password Error:', err);
    res.status(500).json({ message: 'Error generating reset token', error: err.message });
  }
});

// ✅ Reset Password - Verify Token and Update Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      console.log("❌ Invalid or expired token:", token);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    console.log("✅ Reset token valid for:", user.email);

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    console.log(`✅ Password updated successfully for ${user.email}`);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('❌ Reset Password Error:', err);
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
});

module.exports = router;
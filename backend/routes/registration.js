const express = require('express');
const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const authMiddleware = require('../middleware/auth'); // Token-based auth middleware

const router = express.Router();

// ✅ 1. Register for Event (Protected)
router.post('/register-event', authMiddleware, async (req, res) => {
  const userId = req.userId;  // Assuming userId is added to req.userId after token verification
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  try {
    // Check if the user is already registered for the event
    const alreadyRegistered = await Registration.findOne({ user: userId, event: eventId });

    if (alreadyRegistered) {
      return res.status(409).json({ message: 'You have already registered for this event' });
    }

    // Create new registration
    const registration = new Registration({ user: userId, event: eventId });
    await registration.save();

    res.status(201).json({ message: 'Successfully registered for event' });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: 'Error registering for event', error: err.message });
  }
});

// ✅ 2. View Own Registrations (User Dashboard)
router.get('/my-registrations', authMiddleware, async (req, res) => {
  try {
    // Find all registrations by the current user
    const registrations = await Registration.find({ user: req.userId })
      .populate({
        path: 'event',
        select: 'title description date location'
      });

    res.status(200).json(registrations);
  } catch (err) {
    console.error("Fetch User Registrations Error:", err);
    res.status(500).json({ message: 'Failed to fetch your registrations', error: err.message });
  }
});

// ✅ 3. View Registrations for a Specific Event (Admin Only)
router.get('/event/:eventId', authMiddleware, async (req, res) => {
  const { eventId } = req.params;

  // Validate eventId format
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID format' });
  }

  try {
    // Check if user is admin (add your admin role check here)
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Admins only' });
    }

    // Fetch all registrations for the specified event
    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email');

    res.status(200).json(registrations);
  } catch (err) {
    console.error("Fetch Event Registrations Error:", err);
    res.status(500).json({ message: 'Failed to fetch event registrations', error: err.message });
  }
});

module.exports = router;
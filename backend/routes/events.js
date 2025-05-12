const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Event = require('../models/Event');

const router = express.Router();

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contains: { id, role }
    next();
  } catch (err) {
    console.error("Token Error:", err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Admin-only middleware
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access Denied: Admins only' });
  }
  next();
}

// @route   POST /api/events
// @desc    Create a new event (Admin only)
// @access  Private (Admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { title, description, date, location } = req.body;

  if (!title || !date || !location) {
    return res.status(400).json({ message: 'Title, date, and location are required' });
  }

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      createdBy: req.user.id
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("Event Creation Error:", err);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    res.status(200).json(events);
  } catch (err) {
    console.error("Event Fetch Error:", err);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// @route   DELETE /api/events/:eventId
// @desc    Admin - Delete a specific event
// @access  Admin Only
router.delete('/:eventId', authenticateToken, requireAdmin, async (req, res) => {
  const { eventId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID format' });
  }

  try {
    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error("Event Deletion Error:", err);
    res.status(500).json({ message: 'Error deleting event', error: err.message });
  }
});

module.exports = router;
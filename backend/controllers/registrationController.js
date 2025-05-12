import Registration from '../models/registrationModel.js';

// GET registrations for a specific event (Admin only)
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await Registration.find({ event: eventId }).populate('user', 'name email');

    res.status(200).json(registrations);
  } catch (error) {
    console.error('Get Event Registrations Error:', error);
    res.status(500).json({ message: 'Failed to fetch registrations for this event' });
  }
};
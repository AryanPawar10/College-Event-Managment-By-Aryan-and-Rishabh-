import { useEffect, useState } from 'react';
import axios from '../api/axios';  // axios for API calls
import { getToken } from '../utils/auth';  // Helper function to get JWT token
import { Link } from 'react-router-dom';  // React Router Link for navigation

function AdminEvents() {
  const [events, setEvents] = useState([]);  // Store events from backend
  const [error, setError] = useState('');    // Store any error during fetching

  useEffect(() => {
    const fetchEvents = async () => {
      const token = getToken();  // Retrieve token (for authentication)
      try {
        const res = await axios.get('/api/events', {
          headers: { Authorization: `Bearer ${token} `}  // Make API call with token
        });
        setEvents(res.data);  // Set the fetched events to state
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');  // Handle errors
      }
    };

    fetchEvents();  // Call fetch events on page load
  }, []);

  return (
    <div className="container mt-4">
      <h3>All Events (Admin)</h3>
      {error && <div className="alert alert-danger">{error}</div>}  {/* Display error if events fail to load */}
      <ul className="list-group">
        {events.map((event) => (
          <li key={event._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{event.title}</strong> <br />
              <small>{event.date} at {event.location}</small>
            </div>
            <div>
              <Link
                to={`/event-registrations/${event._id}`}  // Admin clicks to view registrations for a specific event
                className="btn btn-sm btn-outline-primary"
              >
                View Registrations
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminEvents;
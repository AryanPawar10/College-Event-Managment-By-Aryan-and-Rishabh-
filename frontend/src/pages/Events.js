import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaTrash, FaClipboardList } from 'react-icons/fa';

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/events');
        setEvents(res.data);
      } catch (err) {
        setError('Failed to fetch events');
      }
    };

    const checkAdmin = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          if (decoded.role === 'admin') {
            setIsAdmin(true);
          }
        } catch (err) {
          console.error('Token decode error:', err);
        }
      }
    };

    fetchEvents();
    checkAdmin();
  }, []);

  const handleRegister = async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Login required to register for events.');
      return;
    }

    try {
      const res = await axios.post(
        '/registration/register-event',
        { eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message || 'Registered successfully');
      setError('');
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e._id !== eventId));
      setMessage('Event deleted successfully');
      setError('');
    } catch {
      setMessage('');
      setError('Failed to delete event');
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100 py-5 px-3" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="container">
        <h2 className="text-center mb-5 fw-bold display-5 text-white border-bottom pb-2">🎉 Upcoming Events</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {events.length === 0 ? (
          <p className="text-center fs-4">No events found</p>
        ) : (
          <div className="row">
            {events.map((event) => (
              <div key={event._id} className="col-lg-4 col-md-6 mb-4">
                <div className="card bg-light shadow-lg border-0 h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h4 className="card-title text-dark fw-bold">{event.title}</h4>
                      <p className="text-muted">{event.description}</p>
                      <p className="mb-1">
                        <FaCalendarAlt className="text-primary me-2" />
                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="mb-1">
                        <FaMapMarkerAlt className="text-danger me-2" />
                        <strong>Location:</strong> {event.location}
                      </p>
                      <p className="text-muted">
                        <small>Created by: {event.createdBy?.name || 'Admin'}</small>
                      </p>
                    </div>

                    <div className="d-flex justify-content-between flex-wrap gap-2 mt-4">
                      <button
                        className="btn btn-primary flex-fill"
                        onClick={() => handleRegister(event._id)}
                      >
                        Register Now
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            className="btn btn-outline-secondary flex-fill"
                            onClick={() => navigate(`/event-registrations/${event._id}`)}
                          >
                            <FaClipboardList className="me-1" /> Registrations
                          </button>
                          <button
                            className="btn btn-danger flex-fill"
                            onClick={() => handleDelete(event._id)}
                          >
                            <FaTrash className="me-1" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;

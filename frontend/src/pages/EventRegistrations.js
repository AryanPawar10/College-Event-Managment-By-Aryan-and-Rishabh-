import '../App.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { getToken } from '../utils/auth';
import { FaUser, FaEnvelope } from 'react-icons/fa';

function EventRegistrations() {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      const token = getToken();
      try {
        const res = await axios.get(`/registration/event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(res.data);
      } catch (err) {
        console.error('Error fetching registrations:', err);
        setError(err.response?.data?.message || 'Failed to load registrations');
      }
    };
    fetchRegistrations();
  }, [eventId]);

  return (
    <div className="container py-5">
      <div className="p-4 rounded shadow text-white" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
        <h2 className="text-center mb-4">📝 Event Registrations</h2>

        {error && <div className="alert alert-danger bg-danger text-white">❌ {error}</div>}

        {registrations.length === 0 ? (
          <p className="text-center">🚫 No users have registered for this event yet.</p>
        ) : (
          <ul className="list-group">
            {registrations.map((reg) => (
              <li
                key={reg._id}
                className="list-group-item bg-light d-flex justify-content-between align-items-center"
              >
                <span>
                  <FaUser className="me-2 text-primary" />
                  <strong>{reg.user?.name || 'Deleted User'}</strong>
                </span>
                <span>
                  <FaEnvelope className="me-2 text-secondary" />
                  {reg.user?.email || 'No Email'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EventRegistrations;
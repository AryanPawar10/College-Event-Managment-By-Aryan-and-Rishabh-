import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope } from 'react-icons/fa';

function ViewRegistrations() {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get(`/registrations/${eventId}`);
        setRegistrations(res.data);
      } catch (err) {
        console.error('Fetch Registrations Error:', err);
        setError('Failed to fetch registrations');
      }
    };

    fetchRegistrations();
  }, [eventId]);

  return (
    <div
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        padding: '2rem',
        color: 'white',
      }}
    >
      <div className="container bg-dark bg-opacity-75 p-4 rounded shadow">
        <h2 className="text-center mb-4">📋 Event Registrations</h2>

        {error && <div className="alert alert-danger bg-danger text-white">{error}</div>}

        {registrations.length === 0 ? (
          <p className="text-center">❌ No registrations found for this event.</p>
        ) : (
          <ul className="list-group">
            {registrations.map((registration) => (
              <li
                key={registration._id}
                className="list-group-item bg-light d-flex justify-content-between align-items-center"
              >
                <span>
                  <FaUser className="me-2 text-primary" />
                  <strong>{registration.userName}</strong>
                </span>
                <span>
                  <FaEnvelope className="me-2 text-secondary" />
                  {registration.email}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ViewRegistrations;

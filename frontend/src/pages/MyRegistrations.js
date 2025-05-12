import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { getToken } from '../utils/auth';
import { FaCalendarAlt, FaMapMarkerAlt, FaRegSadTear } from 'react-icons/fa';

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      const token = getToken();
      if (!token) {
        setError('🔐 Please login to view your registrations.');
        return;
      }

      try {
        const res = await axios.get('/registration/my-registrations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRegistrations(res.data);
      } catch (err) {
        console.error('Fetch My Events Error:', err);
        setError(err.response?.data?.message || 'Failed to load registrations');
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="container py-5">
      <div className="p-4 rounded shadow text-white" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
        <h2 className="text-center mb-4">🎫 My Registered Events</h2>

        {error && <div className="alert alert-danger bg-danger text-white">❌ {error}</div>}

        {registrations.length === 0 ? (
          <p className="text-center">
            <FaRegSadTear className="me-2 text-warning" />
            You haven’t registered for any events yet.
          </p>
        ) : (
          <div className="row">
            {registrations.map((reg) => (
              <div key={reg._id} className="col-md-4 mb-3">
                <div className="card h-100 bg-light text-dark shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{reg.event?.title || 'Untitled Event'}</h5>
                    <p className="card-text">{reg.event?.description || 'No description available.'}</p>
                    <p>
                      <FaCalendarAlt className="me-2 text-primary" />
                      <strong>Date:</strong>{' '}
                      {reg.event?.date
                        ? new Date(reg.event.date).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p>
                      <FaMapMarkerAlt className="me-2 text-danger" />
                      <strong>Location:</strong> {reg.event?.location || 'N/A'}
                    </p>
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

export default MyRegistrations;

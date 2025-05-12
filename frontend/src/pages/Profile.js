import { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaExclamationTriangle,
} from 'react-icons/fa';

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage('🔒 You are not logged in.');
        return;
      }

      try {
        const res = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setMessage('⚠️ Failed to fetch profile. Please log in again.');
        localStorage.removeItem('token');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-start"
      style={{
        minHeight: '100vh',
        paddingTop: '80px', // vertical spacing like Instagram profile
        background: 'transparent',
      }}
    >
      <div
        className="w-100 p-4 bg-white shadow rounded"
        style={{ maxWidth: '500px', minHeight: '70vh' }}
      >
        <h3 className="text-center mb-4">👤 Your Profile</h3>

        {message && (
          <div className="alert alert-warning d-flex align-items-center">
            <FaExclamationTriangle className="me-2" />
            {message}
          </div>
        )}

        {user ? (
          <div className="card bg-light text-dark p-4 shadow-sm">
            <div className="mb-3 text-center">
              <FaUser size={48} className="text-primary mb-2" />
              <h5>{user.name}</h5>
              <p className="text-muted mb-1">
                <FaEnvelope className="me-2" />
                {user.email}
              </p>
              <p className="text-muted">
                <FaUserShield className="me-2" />
                {user.role}
              </p>
            </div>
          </div>
        ) : (
          !message && <p className="text-center">⏳ Loading your profile...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;

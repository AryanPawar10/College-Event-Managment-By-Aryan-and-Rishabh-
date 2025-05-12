import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FaCalendarPlus, FaMapMarkerAlt, FaRegCalendarAlt, FaInfoCircle } from 'react-icons/fa';

function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !date || !location) {
      setError('⚠ Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('🔐 You must be logged in as an admin');
      return;
    }

    try {
      await axios.post(
        '/events',
        { title, description, date, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Event created successfully!');
      setTimeout(() => navigate('/events'), 2000);
    } catch (err) {
      setError('❌ Failed to create event');
      console.error(err);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: 'transparent' }}
    >
      <div
        className="w-100 p-4 bg-white shadow rounded"
        style={{ maxWidth: '500px' }}
      >
        <h3 className="text-center mb-4">
          <FaCalendarPlus className="me-2 text-primary" />
          Create Event
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              <FaCalendarPlus className="me-2 text-primary" /> Event Title
            </label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              <FaInfoCircle className="me-2 text-secondary" /> Description
            </label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              <FaRegCalendarAlt className="me-2 text-danger" /> Event Date
            </label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              <FaMapMarkerAlt className="me-2 text-success" /> Location
            </label>
            <input
              type="text"
              id="location"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            🚀 Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
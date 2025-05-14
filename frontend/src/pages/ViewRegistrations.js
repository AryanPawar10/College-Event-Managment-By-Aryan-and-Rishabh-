import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaDownload, FaSearch } from 'react-icons/fa';

function ViewRegistrations() {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get(`/registrations/${eventId}`);
        setRegistrations(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Fetch Registrations Error:', err);
        setError('Failed to fetch registrations');
      }
    };

    fetchRegistrations();
  }, [eventId]);

  const handleSearch = (value) => {
    setSearch(value);
    const filteredResults = registrations.filter((r) =>
      r.userName.toLowerCase().includes(value.toLowerCase()) ||
      r.email.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filteredResults);
  };

  const handleDownloadCSV = () => {
    const headers = ['Name,Email'];
    const rows = filtered.map(r => `${r.userName},${r.email}`);
    const csvContent = [headers, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'registrations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <div className="container p-3 p-md-4 rounded shadow" style={{ backgroundColor: 'rgba(255,255,255,0.85)', color: '#000' }}>
        <h2 className="text-center mb-4 fw-bold">📋 Event Registrations</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {registrations.length > 0 && (
          <>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-2">
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <button className="btn btn-success mt-2 mt-md-0" onClick={handleDownloadCSV}>
                <FaDownload className="me-2" /> Download CSV
              </button>
            </div>
          </>
        )}

        {filtered.length === 0 ? (
          <p className="text-center">❌ No registrations found.</p>
        ) : (
          <ul className="list-group">
            {filtered.map((registration) => (
              <li
                key={registration._id}
                className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
              >
                <span className="mb-2 mb-md-0">
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

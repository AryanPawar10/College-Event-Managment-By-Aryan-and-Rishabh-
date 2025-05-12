import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', form);
      setMessage('✅ Registration successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Registration failed');
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-start"
      style={{ minHeight: '100vh', paddingTop: '80px' }}
    >
      <div
        className="p-4 rounded shadow bg-white text-dark"
        style={{ maxWidth: '450px', width: '100%' }}
      >
        <h2 className="text-center mb-4">
          <FaUserPlus className="me-2" />
          Register
        </h2>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit} className="p-2">
          <div className="mb-3">
            <label className="form-label">
              <FaUserShield className="me-2 text-primary" />Name
            </label>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FaEnvelope className="me-2 text-danger" />Email
            </label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FaLock className="me-2 text-warning" />Password
            </label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Choose a strong password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-control"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">👤 User</option>
              <option value="admin">🛠 Admin</option>
            </select>
          </div>

          <button className="btn btn-primary w-100" type="submit">
            📝 Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;

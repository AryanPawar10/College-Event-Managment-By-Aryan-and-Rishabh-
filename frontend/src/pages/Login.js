import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || '❌ Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err);
      setError('⚠ Something went wrong. Try again later.');
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-start"
      style={{ minHeight: '100vh', paddingTop: '80px' }}
    >
      <div
        className="p-4 rounded shadow bg-white text-dark"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h2 className="text-center mb-4">
          <FaSignInAlt className="me-2" />Login
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin} className="p-2">
          <div className="mb-3">
            <label className="form-label">
              <FaEnvelope className="me-2 text-primary" />
              Email
            </label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FaLock className="me-2 text-secondary" />
              Password
            </label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3 text-end">
            <Link to="/forgot-password" className="text-decoration-none">
              🔑 Forgot Password?
            </Link>
          </div>

          <button className="btn btn-primary w-100" type="submit">
            🔓 Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

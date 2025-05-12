import { useState } from 'react';
import axios from '../api/axios';
import { FaEnvelopeOpenText } from 'react-icons/fa';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('/password/forgot-password', { email });
      setMessage('✅ ' + res.data.message);
    } catch (err) {
      setError('❌ ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: 'transparent' }}
    >
      <div
        className="p-4 shadow rounded"
        style={{ width: '100%', maxWidth: '400px', background: 'white' }}
      >
        <h4 className="text-center mb-4">
          <FaEnvelopeOpenText className="me-2 text-primary" />
          Forgot Password
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            📩 Send Reset Link
          </button>
        </form>

        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default ForgotPassword;
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { FaLock } from 'react-icons/fa';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('/password/reset-password', {
        token,
        newPassword: password,
      });
      setMessage('✅ ' + res.data.message);
    } catch (err) {
      setError('❌ ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-start"
      style={{ minHeight: '100vh', paddingTop: '80px' }}
    >
      <div
        className="p-4 rounded shadow bg-white text-dark"
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <h4 className="text-center mb-4">
          <FaLock className="me-2 text-success" />
          Reset Password
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-success w-100" type="submit">
            🔒 Reset Password
          </button>
        </form>

        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default ResetPassword;

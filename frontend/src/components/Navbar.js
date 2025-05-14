import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSignInAlt, FaUserPlus, FaCalendarAlt, FaPlusCircle, FaUserCircle } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userRole = '';

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      userRole = decoded.role;
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">🎫 EventManager</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center flex-wrap justify-content-center gap-2">

            <li className="nav-item">
              <Link className="btn btn-outline-light btn-sm d-flex align-items-center gap-1" to="/events">
                <FaCalendarAlt /> Events
              </Link>
            </li>

            {token && (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm d-flex align-items-center gap-1" to="/my-registrations">
                    <FaCalendarAlt /> My Events
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm d-flex align-items-center gap-1" to="/profile">
                    <FaUserCircle /> Profile
                  </Link>
                </li>
              </>
            )}

            {token && userRole === 'admin' && (
              <li className="nav-item">
                <Link className="btn btn-outline-light btn-sm d-flex align-items-center gap-1" to="/create-event">
                  <FaPlusCircle /> Create
                </Link>
              </li>
            )}

            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm d-flex align-items-center gap-1" to="/login">
                    <FaSignInAlt /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm d-flex align-items-center gap-1" to="/register">
                    <FaUserPlus /> Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-danger btn-sm d-flex align-items-center gap-1" onClick={logout}>
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

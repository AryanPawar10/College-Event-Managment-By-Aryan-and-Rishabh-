import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userRole = '';

  // Decode token to get user role
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

        <div className="collapse navbar-collapse show" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">

            <li className="nav-item">
              <Link className="nav-link text-white fw-medium" to="/events">Events</Link>
            </li>

            {token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white fw-medium" to="/my-registrations">My Events</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white fw-medium" to="/profile">Profile</Link>
                </li>
              </>
            )}

            {token && userRole === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link text-white fw-medium" to="/create-event">Create Event</Link>
              </li>
            )}

            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm ms-1" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-danger btn-sm ms-2" onClick={logout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

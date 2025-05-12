import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events'; // ✅ Now homepage
import Profile from './pages/Profile';
import CreateEvent from './pages/CreateEvent';
import MyRegistrations from './pages/MyRegistrations';
import EventRegistrations from './pages/EventRegistrations'; // ✅ Admin View Registrations
import ForgotPassword from './pages/ForgotPassword';         // ✅ Forgot Password Page
import ResetPassword from './pages/ResetPassword';           // ✅ Reset Password Page

import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* ✅ Full-width homepage */}
        <Route path="/" element={<Events />} />
        <Route path="/events" element={<Events />} />

        {/* ✅ Wrapped in container for layout consistency */}
        <Route path="/login" element={<div className="container mt-5"><Login /></div>} />
        <Route path="/register" element={<div className="container mt-5"><Register /></div>} />
        <Route path="/profile" element={<div className="container mt-5"><Profile /></div>} />
        <Route path="/create-event" element={<div className="container mt-5"><CreateEvent /></div>} />
        <Route path="/my-registrations" element={<div className="container mt-5"><MyRegistrations /></div>} />
        <Route path="/event-registrations/:eventId" element={<div className="container mt-5"><EventRegistrations /></div>} />
        <Route path="/forgot-password" element={<div className="container mt-5"><ForgotPassword /></div>} />
        <Route path="/reset-password/:token" element={<div className="container mt-5"><ResetPassword /></div>} />
      </Routes>
    </Router>
  );
}

export default App;
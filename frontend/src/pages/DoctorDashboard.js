import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

import DoctorHome from './doctor/DoctorHome';
import MyAppointments from './doctor/MyAppointments';
import DoctorProfile from './doctor/DoctorProfile';
import DoctorAnalytics from './doctor/DoctorAnalytics';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2 className="dashboard-logo">MediConnect - Doctor</h2>
        <div className="nav-menu">
          <Link to="/doctor" className="nav-link">Dashboard</Link>
          <Link to="/doctor/appointments" className="nav-link">Appointments</Link>
          <Link to="/doctor/profile" className="nav-link">Profile</Link>
          <Link to="/doctor/analytics" className="nav-link">Analytics</Link>
          <button onClick={handleLogout} className="glass-button">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<DoctorHome />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/profile" element={<DoctorProfile />} />
          <Route path="/analytics" element={<DoctorAnalytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default DoctorDashboard;



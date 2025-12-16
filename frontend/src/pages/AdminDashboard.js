import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

import AdminHome from './admin/AdminHome';
import ManageUsers from './admin/ManageUsers';
import ManageAppointments from './admin/ManageAppointments';
import ManageOrders from './admin/ManageOrders';
import Analytics from './admin/Analytics';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2 className="dashboard-logo">MediConnect - Admin</h2>
        <div className="nav-menu">
          <Link to="/admin" className="nav-link">Dashboard</Link>
          <Link to="/admin/users" className="nav-link">Users</Link>
          <Link to="/admin/appointments" className="nav-link">Appointments</Link>
          <Link to="/admin/orders" className="nav-link">Orders</Link>
          <Link to="/admin/analytics" className="nav-link">Analytics</Link>
          <button onClick={handleLogout} className="glass-button">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/appointments" element={<ManageAppointments />} />
          <Route path="/orders" element={<ManageOrders />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;



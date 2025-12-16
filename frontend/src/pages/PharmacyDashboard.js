import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

import PharmacyHome from './pharmacy/PharmacyHome';
import ManageOrders from './pharmacy/ManageOrders';
import ManageMedicines from './pharmacy/ManageMedicines';

const PharmacyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2 className="dashboard-logo">MediConnect - Pharmacy</h2>
        <div className="nav-menu">
          <Link to="/pharmacy" className="nav-link">Dashboard</Link>
          <Link to="/pharmacy/orders" className="nav-link">Orders</Link>
          <Link to="/pharmacy/medicines" className="nav-link">Medicines</Link>
          <button onClick={handleLogout} className="glass-button">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<PharmacyHome />} />
          <Route path="/orders" element={<ManageOrders />} />
          <Route path="/medicines" element={<ManageMedicines />} />
        </Routes>
      </div>
    </div>
  );
};

export default PharmacyDashboard;



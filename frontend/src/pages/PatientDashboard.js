import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

// Patient Components
import PatientHome from './patient/PatientHome';
import SearchDoctors from './patient/SearchDoctors';
import MyAppointments from './patient/MyAppointments';
import MyPrescriptions from './patient/MyPrescriptions';
import PharmacyOrder from './patient/PharmacyOrder';
import MyOrders from './patient/MyOrders';
import MedicalHistory from './patient/MedicalHistory';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2 className="dashboard-logo">MediConnect</h2>
        <div className="nav-menu">
          <Link to="/patient" className="nav-link">Home</Link>
          <Link to="/patient/search-doctors" className="nav-link">Find Doctors</Link>
          <Link to="/patient/appointments" className="nav-link">Appointments</Link>
          <Link to="/patient/prescriptions" className="nav-link">Prescriptions</Link>
          <Link to="/patient/pharmacy" className="nav-link">Pharmacy</Link>
          <Link to="/patient/orders" className="nav-link">My Orders</Link>
          <Link to="/patient/history" className="nav-link">Medical History</Link>
          <button onClick={handleLogout} className="glass-button">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<PatientHome />} />
          <Route path="/search-doctors" element={<SearchDoctors />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/prescriptions" element={<MyPrescriptions />} />
          <Route path="/pharmacy" element={<PharmacyOrder />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/history" element={<MedicalHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default PatientDashboard;



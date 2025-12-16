import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import './PatientHome.css';

const PatientHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    appointments: 0,
    prescriptions: 0,
    orders: 0
  });
  const [loginInfo, setLoginInfo] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchLoginInfo();
  }, []);

  const fetchStats = async () => {
    try {
      const [appointmentsRes, prescriptionsRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/patients/appointments'),
        axios.get('http://localhost:5000/api/patients/prescriptions'),
        axios.get('http://localhost:5000/api/patients/orders')
      ]);

      setStats({
        appointments: appointmentsRes.data.length,
        prescriptions: prescriptionsRes.data.length,
        orders: ordersRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLoginInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/auth/login-history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoginInfo(res.data);
    } catch (error) {
      console.error('Error fetching login info:', error);
    }
  };

  return (
    <div className="patient-home">
      <div className="welcome-section">
        <h1>Welcome, {user?.name}</h1>
        <p>Manage your healthcare needs from one place</p>
        {loginInfo && loginInfo.lastLoginAsPatient && (
          <div className="login-info">
            <p className="last-login">
              Last login as Patient: {format(new Date(loginInfo.lastLoginAsPatient), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <h3>{stats.appointments}</h3>
          <p>Appointments</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{stats.prescriptions}</h3>
          <p>Prescriptions</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{stats.orders}</h3>
          <p>Orders</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/patient/search-doctors" className="glass-card action-card">
            <h3>Find Doctors</h3>
            <p>Search and book appointments</p>
          </Link>
          <Link to="/patient/pharmacy" className="glass-card action-card">
            <h3>Order Medicines</h3>
            <p>Upload prescription and order</p>
          </Link>
          <Link to="/patient/appointments" className="glass-card action-card">
            <h3>My Appointments</h3>
            <p>View and manage appointments</p>
          </Link>
          <Link to="/patient/history" className="glass-card action-card">
            <h3>Medical History</h3>
            <p>View complete medical records</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientHome;


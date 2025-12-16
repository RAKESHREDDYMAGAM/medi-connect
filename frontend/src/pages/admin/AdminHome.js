import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import './AdminHome.css';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingDoctors: 0
  });
  const [loginInfo, setLoginInfo] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchLoginInfo();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/analytics');
      setStats(res.data);
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
    <div className="admin-home">
      <div className="welcome-section">
        <h1>Admin Dashboard</h1>
        <p>Manage the entire MediConnect platform</p>
        {loginInfo && (
          <div className="login-info">
            {loginInfo.lastLoginAsAdmin && (
              <p className="last-login">
                Last login as Admin: {format(new Date(loginInfo.lastLoginAsAdmin), 'MMM dd, yyyy HH:mm')}
              </p>
            )}
            {(loginInfo.lastLoginAsPatient || loginInfo.lastLoginAsDoctor || loginInfo.lastLoginAsPharmacist) && (
              <div className="role-logins">
                <p className="login-title">Login History by Role:</p>
                {loginInfo.lastLoginAsPatient && (
                  <p className="role-login">Patient: {format(new Date(loginInfo.lastLoginAsPatient), 'MMM dd, yyyy HH:mm')}</p>
                )}
                {loginInfo.lastLoginAsDoctor && (
                  <p className="role-login">Doctor: {format(new Date(loginInfo.lastLoginAsDoctor), 'MMM dd, yyyy HH:mm')}</p>
                )}
                {loginInfo.lastLoginAsPharmacist && (
                  <p className="role-login">Pharmacist: {format(new Date(loginInfo.lastLoginAsPharmacist), 'MMM dd, yyyy HH:mm')}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{stats.totalDoctors}</h3>
          <p>Doctors</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{stats.totalPatients}</h3>
          <p>Patients</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{stats.totalAppointments}</h3>
          <p>Appointments</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{stats.totalOrders}</h3>
          <p>Orders</p>
        </div>
        <div className="glass-card stat-card">
          <h3>₹{stats.totalRevenue}</h3>
          <p>Total Revenue</p>
        </div>
        <div className="glass-card stat-card warning">
          <h3>{stats.pendingDoctors}</h3>
          <p>Pending Approvals</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/users" className="glass-card action-card">
            <h3>Manage Users</h3>
            <p>View and manage all users</p>
          </Link>
          <Link to="/admin/appointments" className="glass-card action-card">
            <h3>View Appointments</h3>
            <p>Monitor all appointments</p>
          </Link>
          <Link to="/admin/orders" className="glass-card action-card">
            <h3>View Orders</h3>
            <p>Monitor pharmacy orders</p>
          </Link>
          <Link to="/admin/analytics" className="glass-card action-card">
            <h3>Analytics</h3>
            <p>View detailed analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;


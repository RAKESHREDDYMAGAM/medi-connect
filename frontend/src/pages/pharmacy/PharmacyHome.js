import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import './PharmacyHome.css';

const PharmacyHome = () => {
  const [loginInfo, setLoginInfo] = useState(null);

  useEffect(() => {
    fetchLoginInfo();
  }, []);

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
    <div className="pharmacy-home">
      <div className="welcome-section">
        <h1>Pharmacy Dashboard</h1>
        <p>Manage orders and inventory</p>
        {loginInfo && loginInfo.lastLoginAsPharmacist && (
          <div className="login-info">
            <p className="last-login">
              Last login as Pharmacist: {format(new Date(loginInfo.lastLoginAsPharmacist), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/pharmacy/orders" className="glass-card action-card">
            <h3>Manage Orders</h3>
            <p>View and process pharmacy orders</p>
          </Link>
          <Link to="/pharmacy/medicines" className="glass-card action-card">
            <h3>Manage Medicines</h3>
            <p>Update inventory and stock</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PharmacyHome;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password, formData.role);

    if (result.success) {
      toast.success('Login successful!');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = user.role || 'patient';
      
      // Navigate based on role
      if (role === 'pharmacist') {
        navigate('/pharmacy');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/${role}`);
      }
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <h2 className="auth-title">Login to MediConnect</h2>
        <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
          <strong>Demo Accounts:</strong><br/>
          Admin: admin@mediconnect.com / admin123<br/>
          Doctor: abhi@doctor.com / doctor123<br/>
          Patient: patient@test.com / patient123<br/>
          Pharmacist: pharmacist@test.com / pharma123
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '500' }}>
              Select Your Role:
            </label>
            <select
              name="role"
              className="glass-input"
              value={formData.role}
              onChange={handleChange}
              required
              style={{ cursor: 'pointer' }}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="glass-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="glass-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="glass-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


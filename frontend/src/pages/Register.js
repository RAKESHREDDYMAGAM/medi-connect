import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'patient',
    specialization: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    pharmacyName: '',
    licenseNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      toast.success('Registration successful!');
      // Navigate based on role
      if (formData.role === 'pharmacist') {
        navigate('/pharmacy');
      } else if (formData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/${formData.role}`);
      }
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <h2 className="auth-title">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="glass-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
            placeholder="Password (min 6 characters)"
            className="glass-input"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="glass-input"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="glass-input"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="admin">Admin</option>
          </select>
          {formData.role === 'doctor' && (
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              className="glass-input"
              value={formData.specialization}
              onChange={handleChange}
            />
          )}
          {formData.role === 'pharmacist' && (
            <>
              <input
                type="text"
                name="pharmacyName"
                placeholder="Pharmacy Name"
                className="glass-input"
                value={formData.pharmacyName || ''}
                onChange={handleChange}
              />
              <input
                type="text"
                name="licenseNumber"
                placeholder="License Number"
                className="glass-input"
                value={formData.licenseNumber || ''}
                onChange={handleChange}
              />
            </>
          )}
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="glass-input"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            className="glass-input"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <select
            name="gender"
            className="glass-input"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <button type="submit" className="glass-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;


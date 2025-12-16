import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`);
        
        if (res.data.token) {
          // Auto-login user
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          
          setStatus('success');
          setMessage('Email verified successfully! Redirecting...');
          
          toast.success('Email verified! Welcome to MediConnect!');
          
          // Redirect based on role
          setTimeout(() => {
            const role = res.data.user.role;
            if (role === 'pharmacist') {
              navigate('/pharmacy');
            } else if (role === 'admin') {
              navigate('/admin');
            } else {
              navigate(`/${role}`);
            }
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link may have expired.');
        toast.error('Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <h2 className="auth-title">Email Verification</h2>
        {status === 'verifying' && (
          <div>
            <div className="spinner"></div>
            <p style={{ textAlign: 'center', marginTop: '20px', color: 'rgba(255,255,255,0.8)' }}>
              {message}
            </p>
          </div>
        )}
        {status === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>✅ {message}</p>
            <Link to="/login" className="glass-button">Go to Dashboard</Link>
          </div>
        )}
        {status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,100,100,0.9)', marginBottom: '20px' }}>❌ {message}</p>
            <Link to="/register" className="glass-button">Register Again</Link>
            <Link to="/login" className="glass-button" style={{ marginLeft: '10px' }}>Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;



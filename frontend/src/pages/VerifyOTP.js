import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState(location.state?.email || '');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      document.getElementById('otp-5')?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp: otpString
      });

      if (res.data.token) {
        // Auto-login user
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        toast.success('OTP verified! Welcome to MediConnect!');
        
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
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
      toast.success('OTP resent! Please check your email.');
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <h2 className="auth-title">Verify Your Email</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>
          We've sent a 6-digit OTP to <strong>{email}</strong>
        </p>
        
        <form onSubmit={handleVerify}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="glass-input"
                style={{
                  width: '50px',
                  height: '60px',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button 
            type="submit" 
            className="glass-button" 
            disabled={loading || otp.join('').length !== 6}
            style={{ width: '100%', marginBottom: '15px' }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
              Didn't receive the OTP?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="glass-button"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>

          <p className="auth-link" style={{ marginTop: '20px' }}>
            <Link to="/login">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;



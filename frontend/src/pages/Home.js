import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'patient': return '/patient';
      case 'doctor': return '/doctor';
      case 'admin': return '/admin';
      case 'pharmacist': return '/pharmacy';
      default: return '/login';
    }
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-content">
          <h1 className="logo">MediConnect</h1>
          <div className="nav-links">
            {user ? (
              <Link to={getDashboardLink()} className="glass-button">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="glass-button">Login</Link>
                <Link to="/register" className="glass-button">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your Health, Our Priority</h1>
          <p className="hero-subtitle">
            Book appointments with doctors, consult online, and order medicines - all in one place
          </p>
          {!user && (
            <div className="hero-buttons">
              <Link to="/register" className="glass-button large">Get Started</Link>
              <Link to="/login" className="glass-button large">Login</Link>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="glass-card feature-card">
              <h3>Doctor Appointments</h3>
              <p>Search and book appointments with specialized doctors</p>
            </div>
            <div className="glass-card feature-card">
              <h3>Online Consultations</h3>
              <p>Consult with doctors remotely via video calls</p>
            </div>
            <div className="glass-card feature-card">
              <h3>Pharmacy Orders</h3>
              <p>Upload prescriptions and order medicines online</p>
            </div>
            <div className="glass-card feature-card">
              <h3>Medical Records</h3>
              <p>Access your complete medical history and prescriptions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;



import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import './DoctorHome.css';

const DoctorHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    totalPrescriptions: 0
  });
  const [loginInfo, setLoginInfo] = useState(null);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchLoginInfo();
    fetchAppointments();
    fetchPrescriptions();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/doctors/analytics/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error(error.response?.data?.message || 'Error fetching statistics');
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

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const [pendingRes, completedRes] = await Promise.all([
        axios.get('http://localhost:5000/api/doctors/appointments/my-appointments?status=pending', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/doctors/appointments/my-appointments?status=completed', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setPendingAppointments(pendingRes.data.slice(0, 5)); // Show latest 5
      setCompletedAppointments(completedRes.data.slice(0, 5)); // Show latest 5
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error(error.response?.data?.message || 'Error fetching appointments');
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/doctors/prescriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrescriptions(res.data.slice(0, 5)); // Show latest 5
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error(error.response?.data?.message || 'Error fetching prescriptions');
    }
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
        status: 'confirmed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Appointment accepted successfully!');
      fetchAppointments();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error accepting appointment');
    } finally {
      setLoading(false);
    }
  };

  const handlePostponeAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
        status: 'cancelled'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Appointment postponed successfully!');
      fetchAppointments();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error postponing appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-home">
      <div className="welcome-section">
        <h1>Welcome, {user?.name}</h1>
        <p>Manage your appointments and consultations</p>
        {loginInfo && loginInfo.lastLoginAsDoctor && (
          <div className="login-info">
            <p className="last-login">
              Last login as Doctor: {format(new Date(loginInfo.lastLoginAsDoctor), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <h3>{stats.totalAppointments}</h3>
          <p>Appointments</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{stats.totalPrescriptions}</h3>
          <p>Prescriptions</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{stats.pendingAppointments}</h3>
          <p>Pending</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{stats.completedAppointments}</h3>
          <p>Completed</p>
        </div>
      </div>

      <div className="appointments-sections">
        {pendingAppointments.length > 0 && (
          <div className="appointments-section">
            <h2>Pending Appointments</h2>
            <div className="appointments-list">
              {pendingAppointments.map((appointment) => (
                <div key={appointment._id} className="glass-card appointment-item">
                  <div className="appointment-header">
                    <h4>{appointment.patient?.name}</h4>
                    <span className="status-badge pending">Pending</span>
                  </div>
                  <p className="appointment-detail">
                    <strong>Date:</strong> {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="appointment-detail">
                    <strong>Time:</strong> {appointment.appointmentTime}
                  </p>
                  {appointment.symptoms && (
                    <p className="appointment-detail">
                      <strong>Symptoms:</strong> {appointment.symptoms}
                    </p>
                  )}
                  <div className="appointment-actions">
                    <button
                      onClick={() => handleAcceptAppointment(appointment._id)}
                      className="action-btn accept-btn"
                      disabled={loading}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handlePostponeAppointment(appointment._id)}
                      className="action-btn postpone-btn"
                      disabled={loading}
                    >
                      Postpone
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {pendingAppointments.length >= 5 && (
              <Link to="/doctor/appointments?status=pending" className="view-all-link">
                View All Pending Appointments →
              </Link>
            )}
          </div>
        )}

        {completedAppointments.length > 0 && (
          <div className="appointments-section">
            <h2>Completed Appointments</h2>
            <div className="appointments-list">
              {completedAppointments.map((appointment) => (
                <div key={appointment._id} className="glass-card appointment-item">
                  <div className="appointment-header">
                    <h4>{appointment.patient?.name}</h4>
                    <span className="status-badge completed">Completed</span>
                  </div>
                  <p className="appointment-detail">
                    <strong>Date:</strong> {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="appointment-detail">
                    <strong>Time:</strong> {appointment.appointmentTime}
                  </p>
                  {appointment.diagnosis && (
                    <p className="appointment-detail">
                      <strong>Diagnosis:</strong> {appointment.diagnosis}
                    </p>
                  )}
                  {appointment.prescription && (
                    <p className="appointment-detail prescription-indicator">
                      ✓ Prescription Issued
                    </p>
                  )}
                  <Link to="/doctor/appointments" className="view-link">View Details →</Link>
                </div>
              ))}
            </div>
            {completedAppointments.length >= 5 && (
              <Link to="/doctor/appointments?status=completed" className="view-all-link">
                View All Completed Appointments →
              </Link>
            )}
          </div>
        )}

        {prescriptions.length > 0 && (
          <div className="appointments-section">
            <h2>Recent Prescriptions</h2>
            <div className="appointments-list">
              {prescriptions.map((prescription) => (
                <div key={prescription._id} className="glass-card appointment-item">
                  <div className="appointment-header">
                    <h4>{prescription.patient?.name}</h4>
                    <span className="status-badge completed">Prescription</span>
                  </div>
                  <p className="appointment-detail">
                    <strong>Date:</strong> {format(new Date(prescription.createdAt), 'MMM dd, yyyy')}
                  </p>
                  {prescription.diagnosis && (
                    <p className="appointment-detail">
                      <strong>Diagnosis:</strong> {prescription.diagnosis}
                    </p>
                  )}
                  {prescription.medicines && prescription.medicines.length > 0 && (
                    <p className="appointment-detail">
                      <strong>Medicines:</strong> {prescription.medicines.length} medicine(s)
                    </p>
                  )}
                  <Link to="/doctor/appointments" className="view-link">View Details →</Link>
                </div>
              ))}
            </div>
            {prescriptions.length >= 5 && (
              <Link to="/doctor/appointments" className="view-all-link">
                View All Prescriptions →
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/doctor/appointments" className="glass-card action-card">
            <h3>My Appointments</h3>
            <p>View and manage all appointments</p>
          </Link>
          <Link to="/doctor/profile" className="glass-card action-card">
            <h3>Update Profile</h3>
            <p>Manage your schedule and profile</p>
          </Link>
          <Link to="/doctor/analytics" className="glass-card action-card">
            <h3>Analytics</h3>
            <p>View your performance metrics</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;


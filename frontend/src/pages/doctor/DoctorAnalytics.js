import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DoctorAnalytics.css';

const DoctorAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors/analytics/dashboard');
      setAnalytics(res.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (!analytics) return <p>No data available</p>;

  const chartData = [
    { name: 'Total', value: analytics.totalAppointments },
    { name: 'Completed', value: analytics.completedAppointments },
    { name: 'Pending', value: analytics.pendingAppointments }
  ];

  return (
    <div className="doctor-analytics">
      <h2>Analytics Dashboard</h2>
      <div className="analytics-grid">
        <div className="glass-card stat-card">
          <h3>{analytics.totalAppointments}</h3>
          <p>Total Appointments</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{analytics.completedAppointments}</h3>
          <p>Completed</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{analytics.pendingAppointments}</h3>
          <p>Pending</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{analytics.totalPatients}</h3>
          <p>Total Patients</p>
        </div>
      </div>
      <div className="chart-section glass-card">
        <h3>Appointment Statistics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DoctorAnalytics;



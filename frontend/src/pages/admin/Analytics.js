import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/analytics');
      setAnalytics(res.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (!analytics) return <p>No data available</p>;

  const appointmentTrendsData = analytics.appointmentTrends.map(trend => ({
    date: trend._id,
    count: trend.count
  }));

  return (
    <div className="analytics">
      <h2>Analytics Dashboard</h2>
      
      <div className="analytics-grid">
        <div className="glass-card stat-card">
          <h3>{analytics.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{analytics.totalDoctors}</h3>
          <p>Doctors</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{analytics.totalPatients}</h3>
          <p>Patients</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{analytics.totalAppointments}</h3>
          <p>Appointments</p>
        </div>
        <div className="glass-card stat-card">
          <h3>{analytics.totalOrders}</h3>
          <p>Orders</p>
        </div>
        <div className="glass-card stat-card">
          <h3>₹{analytics.totalRevenue}</h3>
          <p>Revenue</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="glass-card chart-card">
          <h3>Appointment Trends (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;



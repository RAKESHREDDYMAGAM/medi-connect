import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MedicalHistory.css';

const MedicalHistory = () => {
  const [history, setHistory] = useState({ appointments: [], prescriptions: [], orders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients/medical-history');
      setHistory(res.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="medical-history">
      <h2>Medical History</h2>

      <div className="history-section">
        <h3>Completed Appointments ({history.appointments.length})</h3>
        <div className="history-list">
          {history.appointments.map((appointment) => (
            <div key={appointment._id} className="glass-card history-item">
              <p><strong>Doctor:</strong> Dr. {appointment.doctor?.name}</p>
              <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
              {appointment.diagnosis && <p><strong>Diagnosis:</strong> {appointment.diagnosis}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="history-section">
        <h3>Prescriptions ({history.prescriptions.length})</h3>
        <div className="history-list">
          {history.prescriptions.map((prescription) => (
            <div key={prescription._id} className="glass-card history-item">
              <p><strong>Doctor:</strong> Dr. {prescription.doctor?.name}</p>
              <p><strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</p>
              {prescription.diagnosis && <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="history-section">
        <h3>Delivered Orders ({history.orders.length})</h3>
        <div className="history-list">
          {history.orders.map((order) => (
            <div key={order._id} className="glass-card history-item">
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;



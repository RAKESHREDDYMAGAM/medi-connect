import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './ManageAppointments.css';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="manage-appointments">
      <h2>All Appointments</h2>
      <div className="appointments-list">
        {appointments.map((appointment) => (
          <div key={appointment._id} className="glass-card appointment-card">
            <div className="appointment-header">
              <h3>Appointment #{appointment._id.slice(-6)}</h3>
              <span className={`status ${appointment.status}`}>{appointment.status}</span>
            </div>
            <p><strong>Doctor:</strong> Dr. {appointment.doctor?.name}</p>
            <p><strong>Patient:</strong> {appointment.patient?.name}</p>
            <p><strong>Date:</strong> {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}</p>
            <p><strong>Time:</strong> {appointment.appointmentTime}</p>
            <p><strong>Type:</strong> {appointment.consultationType}</p>
            {appointment.diagnosis && <p><strong>Diagnosis:</strong> {appointment.diagnosis}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAppointments;



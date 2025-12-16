import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import './MyAppointments.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients/appointments');
      setAppointments(res.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Error fetching appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Filter by search term (doctor name or specialization)
    if (searchTerm && searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(apt => 
        apt.doctor?.name?.toLowerCase().includes(search) ||
        apt.doctor?.specialization?.toLowerCase().includes(search) ||
        apt.symptoms?.toLowerCase().includes(search)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/cancel`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      toast.error('Error cancelling appointment');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="my-appointments">
      <h2>My Appointments</h2>
      
      <div className="appointment-filters">
        <input
          type="text"
          placeholder="Search by doctor name, specialty, or symptoms..."
          className="glass-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '15px' }}
        />
        <select
          className="glass-input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: '200px', marginBottom: '15px' }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : filteredAppointments.length === 0 ? (
        <p className="no-data">
          {appointments.length === 0 
            ? 'No appointments found' 
            : 'No appointments match your search criteria'}
        </p>
      ) : (
        <>
          <div className="results-count">
            Showing {filteredAppointments.length} of {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
          </div>
          <div className="appointments-list">
            {filteredAppointments.map((appointment) => (
            <div key={appointment._id} className="glass-card appointment-card">
              <div className="appointment-header">
                <h3>Dr. {appointment.doctor?.name}</h3>
                <span className={`status ${appointment.status}`}>{appointment.status}</span>
              </div>
              <p className="specialization">{appointment.doctor?.specialization}</p>
              <p>Date: {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}</p>
              <p>Time: {appointment.appointmentTime}</p>
              <p>Type: {appointment.consultationType}</p>
              {appointment.symptoms && <p>Symptoms: {appointment.symptoms}</p>}
              {appointment.diagnosis && <p>Diagnosis: {appointment.diagnosis}</p>}
              {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                <button
                  onClick={() => handleCancel(appointment._id)}
                  className="glass-button"
                >
                  Cancel
                </button>
              )}
            </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyAppointments;


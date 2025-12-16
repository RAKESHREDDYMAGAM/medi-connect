import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import './MyAppointments.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [formData, setFormData] = useState({
    diagnosis: '',
    notes: '',
    medicines: [{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/doctors/appointments/my-appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error(error.response?.data?.message || 'Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (appointment) => {
    setSelectedAppointment(appointment);
    
    // If appointment is completed and has a prescription, use it
    let medicines = [{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }];
    if (appointment.status === 'completed' && appointment.prescription) {
      if (appointment.prescription.medicines && appointment.prescription.medicines.length > 0) {
        medicines = appointment.prescription.medicines;
        setPrescriptionData(appointment.prescription);
      }
    } else {
      setPrescriptionData(null);
    }
    
    setFormData({
      diagnosis: appointment.diagnosis || '',
      notes: appointment.notes || '',
      medicines: medicines
    });
    setShowModal(true);
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...formData.medicines];
    updated[index][field] = value;
    setFormData({ ...formData, medicines: updated });
  };

  const removeMedicine = (index) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/doctors/appointments/${selectedAppointment._id}`, {
        diagnosis: formData.diagnosis,
        notes: formData.notes,
        prescription: {
          medicines: formData.medicines.filter(m => m.medicineName)
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(selectedAppointment?.status === 'completed' 
        ? 'Appointment updated successfully!' 
        : 'Appointment completed successfully!');
      setShowModal(false);
      setPrescriptionData(null);
      fetchAppointments();
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast.error(error.response?.data?.message || 'Error completing appointment');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="doctor-appointments">
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
            No appointments found
          </p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
          <div key={appointment._id} className="glass-card appointment-card">
            <div className="appointment-header">
              <h3>{appointment.patient?.name}</h3>
              <span className={`status ${appointment.status}`}>{appointment.status}</span>
            </div>
            <p>Email: {appointment.patient?.email}</p>
            <p>Phone: {appointment.patient?.phone}</p>
            <p>Date: {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}</p>
            <p>Time: {appointment.appointmentTime}</p>
            {appointment.symptoms && <p>Symptoms: {appointment.symptoms}</p>}
            {appointment.diagnosis && (
              <p><strong>Diagnosis:</strong> {appointment.diagnosis}</p>
            )}
            {appointment.notes && (
              <p><strong>Notes:</strong> {appointment.notes}</p>
            )}
            {appointment.prescription && (
              <p style={{ color: '#28a745' }}>✓ Prescription Issued</p>
            )}
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              {appointment.status === 'pending' && (
                <button
                  onClick={() => handleComplete(appointment)}
                  className="glass-button"
                >
                  Complete Consultation
                </button>
              )}
              {appointment.status === 'completed' && (
                <button
                  onClick={() => handleComplete(appointment)}
                  className="glass-button"
                  style={{ background: 'rgba(255, 193, 7, 0.3)', color: '#ffc107', border: '1px solid rgba(255, 193, 7, 0.5)' }}
                >
                  Update Consultation
                </button>
              )}
            </div>
          </div>
        ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedAppointment?.status === 'completed' ? 'Update Consultation' : 'Complete Consultation'}</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                placeholder="Diagnosis"
                className="glass-input"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                rows="3"
                required
              />
              <textarea
                placeholder="Notes"
                className="glass-input"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
              />
              <div className="medicines-section">
                <h4>Prescription</h4>
                {formData.medicines.map((med, idx) => (
                  <div key={idx} className="medicine-form">
                    <input
                      type="text"
                      placeholder="Medicine Name"
                      className="glass-input"
                      value={med.medicineName}
                      onChange={(e) => updateMedicine(idx, 'medicineName', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Dosage"
                      className="glass-input"
                      value={med.dosage}
                      onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Frequency"
                      className="glass-input"
                      value={med.frequency}
                      onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      className="glass-input"
                      value={med.duration}
                      onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Instructions"
                      className="glass-input"
                      value={med.instructions}
                      onChange={(e) => updateMedicine(idx, 'instructions', e.target.value)}
                    />
                    {formData.medicines.length > 1 && (
                      <button type="button" onClick={() => removeMedicine(idx)} className="glass-button">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addMedicine} className="glass-button">
                  Add Medicine
                </button>
              </div>
              <button type="submit" className="glass-button">
                {selectedAppointment?.status === 'completed' ? 'Update' : 'Complete'}
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="glass-button">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;



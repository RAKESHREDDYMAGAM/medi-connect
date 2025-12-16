import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './MyPrescriptions.css';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const copyPrescriptionId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success('Prescription ID copied to clipboard!');
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients/prescriptions');
      setPrescriptions(res.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="my-prescriptions">
      <h2>My Prescriptions</h2>
      <div className="prescriptions-list">
        {prescriptions.length === 0 ? (
          <p className="no-data">No prescriptions found</p>
        ) : (
          prescriptions.map((prescription) => (
            <div key={prescription._id} className="glass-card prescription-card">
              <div className="prescription-header">
                <h3>Dr. {prescription.doctor?.name}</h3>
                <p>{format(new Date(prescription.createdAt), 'MMM dd, yyyy')}</p>
              </div>
              <div className="prescription-id-section">
                <strong>Prescription ID:</strong>
                <div className="prescription-id-container">
                  <code className="prescription-id">{prescription._id}</code>
                  <button 
                    className="copy-btn glass-button"
                    onClick={() => copyPrescriptionId(prescription._id)}
                    title="Copy Prescription ID"
                  >
                    Copy ID
                  </button>
                </div>
                <p className="prescription-id-hint">Use this ID when ordering medicines from Pharmacy</p>
                <Link to="/patient/pharmacy" className="order-link glass-button">
                  Order Medicines with this Prescription
                </Link>
              </div>
              {prescription.diagnosis && (
                <div className="diagnosis">
                  <strong>Diagnosis:</strong> {prescription.diagnosis}
                </div>
              )}
              {prescription.medicines && prescription.medicines.length > 0 && (
                <div className="medicines">
                  <strong>Medicines:</strong>
                  <ul>
                    {prescription.medicines.map((med, idx) => (
                      <li key={idx}>
                        {med.medicineName} - {med.dosage} - {med.frequency} - {med.duration}
                        {med.instructions && ` (${med.instructions})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {prescription.notes && (
                <div className="notes">
                  <strong>Notes:</strong> {prescription.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPrescriptions;


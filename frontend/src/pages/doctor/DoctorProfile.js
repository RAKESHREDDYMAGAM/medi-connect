import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    specialization: '',
    qualifications: '',
    experience: '',
    consultationFee: '',
    availableSlots: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        specialization: user.specialization || '',
        qualifications: user.qualifications?.join(', ') || '',
        experience: user.experience || '',
        consultationFee: user.consultationFee || '',
        availableSlots: user.availableSlots || []
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('http://localhost:5000/api/doctors/profile', formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-profile">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit} className="glass-card">
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          className="glass-input"
          value={formData.specialization}
          onChange={handleChange}
        />
        <input
          type="text"
          name="qualifications"
          placeholder="Qualifications (comma separated)"
          className="glass-input"
          value={formData.qualifications}
          onChange={handleChange}
        />
        <input
          type="number"
          name="experience"
          placeholder="Experience (years)"
          className="glass-input"
          value={formData.experience}
          onChange={handleChange}
        />
        <input
          type="number"
          name="consultationFee"
          placeholder="Consultation Fee (₹)"
          className="glass-input"
          value={formData.consultationFee}
          onChange={handleChange}
        />
        <button type="submit" className="glass-button" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default DoctorProfile;



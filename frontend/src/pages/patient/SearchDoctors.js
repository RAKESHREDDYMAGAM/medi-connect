import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './SearchDoctors.css';

const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    consultationType: 'in-person',
    symptoms: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timer);
  }, [searchTerm, specialization]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm && searchTerm.trim()) params.search = searchTerm.trim();
      if (specialization && specialization.trim()) params.specialization = specialization.trim();

      const res = await axios.get('http://localhost:5000/api/doctors', { params });
      setDoctors(res.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Error fetching doctors. Please try again.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/appointments/book', {
        doctorId: selectedDoctor._id,
        ...bookingData
      });
      toast.success('Appointment booked successfully!');
      setShowBookingModal(false);
      navigate('/patient/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  return (
    <div className="search-doctors">
      <h2>Find Doctors</h2>
      
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by name or specialty..."
          className="glass-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Specialization"
          className="glass-input"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : doctors.length === 0 ? (
        <div className="no-results glass-card">
          <p>No doctors found matching your search criteria.</p>
          <p>Try searching with different terms or clear the filters.</p>
        </div>
      ) : (
        <>
          <div className="results-count">
            Found {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
          </div>
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="glass-card doctor-card">
                <h3>{doctor.name}</h3>
                <p className="specialization">{doctor.specialization}</p>
                <p className="qualifications">{doctor.qualifications?.join(', ') || 'MBBS'}</p>
                <p className="experience">Experience: {doctor.experience || 'N/A'} years</p>
                <p className="fee">Fee: ₹{doctor.consultationFee || 0}</p>
                <button
                  onClick={() => handleBookAppointment(doctor)}
                  className="glass-button"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <h3>Book Appointment with {selectedDoctor?.name}</h3>
            <form onSubmit={handleBookingSubmit}>
              <input
                type="date"
                className="glass-input"
                value={bookingData.appointmentDate}
                onChange={(e) => setBookingData({ ...bookingData, appointmentDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <input
                type="time"
                className="glass-input"
                value={bookingData.appointmentTime}
                onChange={(e) => setBookingData({ ...bookingData, appointmentTime: e.target.value })}
                required
              />
              <select
                className="glass-input"
                value={bookingData.consultationType}
                onChange={(e) => setBookingData({ ...bookingData, consultationType: e.target.value })}
              >
                <option value="in-person">In-Person</option>
                <option value="online">Online</option>
              </select>
              <textarea
                placeholder="Symptoms (optional)"
                className="glass-input"
                value={bookingData.symptoms}
                onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                rows="3"
              />
              <button type="submit" className="glass-button">Confirm Booking</button>
              <button
                type="button"
                className="glass-button"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDoctors;


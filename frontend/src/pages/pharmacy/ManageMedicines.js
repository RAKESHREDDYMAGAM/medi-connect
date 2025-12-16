import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ManageMedicines.css';

const ManageMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    category: '',
    price: '',
    stock: '',
    description: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pharmacy/medicines');
      setMedicines(res.data);
    } catch (error) {
      toast.error('Error fetching medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/pharmacy/medicines', formData);
      toast.success('Medicine added successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        genericName: '',
        manufacturer: '',
        category: '',
        price: '',
        stock: '',
        description: ''
      });
      fetchMedicines();
    } catch (error) {
      toast.error('Error adding medicine');
    }
  };

  const updateStock = async (id, stock) => {
    try {
      await axios.put(`http://localhost:5000/api/pharmacy/medicines/${id}/stock`, { stock });
      toast.success('Stock updated');
      fetchMedicines();
    } catch (error) {
      toast.error('Error updating stock');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="manage-medicines">
      <div className="medicines-header">
        <h2>Manage Medicines</h2>
        <button onClick={() => setShowModal(true)} className="glass-button">
          Add Medicine
        </button>
      </div>

      <div className="medicines-grid">
        {medicines.map((medicine) => (
          <div key={medicine._id} className="glass-card medicine-card">
            <h3>{medicine.name}</h3>
            <p>{medicine.genericName}</p>
            <p>Category: {medicine.category}</p>
            <p>Price: ₹{medicine.price}</p>
            <p>Stock: {medicine.stock}</p>
            <div className="stock-control">
              <input
                type="number"
                placeholder="Update stock"
                className="glass-input"
                onBlur={(e) => {
                  if (e.target.value) updateStock(medicine._id, parseInt(e.target.value));
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Medicine</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Medicine Name"
                className="glass-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Generic Name"
                className="glass-input"
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Manufacturer"
                className="glass-input"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                className="glass-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                className="glass-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                className="glass-input"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="glass-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
              <button type="submit" className="glass-button">Add Medicine</button>
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

export default ManageMedicines;



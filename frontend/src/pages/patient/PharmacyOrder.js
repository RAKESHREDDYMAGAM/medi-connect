import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PharmacyOrder.css';

const PharmacyOrder = () => {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionId, setPrescriptionId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedicines();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const res = await axios.get('http://localhost:5000/api/pharmacy/medicines', { params });
      setMedicines(res.data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Error fetching medicines. Please try again.');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.medicineId === medicine._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.medicineId === medicine._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        medicineId: medicine._id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1
      }]);
    }
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.medicineId !== medicineId));
  };

  const updateQuantity = (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
    } else {
      setCart(cart.map(item =>
        item.medicineId === medicineId ? { ...item, quantity } : item
      ));
    }
  };

  const handleOrder = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('items', JSON.stringify(cart.map(item => ({
        medicineId: item.medicineId,
        quantity: item.quantity
      }))));
      if (prescriptionId) formData.append('prescriptionId', prescriptionId);
      if (prescriptionFile) formData.append('prescriptionImage', prescriptionFile);

      const res = await axios.post('http://localhost:5000/api/pharmacy/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Order placed successfully!');
      setCart([]);
      setPrescriptionFile(null);
      setPrescriptionId('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order');
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="pharmacy-order">
      <h2>Order Medicines</h2>

      <div className="pharmacy-layout">
        <div className="medicines-section">
          <input
            type="text"
            placeholder="Search medicines..."
            className="glass-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading ? (
            <div className="spinner"></div>
          ) : medicines.length === 0 ? (
            <div className="no-results glass-card">
              <p>No medicines found matching your search.</p>
              <p>Try searching with different terms or clear the search.</p>
            </div>
          ) : (
            <>
              <div className="results-count">
                Found {medicines.length} medicine{medicines.length !== 1 ? 's' : ''}
              </div>
              <div className="medicines-grid">
                {medicines.map((medicine) => (
                  <div key={medicine._id} className="glass-card medicine-card">
                    <h3>{medicine.name}</h3>
                    <p>{medicine.genericName}</p>
                    <p>₹{medicine.price}</p>
                    <p>Stock: {medicine.stock}</p>
                    <button
                      onClick={() => addToCart(medicine)}
                      className="glass-button"
                      disabled={medicine.stock === 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="cart-section glass-card">
          <h3>Cart</h3>
          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.medicineId} className="cart-item">
                  <div>
                    <p>{item.name}</p>
                    <p>₹{item.price} x {item.quantity}</p>
                  </div>
                  <div className="cart-controls">
                    <button onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}>+</button>
                    <button onClick={() => removeFromCart(item.medicineId)}>Remove</button>
                  </div>
                </div>
              ))}
              <div className="cart-total">
                <strong>Total: ₹{totalAmount}</strong>
              </div>
              <div className="prescription-upload">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setPrescriptionFile(e.target.files[0])}
                />
                <input
                  type="text"
                  placeholder="Or enter prescription ID"
                  className="glass-input"
                  value={prescriptionId}
                  onChange={(e) => setPrescriptionId(e.target.value)}
                />
              </div>
              <button onClick={handleOrder} className="glass-button">Place Order</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyOrder;


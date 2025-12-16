import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './ManageOrders.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="manage-orders">
      <h2>All Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="glass-card order-card">
            <div className="order-header">
              <h3>Order #{order._id.slice(-6)}</h3>
              <span className={`status ${order.status}`}>{order.status}</span>
            </div>
            <p><strong>Patient:</strong> {order.patient?.name}</p>
            <p><strong>Date:</strong> {format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Payment:</strong> {order.paymentStatus}</p>
            {order.pharmacist && <p><strong>Pharmacist:</strong> {order.pharmacist?.name}</p>}
            <div className="order-items">
              <strong>Items:</strong>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.medicine?.name} - Qty: {item.quantity} - ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageOrders;



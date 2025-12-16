import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
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
      const res = await axios.get('http://localhost:5000/api/pharmacy/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status, trackingNumber = '') => {
    try {
      await axios.put(`http://localhost:5000/api/pharmacy/orders/${orderId}/status`, {
        status,
        trackingNumber
      });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Error updating order');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="manage-orders">
      <h2>Manage Orders</h2>
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
            {order.prescriptionImage && (
              <p><strong>Prescription:</strong> <a href={`http://localhost:5000${order.prescriptionImage}`} target="_blank" rel="noopener noreferrer">View</a></p>
            )}
            <div className="order-actions">
              {order.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateStatus(order._id, 'verified')}
                    className="glass-button"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => updateStatus(order._id, 'cancelled')}
                    className="glass-button"
                  >
                    Cancel
                  </button>
                </>
              )}
              {order.status === 'verified' && (
                <button
                  onClick={() => {
                    const tracking = prompt('Enter tracking number:');
                    if (tracking) updateStatus(order._id, 'dispatched', tracking);
                  }}
                  className="glass-button"
                >
                  Dispatch
                </button>
              )}
              {order.status === 'dispatched' && (
                <button
                  onClick={() => updateStatus(order._id, 'delivered')}
                  className="glass-button"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageOrders;



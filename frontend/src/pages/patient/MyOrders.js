import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="no-data">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="glass-card order-card">
              <div className="order-header">
                <h3>Order #{order._id.slice(-6)}</h3>
                <span className={`status ${order.status}`}>{order.status}</span>
              </div>
              <p>Date: {format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
              <p>Total: ₹{order.totalAmount}</p>
              <p>Payment: {order.paymentStatus}</p>
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
              {order.trackingNumber && (
                <p>Tracking: {order.trackingNumber}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;



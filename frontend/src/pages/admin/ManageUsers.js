import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = filter ? { role: filter } : {};
      const res = await axios.get('http://localhost:5000/api/admin/users', { params });
      setUsers(res.data);
    } catch (error) {
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const approveDoctor = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/doctors/${id}/approve`, { isApproved: true });
      toast.success('Doctor approved');
      fetchUsers();
    } catch (error) {
      toast.error('Error approving doctor');
    }
  };

  const toggleUserStatus = async (id, isActive) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/status`, { isActive: !isActive });
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="manage-users">
      <div className="users-header">
        <h2>Manage Users</h2>
        <select
          className="glass-input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="">All Users</option>
          <option value="patient">Patients</option>
          <option value="doctor">Doctors</option>
          <option value="pharmacist">Pharmacists</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="users-list">
        {users.map((user) => (
          <div key={user._id} className="glass-card user-card">
            <div className="user-header">
              <h3>{user.name}</h3>
              <span className={`role ${user.role}`}>{user.role}</span>
            </div>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            {user.role === 'doctor' && (
              <>
                <p>Specialization: {user.specialization}</p>
                <p>Approved: {user.isApproved ? 'Yes' : 'No'}</p>
                {!user.isApproved && (
                  <button
                    onClick={() => approveDoctor(user._id)}
                    className="glass-button"
                  >
                    Approve Doctor
                  </button>
                )}
              </>
            )}
            <div className="user-actions">
              <button
                onClick={() => toggleUserStatus(user._id, user.isActive)}
                className={`glass-button ${user.isActive ? 'deactivate' : 'activate'}`}
              >
                {user.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;



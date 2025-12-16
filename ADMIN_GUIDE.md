# Admin Management Guide

## 🔐 Admin Login Credentials

**Email:** `admin@mediconnect.com`  
**Password:** `admin123`

**Alternative Admin (from demo data):**  
**Email:** `admin@test.com`  
**Password:** `admin123`

---

## 📊 Admin Dashboard Features

### 1. User Management (`/admin/users`)

**Manage All Users:**
- View all users (Patients, Doctors, Pharmacists, Admins)
- Filter by role (patient, doctor, pharmacist, admin)
- Activate/Deactivate any user account
- Approve/Reject doctor registrations
- Delete users (if needed)

**Key Actions:**
- **Approve Doctor:** Click "Approve Doctor" button for pending doctors
- **Activate/Deactivate:** Toggle user account status
- **View Details:** See user information, specialization, pharmacy name, etc.

### 2. Doctor Management

**Approve New Doctors:**
- New doctor registrations require admin approval
- Go to Users → Filter by "doctor" → Find pending doctors
- Click "Approve Doctor" to activate their account

**Manage Existing Doctors:**
- View all doctors and their specializations
- Activate/Deactivate doctor accounts
- View doctor profiles and qualifications

### 3. Patient Management

**View All Patients:**
- See all registered patients
- View patient details (name, email, phone, address)
- Activate/Deactivate patient accounts
- Monitor patient activity

### 4. Pharmacist Management

**View All Pharmacists:**
- See all registered pharmacists
- View pharmacy names and license numbers
- Activate/Deactivate pharmacist accounts
- Monitor pharmacy operations

### 5. Appointments Management (`/admin/appointments`)

**Monitor All Appointments:**
- View all appointments across the system
- See appointment status (pending, confirmed, completed, cancelled)
- Filter by status
- View doctor-patient relationships
- Track appointment history

### 6. Orders Management (`/admin/orders`)

**Monitor All Pharmacy Orders:**
- View all orders from all pharmacies
- See order status (pending, verified, processing, dispatched, delivered)
- Track payment status
- View order details and items
- Monitor pharmacist activity

### 7. Analytics Dashboard (`/admin/analytics`)

**View System Statistics:**
- Total users count
- Total doctors, patients, pharmacists
- Total appointments
- Total orders
- Total revenue
- Pending doctor approvals
- Appointment trends (charts)
- Recent appointments and orders

---

## 🎯 Admin Workflow

### Daily Tasks:

1. **Approve New Doctors:**
   - Login as admin
   - Go to "Users" → Filter by "doctor"
   - Find doctors with `isApproved: false`
   - Click "Approve Doctor"

2. **Monitor System:**
   - Check Analytics dashboard for overview
   - Review pending appointments
   - Monitor order statuses

3. **User Management:**
   - Activate/Deactivate accounts as needed
   - Handle user complaints or issues
   - Maintain user database

### API Endpoints Available to Admin:

```
GET  /api/admin/users              - Get all users
GET  /api/admin/users?role=doctor  - Get users by role
PUT  /api/admin/doctors/:id/approve - Approve/reject doctor
PUT  /api/admin/users/:id/status   - Activate/deactivate user
GET  /api/admin/appointments        - Get all appointments
GET  /api/admin/orders              - Get all orders
GET  /api/admin/analytics           - Get analytics data
DELETE /api/admin/users/:id         - Delete user
```

---

## 🔒 Security Features

- **Role-Based Access Control (RBAC):** Only admin can access admin routes
- **JWT Authentication:** All admin routes require valid token
- **Authorization Middleware:** Verifies admin role before allowing access

---

## 📝 Quick Reference

### To Approve a Doctor:
1. Login as admin
2. Navigate to "Users" in admin dashboard
3. Filter by "doctor" role
4. Find doctor with pending status
5. Click "Approve Doctor" button

### To Deactivate a User:
1. Go to "Users" page
2. Find the user
3. Click "Deactivate" button
4. User will not be able to login

### To View Analytics:
1. Go to "Analytics" page
2. View charts and statistics
3. See trends and system health

---

## ✅ Admin Account Status

**Current Admin Accounts:**
1. `admin@mediconnect.com` - System Admin (Password: admin123)
2. `admin@test.com` - Admin User (Password: admin123)

Both accounts are active and ready to use!

---

## 🚀 Getting Started

1. **Login** with admin credentials
2. **Navigate** to Admin Dashboard
3. **Start Managing:**
   - Approve pending doctors
   - Monitor system activity
   - View analytics
   - Manage users

**Everything is ready for admin management!** 🎉



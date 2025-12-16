# Quick Setup Guide

## Prerequisites
- Node.js (v14+) installed
- MongoDB running (local or Atlas connection string)

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mediconnect
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Start MongoDB

Make sure MongoDB is running on your system or use MongoDB Atlas connection string.

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000

### 5. Create Admin User

To create an admin user, you can either:
1. Register a user and manually update the role in MongoDB
2. Use MongoDB shell:
```javascript
use mediconnect
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin", isApproved: true } }
)
```

### 6. Test the Application

1. Open http://localhost:3000
2. Register as a patient, doctor, or pharmacist
3. If registering as doctor, wait for admin approval
4. Start using the platform!

## Default Routes

- **Home**: http://localhost:3000
- **Patient Dashboard**: http://localhost:3000/patient
- **Doctor Dashboard**: http://localhost:3000/doctor
- **Pharmacy Dashboard**: http://localhost:3000/pharmacy
- **Admin Dashboard**: http://localhost:3000/admin

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- For Atlas, ensure IP is whitelisted

**Port Already in Use:**
- Change PORT in backend/.env
- Update API URL in frontend if needed

**Module Not Found:**
- Run `npm install` in both backend and frontend directories
- Delete node_modules and package-lock.json, then reinstall

**CORS Errors:**
- Ensure backend is running on port 5000
- Check CORS settings in backend/server.js

## Features Implemented

✅ User Authentication (JWT)
✅ Patient Portal (Search doctors, book appointments, order medicines)
✅ Doctor Dashboard (Manage appointments, issue prescriptions)
✅ Pharmacy Module (Manage orders, inventory)
✅ Admin Dashboard (User management, analytics)
✅ Payment Integration (Razorpay)
✅ File Upload (Prescriptions)
✅ Analytics & Charts

## Next Steps

1. Configure Razorpay keys for payment testing
2. Add more medicines to the database
3. Test all user flows
4. Customize UI as needed

Good luck with your submission! 🚀



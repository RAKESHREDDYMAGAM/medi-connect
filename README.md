# MediConnect - Online Healthcare Appointment & Pharmacy System

A comprehensive web-based healthcare platform built with the MERN stack that enables patients to book appointments with doctors, consult online, and purchase prescribed medicines through an integrated pharmacy system.

## Features

### For Patients
- Register/Login with secure JWT authentication
- Search doctors by name, specialty, or location
- View doctor availability and book appointments
- Upload medical prescriptions for pharmacy orders
- View medical history, prescriptions, and reports
- Receive reminders and notifications for appointments

### For Doctors
- Doctor login and profile management
- Set available timings and appointment slots
- View patient details and manage consultations
- Update diagnosis, prescriptions, and reports
- E-prescription generator with digital signatures

### Pharmacy Module
- Upload prescription images for validation
- Add medicines to cart and order online
- Real-time stock management for pharmacists
- Integration with online payment gateway (Razorpay)

### For Admin
- Manage users (doctors, patients, pharmacists)
- Approve or reject new doctor registrations
- Monitor appointments, transactions, and reports
- Generate analytics dashboard with charts

## Technology Stack

- **Frontend**: React.js, HTML5, CSS3, Axios, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Bcrypt.js
- **Payment**: Razorpay
- **File Upload**: Multer

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mediconnect
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
mediconnect/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── uploads/         # File uploads
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context API
│   │   └── App.js       # Main app component
│   └── public/          # Static files
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Patients
- `GET /api/patients/appointments` - Get patient appointments
- `GET /api/patients/prescriptions` - Get patient prescriptions
- `GET /api/patients/orders` - Get patient orders
- `GET /api/patients/medical-history` - Get medical history

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/profile` - Update doctor profile
- `GET /api/doctors/appointments/my-appointments` - Get doctor appointments
- `PUT /api/doctors/appointments/:id` - Update appointment

### Appointments
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id/status` - Update appointment status
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Pharmacy
- `GET /api/pharmacy/medicines` - Get all medicines
- `POST /api/pharmacy/orders` - Create order
- `GET /api/pharmacy/orders` - Get orders (pharmacist)
- `PUT /api/pharmacy/orders/:id/status` - Update order status

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/doctors/:id/approve` - Approve doctor
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/analytics` - Get analytics

### Payments
- `POST /api/payments/appointment/create-order` - Create payment for appointment
- `POST /api/payments/pharmacy/create-order` - Create payment for pharmacy
- `POST /api/payments/verify` - Verify payment

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Patient Flow**: 
   - Search for doctors
   - Book appointments
   - Upload prescriptions and order medicines
   - View medical history
3. **Doctor Flow**:
   - Update profile and availability
   - View and manage appointments
   - Complete consultations and issue prescriptions
4. **Pharmacist Flow**:
   - View and verify orders
   - Update medicine stock
   - Manage inventory
5. **Admin Flow**:
   - Approve doctor registrations
   - Monitor all activities
   - View analytics

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Secure file uploads
- CORS enabled

## Future Enhancements

- Online video consultation (WebRTC)
- AI-based symptom checker
- Prescription reminder notifications
- Health record vault
- Insurance integration
- Push notifications
- Dark mode
- Progressive Web App (PWA)
- Multi-language support

## License

This project is created for educational purposes.

## Contact

For questions or support, please contact the development team.



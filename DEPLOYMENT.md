# MediConnect Deployment Guide

## Pre-Deployment Checklist

### ✅ Environment Variables

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediconnect?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRE=7d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@mediconnect.com

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary (Image Upload - Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (.env)
```env
REACT_APP_API_URL=https://your-api-domain.com
```

### ✅ Security Checklist

1. **Change JWT_SECRET** - Use a strong, random secret (min 32 characters)
2. **Update CORS** - Configure allowed origins in backend
3. **Enable HTTPS** - Use SSL certificates
4. **Secure MongoDB** - Use connection string with authentication
5. **Environment Variables** - Never commit .env files

### ✅ Build Commands

#### Frontend Build
```bash
cd frontend
npm run build
```

#### Backend Start (Production)
```bash
cd backend
npm start
```

### ✅ Server Configuration

#### Update backend/server.js for production:
- Serve React build files
- Configure CORS for production domain
- Add error handling middleware
- Enable compression

### ✅ Database Setup

1. **MongoDB Atlas** (Recommended for production)
   - Create cluster
   - Whitelist server IP
   - Get connection string
   - Update MONGODB_URI

2. **Local MongoDB** (Not recommended for production)
   - Ensure MongoDB is running
   - Configure authentication
   - Enable replication

### ✅ File Uploads

- Configure Cloudinary or similar service
- Or use persistent storage (AWS S3, etc.)
- Update multer configuration

## Deployment Platforms

### Option 1: Heroku

#### Backend Deployment
```bash
# Install Heroku CLI
heroku login
heroku create mediconnect-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### Frontend Deployment (Netlify/Vercel)
```bash
# Build frontend
cd frontend
npm run build

# Deploy build folder to Netlify/Vercel
# Set environment variable:
# REACT_APP_API_URL=https://mediconnect-api.herokuapp.com
```

### Option 2: AWS/DigitalOcean

1. **Backend**
   - Use EC2/App Platform
   - Install Node.js
   - Use PM2 for process management
   - Configure Nginx reverse proxy

2. **Frontend**
   - Use S3 + CloudFront
   - Or deploy to App Platform

### Option 3: Docker

Create `Dockerfile` for both frontend and backend.

## Post-Deployment

1. **Test all endpoints**
2. **Verify email sending**
3. **Test payment gateway**
4. **Check file uploads**
5. **Monitor logs**
6. **Set up error tracking** (Sentry, etc.)

## Important Notes

- ⚠️ Never commit `.env` files
- ⚠️ Use strong passwords and secrets
- ⚠️ Enable HTTPS in production
- ⚠️ Configure CORS properly
- ⚠️ Set up database backups
- ⚠️ Monitor server resources

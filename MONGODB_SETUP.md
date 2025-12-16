# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended - Fastest)

### Steps:
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a free cluster (M0 - Free tier)
4. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Username: `mediconnect`
   - Password: Create a strong password (save it!)
5. Whitelist your IP:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
6. Get your connection string:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Update backend/.env:
Replace the MONGODB_URI with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://mediconnect:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mediconnect?retryWrites=true&w=majority
```

**Replace:**
- `mediconnect` with your username
- `YOUR_PASSWORD` with your password
- `cluster0.xxxxx` with your cluster address

## Option 2: Local MongoDB Installation

### Windows Installation:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service (recommended)
5. MongoDB will start automatically

### Verify Installation:
```bash
mongod --version
```

### Start MongoDB (if not running as service):
```bash
mongod
```

### Update backend/.env:
```
MONGODB_URI=mongodb://localhost:27017/mediconnect
```

## After Setup:
1. Restart your backend server
2. You should see "MongoDB Connected" in the console
3. The application will work!



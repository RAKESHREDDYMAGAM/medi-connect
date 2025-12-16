# Quick Email Setup Guide

## 📧 Configure Your Email to Send OTP

### Step 1: Open `backend/.env` file

Add these lines to your `.env` file:

```env
# Email Configuration for OTP Verification
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password-or-app-password
FRONTEND_URL=http://localhost:3000
```

### Step 2: Choose Your Email Provider

#### Option A: Gmail (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" → "Other (Custom name)"
   - Name it "MediConnect"
   - Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

3. **Add to `.env`:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_SERVICE=gmail
```

#### Option B: Outlook/Hotmail

```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_SERVICE=hotmail
```

#### Option C: Custom SMTP Server

```env
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
```

### Step 3: Restart Backend Server

After adding email configuration, restart your backend server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

### Step 4: Test Email

1. **Register as Admin:**
   - Go to Register page
   - Select "Admin" role
   - Enter your email
   - Submit form

2. **Check Your Email:**
   - You should receive an email with 6-digit OTP
   - Enter the OTP to verify

3. **If Email Not Received:**
   - Check backend console for OTP (development mode)
   - Verify email credentials in `.env`
   - Check spam folder

---

## 🔧 Example `.env` File

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mediconnect
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=gmail
FRONTEND_URL=http://localhost:3000
```

---

## ✅ Quick Test

1. **Add email to `.env`**
2. **Restart server**
3. **Register as Admin**
4. **Check email inbox for OTP**

**That's it! OTPs will now be sent to the email addresses you provide during registration.**

---

## 📝 Notes

- **Gmail:** Must use App Password (not regular password)
- **OTP expires:** 10 minutes
- **Max attempts:** 5 tries
- **Development mode:** If email not configured, OTP prints in console

**Ready to configure! Just add your email credentials to `backend/.env` file.**



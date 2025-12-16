# Email Setup Guide for SMTP Verification

## ✅ Dependencies Installed

**Nodemailer** is already installed and ready to use for SMTP email verification.

---

## 📧 Email Configuration Options

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "MediConnect" as the name
   - Copy the generated 16-character password

3. **Update `backend/.env` file:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
FRONTEND_URL=http://localhost:3000
```

### Option 2: Outlook/Hotmail

1. **Update `backend/.env` file:**
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
FRONTEND_URL=http://localhost:3000
```

Then update `backend/utils/emailService.js`:
```javascript
return nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### Option 3: Custom SMTP Server

Update `backend/utils/emailService.js` with your SMTP settings:
```javascript
return nodemailer.createTransport({
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### Option 4: Development Mode (No Email Setup)

If you don't configure email, the system will:
- Print OTP in backend console
- Print verification links in backend console
- Still work perfectly for testing

**Check your backend server console for:**
```
📧 OTP VERIFICATION CODE (Development Mode):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: user@example.com
OTP: 123456
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔧 Quick Setup Steps

### For Gmail:

1. **Create `backend/.env` file** (if not exists):
```bash
cd backend
# Create .env file
```

2. **Add email configuration:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
FRONTEND_URL=http://localhost:3000
```

3. **Restart backend server:**
```bash
npm run dev
```

4. **Test email sending:**
   - Register as Admin
   - Check your email inbox for OTP
   - Or check backend console if email fails

---

## 📝 Environment Variables

Add these to your `backend/.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000

# Other existing variables
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mediconnect
JWT_SECRET=your_secret_key
```

---

## ✅ Testing Email

1. **Register as Admin:**
   - Go to Register page
   - Select "Admin" role
   - Submit form

2. **Check Email:**
   - If configured: Check your inbox
   - If not configured: Check backend console

3. **Verify OTP:**
   - Enter the 6-digit OTP
   - Complete registration

---

## 🚀 Production Recommendations

For production, consider using:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **AWS SES** (Pay as you go)
- **Postmark** (Free tier: 100 emails/month)

---

## 📋 Current Status

✅ **Nodemailer installed:** Version 6.10.1  
✅ **Email service configured:** Ready to use  
✅ **Development mode:** Works without email setup (prints in console)  
✅ **Production ready:** Just add email credentials to .env

**Everything is ready! Just add your email credentials to `.env` file to enable real email sending.**



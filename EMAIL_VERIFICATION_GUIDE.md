# Email Verification Guide

## ✅ Admin Registration with Email Verification

You can now register as an **Admin** through the registration form! The system will send you an email verification link.

---

## 🔐 How It Works

### Step 1: Register as Admin
1. Go to **Register** page
2. Fill in your details
3. Select **"Admin"** from the role dropdown
4. Submit the form

### Step 2: Email Verification
- You'll receive an email with a verification link
- Click the link to verify your email
- Your admin account will be created automatically
- You'll be logged in and redirected to the Admin Dashboard

---

## 📧 Email Configuration

### For Production (Real Emails):

Add these to your `backend/.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

**For Gmail:**
1. Enable 2-Factor Authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password as `EMAIL_PASS`

### For Development (Console Log):

If email is not configured, the verification link will be printed in the **backend server console**.

**Look for this in your terminal:**
```
📧 EMAIL VERIFICATION LINK (Development Mode):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
http://localhost:3000/verify-email?token=...&email=...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Simply copy and paste this link in your browser to verify!**

---

## 🎯 Quick Test

1. **Register as Admin:**
   - Email: `your-email@example.com`
   - Password: `yourpassword`
   - Role: **Admin**

2. **Check Backend Console:**
   - Look for the verification link
   - Copy the link

3. **Open Link in Browser:**
   - Paste the verification link
   - Your account will be verified
   - You'll be logged in automatically

---

## ✅ Features

- ✅ Admin can register through the form
- ✅ Email verification required for Admin and Doctor roles
- ✅ Verification link expires in 24 hours
- ✅ Automatic login after verification
- ✅ Resend verification email option (coming soon)

---

## 🔄 Resend Verification Email

If you didn't receive the email, you can request a new one:

**API Endpoint:**
```
POST /api/auth/resend-verification
Body: { "email": "your-email@example.com" }
```

---

## 📝 Notes

- **Patient** and **Pharmacist** accounts are created immediately (no verification needed)
- **Doctor** and **Admin** accounts require email verification
- Verification tokens expire after 24 hours
- Each email can only be verified once

---

## 🚀 Ready to Use!

**Register as Admin now and check your backend console for the verification link!**



# 🔧 Configure Email for OTP Sending

## ❌ Problem: Email Not Sending

**Reason:** Email credentials not configured in `backend/.env` file.

---

## ✅ Solution: Add Email Configuration

### Your Email: `goltgamer88@gmail.com`

### Step-by-Step Instructions:

#### 1. Get Gmail App Password

**IMPORTANT:** You cannot use your regular Gmail password. You need an App Password.

1. **Go to:** https://myaccount.google.com/apppasswords
2. **If 2FA not enabled:**
   - First enable: https://myaccount.google.com/security
   - Turn on "2-Step Verification"
3. **Generate App Password:**
   - At apppasswords page, select "Mail"
   - Select "Other (Custom name)"
   - Type: "MediConnect"
   - Click "Generate"
   - **Copy the password** (16 characters, may have spaces)

#### 2. Open `backend/.env` File

Open the file: `D:\Medi-connect\backend\.env`

#### 3. Add These Lines

Add these lines to the `.env` file:

```env
EMAIL_USER=goltgamer88@gmail.com
EMAIL_PASS=your-app-password-here
FRONTEND_URL=http://localhost:3000
```

**Replace `your-app-password-here` with the 16-character App Password you copied.**

**Example:**
```env
EMAIL_USER=goltgamer88@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
FRONTEND_URL=http://localhost:3000
```

#### 4. Save the File

Save the `.env` file.

#### 5. Restart Backend Server

1. **Stop the server** (Press Ctrl+C in the terminal where backend is running)
2. **Start it again:**
   ```bash
   cd backend
   npm run dev
   ```

#### 6. Test Email

Run this command to test:
```bash
cd backend
node scripts/testEmail.js
```

If successful, you'll see:
```
✅ SMTP connection successful!
✅ Test email sent successfully!
Check your inbox: goltgamer88@gmail.com
```

---

## 📋 Requirements Summary

### Required:
1. ✅ Gmail account: `goltgamer88@gmail.com`
2. ✅ 2-Factor Authentication enabled
3. ✅ App Password generated
4. ✅ `.env` file updated with credentials
5. ✅ Backend server restarted

### What You Need:
- **EMAIL_USER:** `goltgamer88@gmail.com`
- **EMAIL_PASS:** Your 16-character Gmail App Password
- **FRONTEND_URL:** `http://localhost:3000`

---

## 🔍 Verify Configuration

After adding to `.env`, run:
```bash
cd backend
node scripts/testEmail.js
```

This will tell you if:
- ✅ Configuration is correct
- ✅ Email can be sent
- ❌ What's wrong (if any)

---

## ⚠️ Common Issues

### Issue 1: "EAUTH" Error
**Cause:** Wrong password or using regular password instead of App Password
**Solution:** Generate new App Password and use that

### Issue 2: "Email not configured"
**Cause:** EMAIL_USER or EMAIL_PASS missing in .env
**Solution:** Add both to .env file

### Issue 3: Server not restarted
**Cause:** Changes to .env not loaded
**Solution:** Restart backend server

---

## ✅ After Configuration

Once configured correctly:
- OTPs will be sent from `goltgamer88@gmail.com`
- Users will receive emails in their inbox
- No more console logging needed

**Follow these steps and email will work!** 📧



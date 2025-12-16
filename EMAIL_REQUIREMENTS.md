# 📧 Email Configuration Requirements

## ❌ Current Status: Email Not Configured

The email service is not sending emails because the configuration is missing.

---

## ✅ Required Configuration

### Step 1: Get Gmail App Password

**For Gmail (`goltgamer88@gmail.com`):**

1. **Enable 2-Factor Authentication:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" from dropdown
   - Select "Other (Custom name)"
   - Enter name: "MediConnect"
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

---

## 📝 Configuration Steps

### Step 2: Update `backend/.env` File

Open `backend/.env` file and add these lines:

```env
EMAIL_USER=goltgamer88@gmail.com
EMAIL_PASS=your-16-character-app-password-here
FRONTEND_URL=http://localhost:3000
```

**Important:**
- Use the **App Password** (not your regular Gmail password)
- Remove spaces from the password or keep them (both work)
- Example: `EMAIL_PASS=abcdefghijklmnop` or `EMAIL_PASS=abcd efgh ijkl mnop`

### Step 3: Restart Backend Server

After adding the configuration:

1. **Stop the backend server** (Ctrl+C in the terminal)
2. **Restart it:**
   ```bash
   cd backend
   npm run dev
   ```

### Step 4: Test Email

Run the test script:
```bash
cd backend
node scripts/testEmail.js
```

This will:
- Test the email configuration
- Send a test email to `goltgamer88@gmail.com`
- Verify everything is working

---

## 🔍 Troubleshooting

### If Email Still Not Sending:

1. **Check .env file:**
   - Make sure EMAIL_USER and EMAIL_PASS are set
   - No extra spaces or quotes
   - Restart server after changes

2. **Verify App Password:**
   - Make sure you're using App Password (not regular password)
   - App Password should be 16 characters
   - Regenerate if needed

3. **Check Backend Console:**
   - Look for error messages
   - Check if OTP is printed in console (fallback mode)

4. **Common Errors:**
   - `EAUTH`: Wrong password or not using App Password
   - `ECONNECTION`: Internet/network issue
   - `ETIMEDOUT`: Gmail blocking connection

---

## 📋 Complete .env Example

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mediconnect
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Email Configuration
EMAIL_USER=goltgamer88@gmail.com
EMAIL_PASS=abcdefghijklmnop
FRONTEND_URL=http://localhost:3000

# Payment (Optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## ✅ Quick Checklist

- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App Password generated
- [ ] EMAIL_USER added to .env
- [ ] EMAIL_PASS added to .env (App Password)
- [ ] FRONTEND_URL added to .env
- [ ] Backend server restarted
- [ ] Test email sent successfully

---

## 🚀 After Configuration

Once configured:
- OTPs will be sent from `goltgamer88@gmail.com`
- Users will receive OTP in their email inbox
- No more console logging (real emails sent)

**Follow these steps and email will work!** 📧



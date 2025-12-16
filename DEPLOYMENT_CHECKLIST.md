# 🚀 Deployment Readiness Checklist

## Critical Issues to Fix Before Deployment

### 1. ⚠️ Hardcoded API URLs (HIGH PRIORITY)
**Status:** ❌ Not Fixed
**Issue:** All frontend API calls use `http://localhost:5000`
**Fix Required:**
- [ ] Replace all hardcoded URLs with environment variable
- [ ] Use `REACT_APP_API_URL` from .env
- [ ] Create axios instance with base URL (see `frontend/src/utils/axiosConfig.js`)

**Files to Update:** All files in `frontend/src` that make API calls (45+ files)

### 2. ✅ Environment Variables
**Status:** ✅ Configured
- [x] Created `.env.example` files
- [x] Added to `.gitignore`
- [ ] Need to set actual values in production

### 3. ✅ CORS Configuration
**Status:** ✅ Updated
- [x] Added environment-based CORS
- [ ] Need to set `FRONTEND_URL` in production

### 4. ✅ Static File Serving
**Status:** ✅ Configured
- [x] Added React build serving in production mode
- [ ] Need to test build process

### 5. ⚠️ Security
**Status:** ⚠️ Needs Review
- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS
- [ ] Review authentication middleware
- [ ] Add rate limiting
- [ ] Add input validation

### 6. ⚠️ Database
**Status:** ⚠️ Needs Setup
- [ ] Set up MongoDB Atlas or production database
- [ ] Configure connection string
- [ ] Set up backups
- [ ] Test connection

### 7. ⚠️ Email Service
**Status:** ⚠️ Needs Configuration
- [ ] Configure email service (Gmail/SendGrid/etc.)
- [ ] Test email sending
- [ ] Set up email templates

### 8. ⚠️ Payment Gateway
**Status:** ⚠️ Needs Configuration
- [ ] Set up Razorpay account
- [ ] Configure keys
- [ ] Test payment flow

### 9. ✅ Build Scripts
**Status:** ✅ Ready
- [x] Frontend build script exists
- [x] Backend start script exists

### 10. ⚠️ Error Handling
**Status:** ⚠️ Needs Improvement
- [ ] Add global error handler
- [ ] Add error logging (Sentry, etc.)
- [ ] Improve error messages

## Quick Fix Script

To quickly replace all hardcoded URLs, you can use this approach:

1. Create axios instance (already created in `frontend/src/utils/axiosConfig.js`)
2. Replace all `axios.get/post/put/delete` with the instance
3. Or use find/replace: `http://localhost:5000` → `process.env.REACT_APP_API_URL || 'http://localhost:5000'`

## Recommended Deployment Steps

1. **Fix API URLs** (Critical)
2. **Set up MongoDB Atlas**
3. **Configure environment variables**
4. **Build frontend**: `cd frontend && npm run build`
5. **Test locally with production build**
6. **Deploy backend**
7. **Deploy frontend**
8. **Test all features**
9. **Monitor and fix issues**

## Estimated Time to Production Ready

- Fix API URLs: 2-3 hours
- Environment setup: 1 hour
- Testing: 2-3 hours
- Deployment: 1-2 hours
**Total: 6-9 hours**

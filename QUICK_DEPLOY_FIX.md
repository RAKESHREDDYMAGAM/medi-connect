# Quick Deployment Fix Guide

## 🚨 CRITICAL: Fix Hardcoded API URLs

### Option 1: Use Axios Instance (Recommended)

1. **Update AuthContext.js** to use the axios instance:
```javascript
import api from '../utils/axiosConfig';

// Replace:
axios.get('http://localhost:5000/api/auth/me')
// With:
api.get('/api/auth/me')
```

2. **Update all other files** similarly:
   - Import: `import api from '../utils/axiosConfig';` or `import api from '../../utils/axiosConfig';`
   - Replace all `axios.get/post/put/delete('http://localhost:5000/...')` with `api.get/post/put/delete('/...')`

### Option 2: Environment Variable (Quick Fix)

Replace in all files:
```javascript
// OLD:
axios.get('http://localhost:5000/api/...')

// NEW:
axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/...`)
```

## Files That Need Updating (45 files)

Run this command to find all files:
```bash
grep -r "localhost:5000" frontend/src/
```

## Production Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_secret_here
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-api-domain.com
```

## Build & Deploy

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Start backend (serves frontend in production)
cd ../backend
npm start
```

# GitHub Pages Deployment Guide

## Quick Fix for Your GitHub Pages Site

Your site at https://rakeshreddymagam.github.io/medi-connect/ is currently showing README.md instead of the React app.

## Steps to Fix:

### 1. Install gh-pages package
```bash
cd frontend
npm install --save-dev gh-pages
```

### 2. Build the React app
```bash
cd frontend
npm run build
```

### 3. Deploy to GitHub Pages

**Option A: Using gh-pages (Recommended)**
```bash
cd frontend
npm run deploy
```

**Option B: Manual Deployment**
1. Build the app: `cd frontend && npm run build`
2. Copy the `build` folder contents to a `docs` folder in the root
3. Or push the build folder to a `gh-pages` branch
4. In GitHub repository settings → Pages, set source to:
   - `gh-pages` branch (if using Option A)
   - OR `docs` folder (if using Option B)

### 4. Configure GitHub Pages Settings

1. Go to your GitHub repository: https://github.com/rakeshreddymagam/medi-connect
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Branch**: `gh-pages` (if using gh-pages deploy)
   - **Folder**: `/ (root)` or `/docs` (depending on your setup)
4. Click **Save**

### 5. Wait for Deployment

- GitHub Pages takes 1-2 minutes to update
- Your site will be available at: https://rakeshreddymagam.github.io/medi-connect/

## Important Notes:

⚠️ **Backend API Won't Work on GitHub Pages**
- GitHub Pages only serves static files
- Your backend API (localhost:5000) won't work
- You need to:
  1. Deploy backend separately (Heroku, Railway, Render, etc.)
  2. Update all API URLs in frontend to point to your deployed backend
  3. Set `REACT_APP_API_URL` environment variable

## Current Configuration:

✅ **Fixed:**
- Added `homepage` field in package.json
- Updated Router with basename for GitHub Pages
- Added deploy scripts

## After Deployment:

1. **Test the site**: Visit https://rakeshreddymagam.github.io/medi-connect/
2. **Check browser console** for any errors
3. **Update API URLs** to point to your deployed backend

## Troubleshooting:

If the site still shows README:
- Clear browser cache (Ctrl+Shift+R)
- Wait 2-3 minutes for GitHub Pages to update
- Check GitHub repository Settings → Pages for correct branch/folder
- Verify the build folder was created successfully

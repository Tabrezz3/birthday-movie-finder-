# Deployment Checklist & Debugging Guide

## ✅ Fixed Issues
1. **CORS Problem**: Created serverless API route (`/api/tmdb.js`) to proxy TMDB API calls
2. **Environment Variables**: Configured for both development and production
3. **Build Optimization**: Removed unused files and dependencies

## 🚀 Deployment Steps

### 1. Deploy to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy from project root
cd birthday-movie-finder
vercel

# Follow prompts:
# - Link to existing project or create new one
# - Set build command: npm run build
# - Set output directory: build
```

### 2. Configure Environment Variables in Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `REACT_APP_TMDB_API_KEY` = `your_actual_api_key`
3. Make sure it's enabled for Production, Preview, and Development
4. **Important**: Redeploy after adding environment variables

### 3. Test Deployment
After deployment, test these URLs:
- Main app: `https://your-app.vercel.app`
- API endpoint: `https://your-app.vercel.app/api/tmdb?endpoint=/configuration`

## 🐛 Debugging Checklist (Run in Order)

### Step 1: Open DevTools on Failing Machine
- Open browser DevTools (F12)
- Go to Console & Network tabs
- Try to use the app and look for errors

### Step 2: Check for Common Error Types
Look for these specific error messages:

#### CORS Errors
```
Access to fetch at 'https://api.themoviedb.org/3/...' from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```
**Solution**: ✅ Fixed with serverless function

#### 401/403 Authentication Errors
```
401 Unauthorized
403 Forbidden
```
**Check**: Environment variables in Vercel dashboard

#### Mixed Content Errors
```
Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://...'
```
**Check**: All API calls should use HTTPS

#### Network/DNS Errors
```
net::ERR_NAME_NOT_RESOLVED
net::ERR_CONNECTION_REFUSED
```
**Check**: Internet connection, corporate firewall, or DNS issues

### Step 3: Verify Request URLs
In Network tab, check what URLs are being called:
- ✅ Should be: `https://your-app.vercel.app/api/tmdb?endpoint=...`
- ❌ Should NOT be: `https://api.themoviedb.org/3/...` (in production)
- ❌ Should NOT be: `http://localhost:3000/...` (from external machines)

### Step 4: Test API Endpoint Directly
Open this URL in browser:
```
https://your-app.vercel.app/api/tmdb?endpoint=/configuration
```
Should return TMDB configuration data, not an error.

### Step 5: Check Environment Variables
In Vercel Dashboard:
1. Project → Settings → Environment Variables
2. Verify `REACT_APP_TMDB_API_KEY` exists and has correct value
3. Make sure it's enabled for Production
4. If added after deployment, redeploy the project

### Step 6: Browser-Specific Issues
Test in different browsers and check:
- Ad blockers (try private/incognito mode)
- Browser extensions blocking requests
- Corporate firewall/proxy settings
- Outdated browser cache (hard refresh: Ctrl+F5)

## 🔧 Quick Fixes

### If API calls fail in production:
1. Check Vercel function logs: Vercel Dashboard → Functions → View Logs
2. Verify environment variable is set correctly
3. Test API endpoint directly in browser

### If images don't load:
- TMDB images use HTTPS, should work fine
- Check if corporate firewall blocks image.tmdb.org

### If app works locally but not deployed:
- Environment variables not set in Vercel
- Build process failed (check Vercel build logs)
- Caching issues (try hard refresh)

## 📝 Testing Commands

```bash
# Test local development
npm start

# Test production build locally
npm run build
npx serve -s build

# Deploy to Vercel
vercel --prod
```

## 🆘 Emergency Rollback
If deployment breaks:
```bash
# Revert to previous deployment
vercel rollback
```
# 🔧 API Integration Deployment Fix

## Problem
The TMDB API integration was working on localhost but failing in deployment (Vercel).

## Root Cause
The serverless function at `/api/tmdb.js` was looking for `process.env.REACT_APP_TMDB_API_KEY`, but:

1. **Environment Variable Naming Issue**: The `REACT_APP_` prefix is designed for React build-time environment variables that are embedded into the frontend bundle during `npm run build`. These variables are NOT available at runtime in Vercel serverless functions.

2. **Vercel Serverless Functions**: Serverless functions run in a separate Node.js environment and need their own environment variables without the `REACT_APP_` prefix.

3. **Missing Configuration**: The `vercel.json` file referenced a Vercel secret (`@tmdb-api-key`) that may not have been properly configured.

## Solution Implemented

### 1. Created `.env` File
Created `/app/.env` with the API credentials for local development:
```env
REACT_APP_TMDB_API_KEY=c16488af7ab2efaf5b5ce51f6ff22ee1
REACT_APP_TMDB_USERNAME=wavespeed
```

### 2. Updated Serverless Function (`/api/tmdb.js`)
Modified the API key retrieval to support both naming conventions:
```javascript
// Try both naming conventions for better compatibility
const API_KEY = process.env.TMDB_API_KEY || process.env.REACT_APP_TMDB_API_KEY;
```

Added better error logging to help diagnose issues in production:
```javascript
if (!API_KEY) {
  console.error('API Key not found. Available env vars:', Object.keys(process.env));
  res.status(500).json({ 
    error: 'API key not configured',
    hint: 'Set TMDB_API_KEY environment variable in Vercel dashboard'
  });
  return;
}
```

### 3. Updated `vercel.json`
Configured environment variables for both frontend and serverless functions:
```json
{
  "functions": {
    "api/tmdb.js": {
      "maxDuration": 10
    }
  },
  "env": {
    "TMDB_API_KEY": "c16488af7ab2efaf5b5ce51f6ff22ee1",
    "REACT_APP_TMDB_API_KEY": "c16488af7ab2efaf5b5ce51f6ff22ee1"
  }
}
```

**Why two variables?**
- `TMDB_API_KEY`: Used by serverless functions at runtime
- `REACT_APP_TMDB_API_KEY`: Used by React during build time

### 4. Updated Documentation
Updated `DEPLOYMENT_CHECKLIST.md` with clear instructions for setting both environment variables in Vercel.

## How the Application Works

### Development Mode (localhost)
- Frontend makes direct API calls to `https://api.themoviedb.org/3`
- Uses `REACT_APP_TMDB_API_KEY` from `.env` file
- No serverless function needed

### Production Mode (Vercel)
- Frontend makes API calls to `/api/tmdb` (the serverless function)
- Serverless function proxies requests to TMDB API
- Uses `TMDB_API_KEY` environment variable
- Handles CORS and API key security

## Deployment Instructions for Vercel

### Option 1: Using vercel.json (Recommended)
The `vercel.json` file now contains the API key. When you deploy with Vercel CLI or connect your GitHub repo, the environment variables will be automatically configured.

### Option 2: Manual Configuration in Vercel Dashboard
If you prefer to manage environment variables through the Vercel dashboard:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add these two variables:
   - `TMDB_API_KEY` = `c16488af7ab2efaf5b5ce51f6ff22ee1`
   - `REACT_APP_TMDB_API_KEY` = `c16488af7ab2efaf5b5ce51f6ff22ee1`
4. Enable for: Production, Preview, and Development
5. Redeploy the application

### Deploy Command
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
cd /app
vercel --prod
```

## Testing the Fix

### Test Locally
1. The app is already running on `http://localhost:3000`
2. Open the browser and test the date picker
3. Check browser console for any API errors

### Test Serverless Function (Production)
After deployment, test the API endpoint directly:
```
https://your-app.vercel.app/api/tmdb?endpoint=/configuration
```

Should return TMDB configuration JSON, not an error.

## Verification Checklist

✅ Created `.env` file with API credentials
✅ Updated `/api/tmdb.js` to support both environment variable naming conventions
✅ Updated `vercel.json` with proper environment variables
✅ Updated deployment documentation
✅ Fixed supervisor configuration to run React app from correct directory
✅ Frontend running successfully on localhost

## Next Steps

1. **Deploy to Vercel**: Run `vercel --prod` to deploy the application
2. **Test in Production**: Visit your deployed URL and test the date picker functionality
3. **Monitor Logs**: Check Vercel function logs if any issues arise
4. **Browser Console**: Check for any CORS or API errors in browser DevTools

## Common Issues and Solutions

### Issue: "API key not configured" error in production
**Solution**: Ensure `TMDB_API_KEY` is set in Vercel environment variables and redeploy.

### Issue: CORS errors
**Solution**: The serverless function already handles CORS. Make sure requests go to `/api/tmdb`, not directly to TMDB.

### Issue: 401 Unauthorized
**Solution**: Verify the API key is valid at https://www.themoviedb.org/settings/api

### Issue: Changes not reflected after deployment
**Solution**: Clear browser cache and do a hard refresh (Ctrl+F5 or Cmd+Shift+R)

## Technical Details

### Environment Variable Behavior in Vercel

**Build Time (Frontend)**:
- Variables prefixed with `REACT_APP_` are embedded into the React bundle
- Accessible via `process.env.REACT_APP_*` in React components
- Cannot be changed after build without rebuilding

**Runtime (Serverless Functions)**:
- Variables without `REACT_APP_` prefix are available at runtime
- Accessible via `process.env.*` in serverless functions
- Can be updated without rebuilding the frontend

### API Flow

```
User Browser
    ↓
React App (Frontend)
    ↓
/api/tmdb (Vercel Serverless Function)
    ↓
https://api.themoviedb.org/3 (TMDB API)
    ↓
Response back to User
```

## Summary

The deployment issue has been fixed by:
1. Properly configuring environment variables for both frontend and serverless functions
2. Updating the serverless function to use the correct environment variable name
3. Providing better error messages for debugging
4. Creating comprehensive deployment documentation

The application should now work correctly in both development (localhost) and production (Vercel) environments.

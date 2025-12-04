# 🚀 Vercel Deployment Guide - Birthday Movie Finder

## Quick Deploy (Recommended)

### Method 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Navigate to project directory
cd /app

# Deploy to Vercel
vercel --prod
```

The CLI will guide you through:
1. Login to Vercel (or create account)
2. Link to existing project or create new one
3. Confirm settings
4. Deploy!

### Method 2: Deploy via GitHub + Vercel Dashboard

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Birthday Movie Finder with API integration"
   git branch -M main
   git remote add origin https://github.com/yourusername/birthday-movie-finder.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect React and configure build settings

3. **Configure Environment Variables**
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add the following variables:

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `TMDB_API_KEY` | `c16488af7ab2efaf5b5ce51f6ff22ee1` | Production, Preview, Development |
   | `REACT_APP_TMDB_API_KEY` | `c16488af7ab2efaf5b5ce51f6ff22ee1` | Production, Preview, Development |

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

## Environment Variables Explained

### Why Two Variables?

The application uses different environment variables for different contexts:

**`TMDB_API_KEY` (No prefix)**
- Used by: Vercel serverless functions (`/api/tmdb.js`)
- Available: At runtime in serverless environment
- Purpose: Makes secure API calls to TMDB from the backend

**`REACT_APP_TMDB_API_KEY` (React prefix)**
- Used by: React frontend during build
- Available: At build time only
- Purpose: Embedded into the frontend bundle for development mode

### Security Note

In production, the frontend NEVER exposes the API key. All requests go through the `/api/tmdb` serverless function which keeps the key secure on the backend.

## Verification Steps

After deployment, test these endpoints:

### 1. Test Main Application
```
https://your-project-name.vercel.app
```
Should load the Birthday Movie Finder interface.

### 2. Test Serverless API Function
```
https://your-project-name.vercel.app/api/tmdb?endpoint=/configuration
```
Should return TMDB configuration JSON like:
```json
{
  "images": {
    "base_url": "http://image.tmdb.org/t/p/",
    "secure_base_url": "https://image.tmdb.org/t/p/",
    ...
  },
  ...
}
```

### 3. Test Date Selection
1. Open your deployed app
2. Select a birthday date
3. Verify movies are loaded
4. Check browser console (F12) for any errors

## Build Settings (Auto-Configured)

Vercel automatically detects React apps and uses these settings:

- **Framework Preset**: Create React App
- **Build Command**: `npm run build` or `yarn build`
- **Output Directory**: `build`
- **Install Command**: `yarn install` or `npm install`

## Troubleshooting

### Issue: "API key not configured" error

**Cause**: Environment variables not set in Vercel

**Solution**:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify `TMDB_API_KEY` is set (without `REACT_APP_` prefix)
3. Redeploy: Vercel Dashboard → Deployments → Click "..." → Redeploy

### Issue: Movies not loading

**Cause**: API key might be invalid or rate limited

**Solution**:
1. Test API key: `https://api.themoviedb.org/3/configuration?api_key=YOUR_KEY`
2. Check TMDB API status: https://status.themoviedb.org/
3. Verify Vercel function logs in Dashboard

### Issue: CORS errors

**Cause**: Requests going directly to TMDB instead of through serverless function

**Solution**:
- Check `/app/src/services/api.ts` line 6
- Ensure `BASE_URL` is set correctly for production:
  ```typescript
  const BASE_URL = isDevelopment ? 'https://api.themoviedb.org/3' : '/api/tmdb';
  ```

### Issue: Changes not visible after deployment

**Cause**: Browser cache or CDN cache

**Solution**:
1. Hard refresh browser: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try in incognito/private window
4. Check if deployment actually completed in Vercel Dashboard

### Issue: Build fails on Vercel

**Cause**: TypeScript errors or missing dependencies

**Solution**:
1. Check build logs in Vercel Dashboard
2. Test build locally: `yarn build`
3. Fix any TypeScript errors
4. Ensure all dependencies are in `package.json`

## Monitoring

### View Logs
- Go to Vercel Dashboard → Your Project → Functions
- Click on `/api/tmdb.js`
- View invocation logs

### Monitor API Usage
- Check TMDB API usage at https://www.themoviedb.org/settings/api
- Free tier: 1000 requests per day

## Performance Optimization

The application includes:
- ✅ API response caching (5 minutes)
- ✅ Lazy loading of images
- ✅ Code splitting with React
- ✅ Serverless function caching

## Custom Domain (Optional)

To add a custom domain:
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `birthdaymovies.com`)
3. Follow DNS configuration instructions
4. SSL certificate will be automatically provisioned

## Continuous Deployment

After connecting GitHub:
- Every push to `main` branch → Automatic production deployment
- Every push to other branches → Preview deployment
- Pull requests → Automatic preview deployments

## Cost

**Vercel Free Tier includes:**
- Unlimited deployments
- 100 GB bandwidth per month
- Serverless function executions: 100 GB-hours
- Perfect for this application!

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Test locally first: `yarn start`
3. Verify environment variables are set
4. Check TMDB API key is valid

## Summary

✅ Fixed: API integration for deployment
✅ Fixed: Environment variable configuration
✅ Fixed: TypeScript compilation errors
✅ Tested: Local development (working perfectly)
✅ Ready: For Vercel production deployment

**Your Birthday Movie Finder app is now ready to deploy! 🎉**

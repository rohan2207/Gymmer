# Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free tier is sufficient)

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Initialize Git Repository

```bash
cd /Users/rohanshetty/Desktop/GYMMER/gymmer
git init
git add .
git commit -m "Initial commit: Gymmer workout tracker"
```

### Step 2: Push to GitHub

1. Create a new repository on [GitHub](https://github.com/new)
2. Name it `gymmer` or any name you prefer
3. Don't initialize with README (we already have one)
4. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/gymmer.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"
6. Done! Your app will be live in ~2 minutes

## Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (from the gymmer directory)
cd /Users/rohanshetty/Desktop/GYMMER/gymmer
vercel
```

Follow the prompts to deploy.

## Post-Deployment

### Access Your App

- Your app will be available at: `https://your-project.vercel.app`
- You can configure a custom domain in Vercel settings

### Mobile Testing

1. Open the deployment URL on your mobile device
2. Test the workout flow:
   - Create a workout
   - Log sets and reps
   - Use the rest timer
   - Check progress and calendar
3. Install as PWA:
   - Open in Safari (iOS) or Chrome (Android)
   - Tap "Add to Home Screen"
   - Launch from home screen for app-like experience

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch automatically deploys
- Preview deployments for pull requests
- Rollback capability from Vercel dashboard

## Environment Configuration

This app requires no environment variables - everything runs client-side with IndexedDB!

## Troubleshooting

### Build Fails

```bash
# Test build locally first
npm run build

# If successful locally but fails on Vercel:
# - Check Node.js version (should use latest LTS)
# - Clear Vercel build cache
# - Redeploy
```

### App Not Loading

- Clear browser cache and hard refresh
- Check browser console for errors
- Ensure IndexedDB is enabled in browser settings

## Updates

To update the deployed app:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically rebuild and deploy.

## Performance Tips

The app is already optimized but you can:
- Enable Vercel Analytics (free tier available)
- Monitor Core Web Vitals
- Check mobile performance with Lighthouse

## Data Backup

Since data is stored locally:
- Each device has its own data
- Consider implementing export/import feature for backups
- Or add cloud sync in the future

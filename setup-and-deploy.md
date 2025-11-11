# Complete Setup & Deployment Guide

## Current Status
✅ All files are ready
✅ Vercel configuration is set up
✅ Build is tested and working
⚠️ Git CLI tools need to be installed to push to GitHub

## Quick Setup (Choose One Method)

### Method 1: Install Git CLI Tools (Recommended)

1. **Install Git:**
   ```bash
   xcode-select --install
   ```
   This will open a dialog - click "Install" and wait for it to complete (10-15 minutes)

2. **After installation, run these commands:**
   ```bash
   cd /Users/helenablasco/Data-landing-page
   git init
   git add .
   git commit -m "Initial commit - Landing page ready for deployment"
   git branch -M main
   git remote add origin https://github.com/HBG20/landing-data.git
   git push -u origin main
   ```

### Method 2: Use GitHub Desktop (No Command Line Needed)

1. **Download GitHub Desktop:**
   - Visit: https://desktop.github.com
   - Download and install

2. **Clone the repository:**
   - Open GitHub Desktop
   - File → Clone Repository → URL tab
   - Enter: `https://github.com/HBG20/landing-data.git`
   - Choose a location and click "Clone"

3. **Copy your files:**
   - Copy all files from `/Users/helenablasco/Data-landing-page` 
   - Paste them into the cloned repository folder

4. **Commit and push:**
   - In GitHub Desktop, you'll see all the new files
   - Write commit message: "Initial commit - Landing page ready for deployment"
   - Click "Commit to main"
   - Click "Push origin"

### Method 3: GitHub Web Interface

1. Go to: https://github.com/HBG20/landing-data
2. Click "Add file" → "Upload files"
3. Drag and drop all files from `/Users/helenablasco/Data-landing-page`
4. Scroll down, write commit message: "Initial commit"
5. Click "Commit changes"

---

## Deploy to Vercel

### Step 1: Connect GitHub to Vercel

1. Go to: https://vercel.com
2. Sign up or Log in (use "Continue with GitHub")
3. Authorize Vercel to access your GitHub account

### Step 2: Import and Deploy

1. Click "Add New..." → "Project"
2. You'll see your repositories - select `HBG20/landing-data`
3. Vercel will auto-detect:
   - Framework: Vite ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `dist` ✅
4. Click "Deploy"
5. Wait 1-2 minutes for build to complete

### Step 3: Get Your Live URL

After deployment completes, you'll see:
- **Production URL**: `https://landing-data-xxx.vercel.app`
- This is your live website! 🎉

---

## Automatic Deployments

Once connected:
- ✅ Every push to `main` branch = Auto-deploy to production
- ✅ Pull requests = Auto-deploy to preview URLs
- ✅ No manual deployment needed!

---

## Need Help?

If you encounter any issues:
1. Check the build logs in Vercel dashboard
2. Make sure all files are pushed to GitHub
3. Verify the repository is public or Vercel has access










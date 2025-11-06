# Complete Vercel Deployment Setup Guide

## Step 1: Set Up Git Repository (if not already done)

### Option A: Initialize a new Git repository locally

1. Open Terminal and navigate to your project:
   ```bash
   cd /Users/helenablasco/Data-landing-page
   ```

2. Initialize Git (if not already done):
   ```bash
   git init
   ```

3. Create a `.gitignore` file (if it doesn't exist):
   ```bash
   # Already should exist, but verify it includes:
   node_modules/
   dist/
   .DS_Store
   ```

4. Add all files:
   ```bash
   git add .
   ```

5. Make your first commit:
   ```bash
   git commit -m "Initial commit - Landing page ready for deployment"
   ```

### Option B: Connect to existing GitHub repository

1. Create a new repository on GitHub:
   - Go to [github.com](https://github.com)
   - Click "+" → "New repository"
   - Name it (e.g., "data-landing-page")
   - Don't initialize with README (since you already have files)
   - Click "Create repository"

2. Connect your local repository to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Install and Setup Vercel CLI

### Install Vercel CLI:

```bash
npm install -g vercel
```

If you get permission errors, use:
```bash
sudo npm install -g vercel
```

### Login to Vercel:

```bash
vercel login
```

This will:
- Open your browser
- Ask you to login/authorize
- Complete the authentication

### Verify installation:

```bash
vercel --version
```

---

## Step 3: Deploy Using Vercel CLI

### First deployment (Preview):

```bash
cd /Users/helenablasco/Data-landing-page
vercel
```

This will:
1. Ask you to confirm your project settings
2. Link your project to Vercel
3. Deploy to a preview URL (e.g., `data-landing-page.vercel.app`)

### Production deployment:

```bash
vercel --prod
```

This deploys to your production domain.

---

## Step 4: Deploy Using Vercel Dashboard (Alternative)

### Connect GitHub to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Sign up or login (you can use GitHub account)
3. Click "Add New..." → "Project"
4. Click "Import Git Repository"
5. If not connected, click "Connect Git Provider"
6. Authorize Vercel to access your GitHub repositories

### Import Your Project:

1. Select your repository from the list
2. Vercel will auto-detect:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (current directory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Click "Deploy"

### Configure Environment Variables (if needed):

If you add environment variables later:
1. Go to your project in Vercel dashboard
2. Settings → Environment Variables
3. Add variables (e.g., `VITE_API_URL`)

---

## Step 5: Automatic Deployments

Once connected to GitHub:
- **Every push to `main` branch** → Automatic production deployment
- **Pull requests** → Automatic preview deployments
- **Other branches** → Preview deployments

---

## Step 6: Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Troubleshooting

### If Git is not installed:

**macOS:**
```bash
# Install Xcode Command Line Tools
xcode-select --install
```

**Or install Git directly:**
- Download from [git-scm.com](https://git-scm.com/download/mac)
- Or use Homebrew: `brew install git`

### If Vercel CLI fails:

```bash
# Clear npm cache
npm cache clean --force

# Reinstall Vercel CLI
npm uninstall -g vercel
npm install -g vercel
```

### Build errors:

Make sure all dependencies are installed:
```bash
npm install
npm run build
```

---

## Quick Reference Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod

# View deployments
vercel ls

# View project info
vercel inspect

# Remove deployment
vercel remove
```

---

## Next Steps After Deployment

1. ✅ Test your deployed site
2. ✅ Check all features work (map, search, modals)
3. ✅ Test on mobile devices
4. ✅ Set up custom domain (if needed)
5. ✅ Configure environment variables (if needed)

Your landing page is now live! 🚀


# Quick Vercel Deployment Guide

## 🚀 Method 1: Vercel Dashboard (EASIEST - Recommended)

### Step 1: Prepare Your Code
1. Make sure your code is committed to Git (optional but recommended)
2. Push to GitHub if you have a repository

### Step 2: Deploy via Vercel Dashboard

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign Up" (or "Log In" if you have an account)
   - You can sign up with GitHub, GitLab, or email

2. **Create New Project:**
   - Click "Add New..." button
   - Select "Project"

3. **Import Repository:**
   - Click "Import Git Repository"
   - If you haven't connected GitHub/GitLab:
     - Click "Connect Git Provider"
     - Choose GitHub/GitLab/Bitbucket
     - Authorize Vercel to access your repositories
   - Select your repository from the list

4. **Configure Project:**
   - Vercel will auto-detect these settings (you don't need to change them):
     - **Framework Preset:** Vite
     - **Root Directory:** `./`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

5. **Deploy:**
   - Click "Deploy" button
   - Wait 1-2 minutes for the build to complete
   - Your site will be live at: `your-project-name.vercel.app`

6. **Done!** ✅
   - Every time you push to your main branch, Vercel will auto-deploy
   - Pull requests get preview deployments automatically

---

## 💻 Method 2: Vercel CLI

### Step 1: Install Vercel CLI

**Option A: Global Install (requires sudo)**
```bash
sudo npm install -g vercel
```

**Option B: Use npx (no install needed)**
```bash
npx vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```
This will open your browser to authenticate.

### Step 3: Deploy

Navigate to your project directory:
```bash
cd /Users/helenablasco/Data-landing-page
```

Deploy:
```bash
# For preview deployment
vercel

# For production deployment
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (first time)
- Project name? (Press Enter for default)
- Directory? (Press Enter for `./`)
- Override settings? **No**

### Step 4: Your site is live!

You'll get a URL like: `https://data-landing-page-xxx.vercel.app`

---

## 📝 Setting Up Git (If Not Already Done)

### If you don't have Git installed:

**macOS:**
```bash
# Install Xcode Command Line Tools (includes Git)
xcode-select --install
```

### Initialize Git Repository:

```bash
cd /Users/helenablasco/Data-landing-page

# Initialize Git
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit - Ready for Vercel deployment"
```

### Push to GitHub:

1. Create a new repository on [GitHub.com](https://github.com/new)
2. Don't initialize with README (you already have files)
3. Copy the repository URL
4. Connect and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 🔧 Troubleshooting

### Build fails?
- Make sure all dependencies are installed: `npm install`
- Test build locally: `npm run build`
- Check for errors in the Vercel build logs

### CLI permission errors?
- Use `sudo npm install -g vercel` (requires password)
- Or use `npx vercel` instead (no install needed)

### Need to update deployment?
- **Via Dashboard:** Just push to GitHub - auto-deploys
- **Via CLI:** Run `vercel --prod` again

---

## ✅ What's Already Configured

- ✅ `vercel.json` - Vercel configuration file
- ✅ Build script ready (`npm run build`)
- ✅ Production build tested and working
- ✅ All dependencies in `package.json`

---

## 🎯 Recommended Workflow

1. **Use Vercel Dashboard** for the first deployment (easiest)
2. **Connect to GitHub** for automatic deployments
3. **Push code** → Vercel automatically deploys
4. **No CLI needed** after initial setup

---

## 📚 Next Steps

After deployment:
- ✅ Test your live site
- ✅ Set up custom domain (in Vercel Dashboard → Settings → Domains)
- ✅ Configure environment variables if needed
- ✅ Enable automatic deployments from GitHub

**Your landing page will be live in minutes!** 🚀


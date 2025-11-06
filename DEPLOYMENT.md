# Deployment Guide

This Vite + React landing page can be deployed to various platforms. Here are the recommended options:

## Option 1: Vercel (Recommended - Easiest)

### Using Vercel CLI:
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production:
   ```bash
   vercel --prod
   ```

### Using Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect Vite settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy"

Vercel will automatically deploy on every push to your main branch.

---

## Option 2: Netlify

### Using Netlify CLI:
1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Login:
   ```bash
   netlify login
   ```

3. Deploy:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Using Netlify Dashboard:
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Drag and drop your `dist` folder, OR
3. Connect your Git repository:
   - Click "New site from Git"
   - Select your repository
   - Build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click "Deploy site"

---

## Option 3: GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://YOUR_USERNAME.github.io/REPO_NAME"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

4. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: `gh-pages` branch
   - Save

---

## Option 4: Build and Deploy Manually

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist` folder contains your production-ready files.

3. Upload the contents of `dist` to any static hosting service:
   - AWS S3 + CloudFront
   - Google Cloud Storage
   - Azure Static Web Apps
   - Any web server (Apache, Nginx, etc.)

---

## Important Notes

- **Base URL**: If deploying to a subdirectory (e.g., `/landing-page`), update `vite.config.js`:
  ```js
  export default defineConfig({
    base: '/landing-page/',
    plugins: [react()],
  })
  ```

- **Environment Variables**: If you need env variables, create a `.env` file and use `import.meta.env.VITE_*` in your code.

- **Preview Before Deploy**: Test the production build locally:
  ```bash
   npm run build
   npm run preview
   ```

---

## Quick Deploy Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel (if CLI installed)
vercel --prod

# Deploy to Netlify (if CLI installed)
netlify deploy --prod --dir=dist
```


# Deploy to Vercel - Quick Steps

## ✅ Code is on GitHub!
Your repository is live at: https://github.com/HBG20/landing-data

## Deploy to Vercel (2 minutes)

### Option 1: Vercel Dashboard (Easiest - Recommended)

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Click "Sign Up" or "Log In"
   - **Choose "Continue with GitHub"** (this connects your accounts)

2. **Import Project:**
   - After logging in, click "Add New..." → "Project"
   - You'll see your GitHub repositories
   - Find and select: **`HBG20/landing-data`**

3. **Configure (Auto-detected):**
   - Framework: **Vite** ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `dist` ✅
   - Root Directory: `./` ✅
   - **No changes needed!** Just click "Deploy"

4. **Get Your URL:**
   - Wait 1-2 minutes for build
   - You'll see: **Production URL** (e.g., `https://landing-data.vercel.app`)
   - **That's your live website!** 🎉

---

### Option 2: Vercel CLI (If you prefer command line)

Run this command and follow the prompts:
```bash
cd /Users/helenablasco/Data-landing-page
npx vercel login
npx vercel --prod
```

---

## After Deployment

Once deployed, Vercel will:
- ✅ Give you a production URL
- ✅ Auto-deploy on every GitHub push
- ✅ Create preview URLs for pull requests

**Share the URL with me and I'll verify everything is working!**





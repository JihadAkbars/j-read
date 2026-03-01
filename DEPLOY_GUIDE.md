# J Read - Vercel Deployment Guide (Step-by-Step)

This guide will walk you through deploying J Read using **only GitHub and Vercel** - no other services needed!

---

## What We're Building

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR SETUP                             │
│                                                             │
│  GitHub Repo ──────▶ Vercel (Frontend + Backend + DB)      │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  React App  │    │  API Routes │    │  Postgres   │     │
│  │  (Vercel)   │◄──▶│  (Vercel)   │◄──▶│  (Vercel)   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

1. **GitHub Account** - [Sign up free](https://github.com/signup)
2. **Vercel Account** - [Sign up free](https://vercel.com/signup) (use GitHub login)

---

## Step 1: Create Your GitHub Repository

### 1.1 Create a New Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `j-read` (or any name you like)
3. Make it **Public**
4. Click **"Create repository"**

### 1.2 Upload the Code

**Option A: Using GitHub Web Interface (Easiest)**

1. Download the `j-read-vercel` folder from this project
2. Go to your new GitHub repository
3. Click **"Add file" → "Upload files"**
4. Drag and drop all files from `j-read-vercel`
5. Click **"Commit changes"**

**Option B: Using Git Command Line**

```bash
# Navigate to the j-read-vercel folder
cd j-read-vercel

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/j-read.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Vercel

### 2.1 Create New Vercel Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..." → "Project"**
3. Find and select your `j-read` GitHub repository
4. Click **"Import"**

### 2.2 Configure Backend Deployment

In the project configuration:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Other` |
| **Root Directory** | `apps/api` |
| **Build Command** | `echo "Build complete"` |
| **Output Directory** | (leave empty) |

Click **"Deploy"**

Wait for deployment to complete (about 1-2 minutes).

### 2.3 Get Your Backend URL

After deployment:
1. You'll see a success message with a URL like: `https://j-read-xxx.vercel.app`
2. **Copy this URL** - you'll need it for the frontend
3. This is your **API_URL**

---

## Step 3: Set Up Database (Vercel Postgres)

### 3.1 Create Database

1. In Vercel Dashboard, click on your backend project
2. Go to **"Storage"** tab
3. Click **"Connect Database"**
4. Select **"Vercel Postgres"**
5. Choose a region close to you (e.g., `us-east-1`)
6. Click **"Create"**

### 3.2 Run Database Schema

**Option A: Using Vercel Dashboard**

1. In your Postgres dashboard, click **"Query"** tab
2. Copy the contents of `apps/api/schema.sql`
3. Paste into the query editor
4. Click **"Run"**

**Option B: Using Terminal**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Pull environment variables
vercel env pull .env

# Get the POSTGRES_URL from .env
# Run the schema
psql "$(grep POSTGRES_URL .env | cut -d'"' -f2)" -f apps/api/schema.sql
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Another Vercel Project

1. Go back to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..." → "Project"**
3. Select the **same** `j-read` repository
4. Click **"Import"**

### 4.2 Configure Frontend Deployment

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `apps/web` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 4.3 Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://YOUR-BACKEND-URL.vercel.app/api/v1` |

Replace `YOUR-BACKEND-URL` with the URL from Step 2.3

Click **"Deploy"**

---

## Step 5: Connect Frontend to Backend

### 5.1 Update Backend CORS

1. Go to your backend project in Vercel Dashboard
2. Click **"Settings" → "Environment Variables"**
3. Add:

| Name | Value |
|------|-------|
| `FRONTEND_URL` | `https://YOUR-FRONTEND-URL.vercel.app` |

Replace `YOUR-FRONTEND-URL` with your frontend URL from Step 4

4. Click **"Save"**
5. Go to **"Deployments"** tab
6. Click the three dots on your latest deployment
7. Click **"Redeploy"**

---

## Step 6: Test Your Deployment

### 6.1 Check Health Endpoint

Open in browser:
```
https://YOUR-BACKEND-URL.vercel.app/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "env": "production"
}
```

### 6.2 Check API

Open:
```
https://YOUR-BACKEND-URL.vercel.app/api/v1
```

You should see the API info.

### 6.3 View Your Website

Open your frontend URL - you should see the J Read homepage with stories!

---

## Step 7: Set Up Auto-Deployment (GitHub Actions)

### 7.1 Get Vercel Tokens

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Name it `GitHub Actions`
4. Copy the token

### 7.2 Get Project IDs

For each project (frontend and backend):

1. Go to project Settings → General
2. Copy **"Project ID"**
3. Copy **"Organization ID"** (same for both)

### 7.3 Add GitHub Secrets

1. Go to your GitHub repository
2. Click **"Settings" → "Secrets and variables" → "Actions"**
3. Click **"New repository secret"**
4. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Your token from 7.1 |
| `VERCEL_ORG_ID` | Your org ID |
| `VERCEL_PROJECT_ID_WEB` | Frontend project ID |
| `VERCEL_PROJECT_ID_API` | Backend project ID |

### 7.4 Enable GitHub Actions

The `.github/workflows/deploy.yml` file is already in your repo. Now when you push to `main`, it will auto-deploy!

Test it:
```bash
# Make a small change
echo "// Updated" >> apps/web/src/App.tsx

# Commit and push
git add .
git commit -m "Test auto-deploy"
git push origin main
```

Go to GitHub → Actions tab to see the deployment running!

---

## Step 8: Add Custom Domain (Optional)

### 8.1 Buy a Domain

Use any domain registrar (Namecheap, GoDaddy, Google Domains, etc.)

### 8.2 Add to Vercel

1. In Vercel Dashboard, go to your frontend project
2. Click **"Settings" → "Domains"**
3. Enter your domain (e.g., `jread.com`)
4. Click **"Add"**

### 8.3 Configure DNS

Vercel will give you DNS records. Add them to your domain registrar:

**Option A: A Record**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Option B: CNAME Record**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 8.4 Update Environment Variables

Update `FRONTEND_URL` and `VITE_API_URL` to use your custom domain.

---

## Project Structure Recap

```
j-read/                          # Your GitHub repo
├── .github/
│   └── workflows/
│       └── deploy.yml           # Auto-deployment
├── apps/
│   ├── web/                     # Frontend (React + Vite)
│   │   ├── src/
│   │   │   ├── App.tsx         # Main app
│   │   │   └── ...
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── vercel.json         # Frontend config
│   │   └── .env.production     # API URL
│   └── api/                     # Backend (Express)
│       ├── src/
│       │   └── server.ts       # API routes
│       ├── schema.sql          # Database schema
│       ├── package.json
│       └── vercel.json         # Backend config
├── package.json                 # Root config
├── turbo.json                   # Monorepo config
└── vercel.json                  # Root Vercel config
```

---

## Common Issues & Solutions

### Issue: "Build Failed"

**Solution:**
1. Check the build logs in Vercel
2. Make sure all dependencies are in package.json
3. Try redeploying

### Issue: "Cannot connect to database"

**Solution:**
1. Make sure Vercel Postgres is created
2. Check that schema.sql was run
3. Verify environment variables are set

### Issue: "CORS error"

**Solution:**
1. Check `FRONTEND_URL` is set correctly in backend
2. Make sure it matches your actual frontend URL
3. Redeploy backend after changing env vars

### Issue: "404 on API routes"

**Solution:**
1. Check `vercel.json` in `apps/api`
2. Make sure routes are configured correctly
3. Verify the build output

---

## Cost Breakdown

| Service | Free Tier | What You Get |
|---------|-----------|--------------|
| **Vercel Hosting** | ✅ Forever | 100GB bandwidth, 125k serverless invocations |
| **Vercel Postgres** | ✅ Forever | 60 compute hours/month |
| **Vercel KV** | ✅ Forever | 3k commands/day |
| **GitHub** | ✅ Forever | Unlimited public repos |

**For a new platform, the free tier is more than enough!**

---

## Next Steps

1. ✅ **Test everything works**
2. ✅ **Set up custom domain** (optional)
3. 🔄 **Add authentication** (Next.js Auth or Clerk)
4. 🔄 **Add Stripe for payments**
5. 🔄 **Add more features**

---

## Quick Commands Reference

```bash
# Deploy manually
vercel --prod

# Pull env vars
vercel env pull

# View logs
vercel logs

# Redeploy
vercel --force
```

---

## Need Help?

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**🎉 Congratulations! Your J Read platform is now live on Vercel!**

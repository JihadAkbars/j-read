# J Read - Deploy to Vercel

A complete storytelling platform ready to deploy on **GitHub + Vercel**.

## 🚀 Quick Start (5 Minutes)

### 1. Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `j-read`
3. Click **"Create repository"**

### 2. Upload Code

```bash
# Download this folder, then:
cd j-read-vercel
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/j-read.git
git push -u origin main
```

### 3. Deploy Backend

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Configure:
   - **Root Directory**: `apps/api`
   - **Framework**: `Other`
4. Click **Deploy**

### 4. Add Database

1. In Vercel Dashboard → Storage → Connect Database
2. Select **Vercel Postgres**
3. Click **Create**
4. Go to Query tab, paste contents of `apps/api/schema.sql`
5. Click **Run**

### 5. Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import same repo
3. Configure:
   - **Root Directory**: `apps/web`
   - **Framework**: `Vite`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-url.vercel.app/api/v1`
5. Click **Deploy**

### 6. Connect Them

1. In backend project → Settings → Environment Variables
2. Add: `FRONTEND_URL` = `https://your-frontend-url.vercel.app`
3. Redeploy backend

**✅ Done! Your site is live!**

---

## 📁 Project Structure

```
j-read/
├── apps/
│   ├── web/          # React frontend (Vite)
│   └── api/          # Express backend (Vercel)
├── .github/
│   └── workflows/    # Auto-deployment
└── package.json      # Root config
```

---

## 📖 Full Documentation

See [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) for detailed step-by-step instructions.

---

## 🆓 Free Tier Limits

| Service | Free Limit |
|---------|------------|
| Vercel Hosting | 100GB bandwidth |
| Vercel Postgres | 60 compute hours |
| GitHub | Unlimited repos |

Perfect for startups and side projects!

---

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript + Vercel Serverless
- **Database**: Vercel Postgres
- **Cache**: Vercel KV
- **Hosting**: Vercel (Frontend + Backend)
- **CI/CD**: GitHub Actions

---

## 📝 Environment Variables

### Frontend (`apps/web/.env.production`)
```
VITE_API_URL=https://your-api.vercel.app/api/v1
```

### Backend (Vercel Dashboard)
```
FRONTEND_URL=https://your-frontend.vercel.app
JWT_SECRET=your-secret-key
```

---

## 🧪 Testing

```bash
# Health check
curl https://your-api.vercel.app/health

# API info
curl https://your-api.vercel.app/api/v1

# List stories
curl https://your-api.vercel.app/api/v1/stories
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check build logs in Vercel |
| Database error | Run schema.sql in Vercel Postgres |
| CORS error | Update FRONTEND_URL env var |
| 404 on API | Check vercel.json routes |

---

## 📚 Learn More

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Serverless Functions](https://vercel.com/docs/functions)

---

**Happy deploying! 🚀**

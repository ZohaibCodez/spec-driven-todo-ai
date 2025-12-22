# 🚀 Deployment Guide

This guide explains how to deploy the Spec-Driven Todo Application with:
- **Frontend**: GitHub Pages (via GitHub Actions)
- **Backend**: Vercel

---

## 📋 Prerequisites

1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. PostgreSQL database (free options below)

---

## 🗄️ Step 1: Set Up Database

### Option A: Neon (Recommended)
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy your connection string (looks like: `postgresql://user:password@host/db`)

### Option B: Supabase
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection String
4. Copy the URI connection string

---

## 🔧 Step 2: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

```
NEXT_PUBLIC_API_URL = https://your-backend-name.vercel.app
BETTER_AUTH_SECRET = [generate using: openssl rand -base64 32]
BETTER_AUTH_URL = https://your-username.github.io/spec-driven-todo-ai
DATABASE_URL = [your PostgreSQL connection string from Step 1]
```

---

## 🎨 Step 3: Enable GitHub Pages

1. Go to: **Settings** → **Pages**
2. Under **Source**, select: **GitHub Actions**
3. Save the changes

---

## ⚙️ Step 4: Update Frontend Configuration

Update `frontend/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/spec-driven-todo-ai', // Change this to your repo name
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

---

## 🚀 Step 5: Deploy Backend to Vercel

### Via Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
vercel --prod
```

4. Add environment variables when prompted:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Same as GitHub secret
   - `BETTER_AUTH_URL`: Your GitHub Pages URL

### Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: Leave as `.` (root)
   - Click **Environment Variables** and add:
     - `DATABASE_URL`
     - `BETTER_AUTH_SECRET`
     - `BETTER_AUTH_URL`
5. Click **Deploy**

---

## 🔄 Step 6: Update Frontend with Backend URL

1. After Vercel deploys, copy your backend URL (e.g., `https://your-app.vercel.app`)
2. Update GitHub secret `NEXT_PUBLIC_API_URL` with this URL
3. Push changes to trigger frontend deployment:

```bash
git add .
git commit -m "Update deployment configuration"
git push origin main
```

---

## ✅ Step 7: Verify Deployment

### Test Backend
Visit: `https://your-backend.vercel.app/health`
Should return: `{"status": "healthy"}`

### Test Frontend
Visit: `https://your-username.github.io/spec-driven-todo-ai`
Should load the application

---

## 🔍 Troubleshooting

### Frontend build fails
- Check GitHub Actions logs: **Actions** tab → Latest workflow
- Verify all secrets are set correctly
- Ensure `basePath` in `next.config.ts` matches your repo name

### Backend deployment fails
- Check Vercel logs in dashboard
- Verify `DATABASE_URL` is correct
- Ensure all dependencies are in `requirements.txt`

### Database connection errors
- Verify PostgreSQL connection string format
- Check if database allows connections from Vercel IPs
- Ensure database is active (some free tiers sleep)

### CORS errors
- Update backend `main.py` to include your frontend domain:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-username.github.io",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🔄 Continuous Deployment

### Frontend
- Automatically deploys on push to `main` branch
- Only triggers when files in `frontend/` change
- Can manually trigger: **Actions** → **Frontend CI/CD** → **Run workflow**

### Backend
- Vercel auto-deploys on push to `main`
- Can deploy manually: `vercel --prod`
- Preview deployments created for pull requests

---

## 📊 Monitoring

### GitHub Actions
- View builds: **Actions** tab
- Check logs for each deployment
- Set up notifications: **Settings** → **Notifications**

### Vercel
- View deployments: https://vercel.com/dashboard
- Check function logs
- Monitor performance metrics

---

## 💰 Cost Estimate

| Service | Free Tier Limits |
|---------|------------------|
| GitHub Actions | 2,000 minutes/month (private repos) |
| GitHub Pages | 1 GB storage, 100 GB bandwidth/month |
| Vercel | 100 GB bandwidth, 100 hours serverless function time |
| Neon/Supabase | 0.5 GB - 500 MB database storage |

**Total Cost**: $0/month (within free tier limits)

---

## 🔐 Security Notes

1. **Never commit** `.env` files
2. **Rotate secrets** regularly
3. **Use strong passwords** for database
4. **Enable 2FA** on GitHub and Vercel accounts
5. **Review Vercel logs** for suspicious activity

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## 🆘 Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs
3. Open an issue on GitHub
4. Contact support:
   - GitHub: https://support.github.com
   - Vercel: https://vercel.com/support

---

**Last Updated**: December 22, 2025

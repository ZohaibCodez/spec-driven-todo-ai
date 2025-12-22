# 🚀 Backend Deployment Guide for Vercel (via Website)

## 📁 Project Structure for Vercel

Your project structure should look like this:

```
spec-driven-todo-ai/           ← Root directory (what Vercel sees)
│
├── vercel.json                ← Vercel configuration (REQUIRED)
├── requirements.txt           ← Python dependencies (REQUIRED)
│
├── api/                       ← Vercel serverless functions folder
│   └── index.py              ← Main entry point (REQUIRED)
│
└── backend/                   ← Your actual backend code
    ├── main.py
    ├── database.py
    ├── models.py
    ├── schemas.py
    ├── requirements.txt
    ├── routes/
    │   ├── tasks.py
    │   └── users.py
    ├── auth/
    │   ├── routes.py
    │   ├── security.py
    │   └── middleware.py
    └── services/
        ├── task_service.py
        └── user_service.py
```

---

## 🎯 Key Files Explained

### 1. **`vercel.json`** (Root Directory)
Located at: `spec-driven-todo-ai/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ]
}
```

**What it does:**
- Tells Vercel to use Python runtime
- Routes all requests to `api/index.py`
- Must be in the **root directory**

---

### 2. **`api/index.py`** (Entry Point)
Located at: `spec-driven-todo-ai/api/index.py`

```python
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import create_db_and_tables

# Create FastAPI app
app = FastAPI(
    title="Task Management API",
    description="API for managing tasks with CRUD operations",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routes from backend folder
from backend.routes import tasks, users
from backend.auth import routes as auth_routes

# Include routers
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])

# Startup event
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {
        "message": "Task Management API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# IMPORTANT: Export for Vercel
handler = app
```

**Key points:**
- Must be in `api/` folder
- Imports code from `backend/` folder
- Exports `handler = app` for Vercel
- Adds backend to Python path

---

### 3. **`requirements.txt`** (Root Directory)
Located at: `spec-driven-todo-ai/requirements.txt`

```
fastapi==0.104.1
sqlmodel==0.0.16
python-jose[cryptography]==3.3.0
bcrypt==4.0.1
passlib[bcrypt]==1.7.4
slowapi==0.1.9
python-multipart==0.0.6
python-dotenv==1.0.0
psycopg2-binary==2.9.9
uvicorn[standard]==0.24.0
pydantic==2.5.0
requests==2.31.0
```

**Important:**
- Must be in **root directory** (not backend folder)
- Contains all dependencies from `backend/requirements.txt`

---

## 🌐 Step-by-Step Vercel Deployment (Website)

### Step 1: Prepare Your Database

1. **Create PostgreSQL Database** (Choose one):
   
   **Option A: Neon (Recommended)**
   - Visit: https://neon.tech
   - Sign up → Create Project
   - Copy connection string:
     ```
     postgresql://user:password@ep-xxx.neon.tech/neondb
     ```

   **Option B: Supabase**
   - Visit: https://supabase.com
   - Create Project → Settings → Database
   - Copy URI connection string

   **Option C: Vercel Postgres**
   - In Vercel dashboard → Storage → Create Database
   - Select Postgres
   - Copy connection string

---

### Step 2: Push Code to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Add Vercel deployment configuration"

# Push to GitHub
git push origin main
```

**Verify these files exist:**
- ✅ `vercel.json` (root)
- ✅ `requirements.txt` (root)
- ✅ `api/index.py`
- ✅ `backend/` folder with all code

---

### Step 3: Import Project to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Git Repository**
   - Select **"Import Git Repository"**
   - Choose **GitHub**
   - Authorize Vercel to access your repositories
   - Find and select: `spec-driven-todo-ai`

3. **Configure Project**
   
   **Framework Preset**: `Other`
   
   **Root Directory**: `.` (leave as root - do NOT select backend/)
   
   **Build Settings**:
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `pip install -r requirements.txt`

---

### Step 4: Add Environment Variables

Before deploying, click **"Environment Variables"** and add:

| Key | Value | Example |
|-----|-------|---------|
| `DATABASE_URL` | Your PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `BETTER_AUTH_SECRET` | Generate with: `openssl rand -base64 32` | `abc123xyz...` |
| `BETTER_AUTH_URL` | Your frontend URL | `https://zohaibcodez.github.io/spec-driven-todo-ai` |

**How to add each variable:**
1. Click **"Add New"**
2. Enter **Key** (e.g., `DATABASE_URL`)
3. Enter **Value**
4. Select environment: **Production**, **Preview**, **Development** (select all 3)
5. Click **"Add"**

Repeat for all 3 variables.

---

### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait for build (usually 1-2 minutes)
3. Watch the build logs

**Build Process:**
```
▲ Installing dependencies...
▲ Building...
▲ Deploying...
✓ Deployment ready
```

---

### Step 6: Verify Deployment

1. **Copy your deployment URL** (e.g., `https://spec-driven-todo-ai.vercel.app`)

2. **Test endpoints:**

   **Health Check:**
   ```
   https://your-app.vercel.app/health
   ```
   Should return: `{"status": "healthy"}`

   **API Docs:**
   ```
   https://your-app.vercel.app/docs
   ```
   Should show Swagger UI

   **Root:**
   ```
   https://your-app.vercel.app/
   ```
   Should return API info

---

## 🔧 Common Issues & Solutions

### ❌ Issue 1: "No Python files found"

**Cause:** Vercel can't find `api/index.py`

**Solution:**
- Ensure `api/index.py` exists
- Check `vercel.json` has correct path: `"src": "api/index.py"`
- Don't set Root Directory to `backend/`

---

### ❌ Issue 2: "Module not found: backend"

**Cause:** Python can't import from backend folder

**Solution:**
In `api/index.py`, add at the top:
```python
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
```

---

### ❌ Issue 3: "Database connection failed"

**Cause:** Wrong DATABASE_URL or database not accepting connections

**Solutions:**
1. **Check connection string format:**
   ```
   postgresql://username:password@hostname:port/database
   ```

2. **Test connection locally:**
   ```bash
   cd backend
   python -c "import os; from database import engine; print('Connected!')"
   ```

3. **Neon-specific:** Ensure using connection string with `?sslmode=require`

4. **Supabase-specific:** Use the **URI** format, not the connection pooler

---

### ❌ Issue 4: "Import errors for routes"

**Cause:** Routes not found

**Solution:**
Ensure file structure:
```
backend/
  routes/
    __init__.py  ← Must exist (can be empty)
    tasks.py
    users.py
  auth/
    __init__.py  ← Must exist (can be empty)
    routes.py
```

---

### ❌ Issue 5: "Build succeeds but 500 error"

**Cause:** Runtime error in code

**Solution:**
1. Check Vercel logs:
   - Dashboard → Your Project → Deployments → Click latest → View Function Logs

2. Common fixes:
   - Add `python-dotenv` to requirements.txt
   - Remove local imports that don't exist in Vercel
   - Check all environment variables are set

---

## 🔄 Updating Your Deployment

### Automatic (Recommended)
Just push to GitHub:
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Vercel auto-deploys in ~1 minute.

### Manual (via Website)
1. Go to Vercel Dashboard
2. Your Project → Deployments
3. Click **"Redeploy"**

---

## 📊 Monitoring & Logs

### View Logs
1. Vercel Dashboard → Your Project
2. Click **"Deployments"**
3. Click on a deployment
4. Click **"View Function Logs"**

### Monitor Usage
- Dashboard → Your Project → **Analytics**
- Check bandwidth, function invocations, errors

---

## 🔐 Security Checklist

- ✅ DATABASE_URL is in environment variables (not in code)
- ✅ BETTER_AUTH_SECRET is strong (32+ characters)
- ✅ `.env` files are in `.gitignore`
- ✅ CORS origins limited in production
- ✅ Database allows Vercel IPs (usually automatic)

---

## 💰 Vercel Free Tier Limits

| Resource | Limit |
|----------|-------|
| Bandwidth | 100 GB/month |
| Function Execution | 100 hours/month |
| Deployments | Unlimited |
| Build Time | 6000 minutes/month |

**Your usage:** Backend API calls count toward function execution time.

---

## 🎯 Production Checklist

Before going live:

- [ ] Database is set up (Neon/Supabase/Vercel Postgres)
- [ ] All 3 environment variables added in Vercel
- [ ] `vercel.json` exists in root
- [ ] `requirements.txt` exists in root
- [ ] `api/index.py` exists and has `handler = app`
- [ ] `backend/` folder has all your code
- [ ] Pushed to GitHub
- [ ] Tested `/health` endpoint
- [ ] Tested `/docs` endpoint
- [ ] CORS updated with your frontend domain

---

## 📞 Support

**Vercel Issues:**
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**Database Issues:**
- Neon: https://neon.tech/docs
- Supabase: https://supabase.com/docs

**GitHub Issues:**
- Open an issue: https://github.com/ZohaibCodez/spec-driven-todo-ai/issues

---

**Last Updated:** December 22, 2025

**Deployment Configuration by:** GitHub Copilot 🤖

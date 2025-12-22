# Deployment Checklist & Configuration Guide

## ✅ Current Status

### Working Components:
1. ✅ Better Auth configured with email/password + OAuth
2. ✅ PostgreSQL database (Neon) connected
3. ✅ Google & GitHub OAuth credentials set
4. ✅ Email service (Resend) configured
5. ✅ Backend API (FastAPI) ready
6. ✅ Frontend (Next.js) with TypeScript

---

## 🔧 Required Fixes for Production

### 1. Environment Variables Configuration

#### **Frontend (GitHub Pages)**
Create these secrets in GitHub repository settings:

```bash
# Required for Better Auth
BETTER_AUTH_URL=https://zohaibcodez.github.io/spec-driven-todo-ai
NEXT_PUBLIC_BETTER_AUTH_URL=https://zohaibcodez.github.io/spec-driven-todo-ai

# Backend API URL (Vercel deployment)
NEXT_PUBLIC_API_URL=https://your-vercel-backend.vercel.app

# Database
DATABASE_URL=your-neon-database-url-here

# Auth Secret
BETTER_AUTH_SECRET=your-better-auth-secret-here

# OAuth (use same credentials)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Service
RESEND_API_KEY=your-resend-api-key
```

#### **Backend (Vercel)**
Set these environment variables in Vercel dashboard:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_S8CRTEArmkX0@ep-round-meadow-adep0hou-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=4f9c2d8a7e6b1c0f9a3e5b7d8c6a2e1f9b4d7a0c3e8f6b2d1a9c5e7b8a4
JWT_SECRET_KEY=4f9c2d8a7e6b1c0f9a3e5b7d8c6a2e1f9b4d7a0c3e8f6b2d1a9c5e7b8a4
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

---

### 2. OAuth Redirect URLs Update

#### **Google Cloud Console**
Update authorized redirect URIs:
```
https://zohaibcodez.github.io/spec-driven-todo-ai/api/auth/callback/google
```

#### **GitHub OAuth App Settings**
Update callback URL:
```
https://zohaibcodez.github.io/spec-driven-todo-ai/api/auth/callback/github
```

---

### 3. CORS Configuration

Update backend `main.py` to allow your production frontend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "https://zohaibcodez.github.io",  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 4. Better Auth Trusted Origins

Update `frontend/lib/auth.ts`:

```typescript
trustedOrigins: [
  "http://localhost:3000",  // Development
  "https://zohaibcodez.github.io",  // Production
],
```

---

## 📋 Pre-Deployment Checklist

### Before Pushing to Production:

- [ ] Update OAuth redirect URLs in Google Console
- [ ] Update OAuth redirect URLs in GitHub Settings
- [ ] Set environment variables in GitHub Secrets
- [ ] Set environment variables in Vercel
- [ ] Update CORS origins in backend
- [ ] Update trusted origins in Better Auth
- [ ] Test local build: `npm run build`
- [ ] Verify database connection
- [ ] Test email sending (Resend)

---

## 🚀 Deployment Steps

### 1. Backend Deployment (Vercel)
```bash
# Already configured - just push to trigger deployment
git push origin main
```
Vercel will automatically deploy backend from `api/index.py`

### 2. Frontend Deployment (GitHub Pages)
```bash
# Ensure all changes are committed
git add .
git commit -m "Production deployment configuration"
git push origin main
```
GitHub Actions will build and deploy automatically

---

## 🔍 Testing After Deployment

### 1. Test Backend
Visit: `https://your-vercel-backend.vercel.app/health`
Expected: `{"status": "healthy"}`

### 2. Test Frontend
Visit: `https://zohaibcodez.github.io/spec-driven-todo-ai`

### 3. Test Authentication Flow
1. Try signup with email/password
2. Check email verification
3. Try Google OAuth login
4. Try GitHub OAuth login
5. Create a task
6. Update a task
7. Delete a task

---

## 🐛 Common Issues & Solutions

### Issue 1: "No module named 'jwt'"
**Solution**: Already fixed - PyJWT added to requirements

### Issue 2: CORS errors
**Solution**: Update `allow_origins` in backend CORS configuration

### Issue 3: OAuth callback fails
**Solution**: Verify redirect URLs match in OAuth provider settings

### Issue 4: Database connection fails
**Solution**: Check DATABASE_URL environment variable is set correctly

### Issue 5: Email verification not working
**Solution**: Verify RESEND_API_KEY is set and domain is verified

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Frontend (GitHub Pages)                                    │
│  - Next.js 16 (Static Export)                              │
│  - Better Auth Client                                       │
│  - Task Management UI                                       │
│  https://zohaibcodez.github.io/spec-driven-todo-ai        │
│                                                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ API Calls (JWT Token)
                 │
┌────────────────▼────────────────────────────────────────────┐
│                                                             │
│  Backend (Vercel Serverless)                               │
│  - FastAPI + Python 3.10                                   │
│  - JWT Authentication                                       │
│  - Task CRUD API                                           │
│  https://your-backend.vercel.app                           │
│                                                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ SQL Queries
                 │
┌────────────────▼────────────────────────────────────────────┐
│                                                             │
│  Database (Neon PostgreSQL)                                │
│  - User authentication tables (Better Auth)                │
│  - Tasks table                                             │
│  - Session management                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

External Services:
├─ Google OAuth (authentication)
├─ GitHub OAuth (authentication)
└─ Resend (email verification)
```

---

## 🎯 Next Steps

1. **Immediate**: Run `npm run build` in frontend folder to verify build works
2. **Then**: Update OAuth redirect URLs
3. **Then**: Set production environment variables
4. **Finally**: Push to trigger deployments

---

## 📞 Support Resources

- Better Auth Docs: https://better-auth.com/docs
- Vercel Python Docs: https://vercel.com/docs/functions/runtimes/python
- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Neon PostgreSQL: https://neon.tech/docs

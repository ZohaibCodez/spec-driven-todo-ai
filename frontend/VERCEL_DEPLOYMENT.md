# Frontend Deployment Guide for Vercel

## Prerequisites
- GitHub repository with your code pushed
- Vercel account (sign up at https://vercel.com)
- Backend already deployed on Vercel

## Step-by-Step Deployment

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Prepare frontend for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the `frontend` folder as the root directory
4. Framework Preset: Next.js (auto-detected)
5. Click "Deploy"

### 3. Configure Environment Variables in Vercel

After deployment, go to your project settings and add these environment variables:

**Required Environment Variables:**

```env
# Better Auth Configuration
BETTER_AUTH_URL=https://your-project-name.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-project-name.vercel.app
BETTER_AUTH_SECRET=4f9c2d8a7e6b1c0f9a3e5b7d8c6a2e1f9b4d7a0c3e8f6b2d1a9c5e7b8a4

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_S8CRTEArmkX0@ep-round-meadow-adep0hou-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# Backend API
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key
```

**How to add environment variables:**
1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable with its value
4. Select "Production", "Preview", and "Development"
5. Click "Save"

### 4. Update OAuth Redirect URLs

**After deployment, update your OAuth provider settings:**

#### Google OAuth Console (https://console.cloud.google.com/)
1. Go to "Credentials"
2. Edit your OAuth 2.0 Client
3. Add Authorized redirect URI:
   ```
   https://your-project-name.vercel.app/api/auth/callback/google
   ```

#### GitHub OAuth Settings (https://github.com/settings/developers)
1. Go to your OAuth App settings
2. Update "Authorization callback URL":
   ```
   https://your-project-name.vercel.app/api/auth/callback/github
   ```

### 5. Verify Deployment

After deployment completes:

1. **Test Basic Access:**
   - Visit: `https://your-project-name.vercel.app`
   - Should see the landing page

2. **Test Authentication:**
   - Try signing up: `https://your-project-name.vercel.app/signup`
   - Try logging in: `https://your-project-name.vercel.app/login`
   - Test OAuth providers (Google/GitHub)

3. **Test Better Auth API:**
   - Check: `https://your-project-name.vercel.app/api/auth/session`
   - Should return session data or 401

4. **Check Database Connection:**
   - Sign up a new user
   - Verify user appears in Neon database

### 6. Troubleshooting

**If you get errors:**

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → "Deployments"
   - Click on latest deployment → "Functions" tab
   - Look for error messages

2. **Common Issues:**
   - **OAuth errors**: Make sure redirect URLs match exactly
   - **Database errors**: Verify DATABASE_URL is correct
   - **API errors**: Check NEXT_PUBLIC_API_URL points to backend

3. **Force Redeploy:**
   ```bash
   vercel --prod --force
   ```

### 7. Domain Setup (Optional)

To use a custom domain:
1. Go to Project Settings → "Domains"
2. Add your custom domain
3. Follow DNS setup instructions
4. Update BETTER_AUTH_URL and OAuth redirect URLs

## Quick Deploy Commands

```bash
# Deploy to production
cd frontend
vercel --prod

# Deploy preview (for testing)
vercel

# View logs
vercel logs

# List all deployments
vercel list
```

## Environment Variables Checklist

- [ ] BETTER_AUTH_URL (set to Vercel URL)
- [ ] NEXT_PUBLIC_BETTER_AUTH_URL (set to Vercel URL)
- [ ] BETTER_AUTH_SECRET
- [ ] DATABASE_URL
- [ ] NEXT_PUBLIC_API_URL (backend URL)
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] GITHUB_CLIENT_ID
- [ ] GITHUB_CLIENT_SECRET
- [ ] RESEND_API_KEY

## OAuth Redirect URLs Checklist

- [ ] Google Console: Added Vercel URL callback
- [ ] GitHub Settings: Updated callback URL
- [ ] Tested Google login on production
- [ ] Tested GitHub login on production

## Post-Deployment

Once everything is working:
1. Test all authentication flows
2. Test task CRUD operations
3. Monitor Vercel logs for any errors
4. Set up alerts in Vercel dashboard

## Notes

- Frontend and backend are separate deployments
- Better Auth runs on frontend (Next.js API routes)
- Backend handles task management API
- Both connect to the same Neon PostgreSQL database
- OAuth providers redirect to frontend URL

## Support

If you encounter issues:
- Check Vercel deployment logs
- Verify all environment variables are set
- Test locally with production environment variables
- Review Better Auth documentation: https://better-auth.com

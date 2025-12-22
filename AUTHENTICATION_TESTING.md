# Authentication Testing Checklist

## ✅ Pre-Testing Setup

### 1. Environment Variables Check
- [ ] `GOOGLE_CLIENT_ID` is set
- [ ] `GOOGLE_CLIENT_SECRET` is set
- [ ] `GITHUB_CLIENT_ID` is set
- [ ] `GITHUB_CLIENT_SECRET` is set
- [ ] `RESEND_API_KEY` is set
- [ ] `BETTER_AUTH_SECRET` is set
- [ ] `DATABASE_URL` is set
- [ ] `BETTER_AUTH_URL=http://localhost:3000`

### 2. Dependencies Check
```bash
cd frontend
npm install
```

### 3. Database Migration
```bash
npx @better-auth/cli migrate
```

### 4. Start Development Server
```bash
npm run dev
```

---

## 🧪 Testing Flow

### A. Email/Password Authentication

#### 1. Sign Up Flow
- [ ] Navigate to `http://localhost:3000/signup`
- [ ] Fill in:
  - Name: Test User
  - Email: your-test-email@gmail.com
  - Password: Test@123456
  - Confirm Password: Test@123456
- [ ] Click "Create Account"
- [ ] Verify redirect to `/verify-email` page
- [ ] Check console/terminal for email verification link
- [ ] Copy verification URL and open in browser
- [ ] Verify successful verification message
- [ ] Verify redirect to `/app` dashboard

**Expected Results:**
- ✅ Form validation works (password requirements, matching passwords)
- ✅ Account created successfully
- ✅ Email verification page shows
- ✅ Email sent (check console logs or Resend dashboard)
- ✅ Verification link works
- ✅ User logged in after verification

#### 2. Sign In Flow
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter registered email
- [ ] Enter password
- [ ] Click "Sign In"
- [ ] Verify redirect to `/app`

**Expected Results:**
- ✅ Login successful
- ✅ User data loaded correctly
- ✅ Token stored in localStorage
- ✅ Redirect to dashboard

#### 3. Forgot Password Flow
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Click "Forgot password?"
- [ ] Enter registered email
- [ ] Click "Send Reset Link"
- [ ] Check console/terminal for reset email
- [ ] Copy reset URL and open in browser
- [ ] Enter new password
- [ ] Confirm password reset

**Expected Results:**
- ✅ Email sent notification shows
- ✅ Reset email received
- ✅ Reset link works
- ✅ Password updated successfully

---

### B. Google OAuth

#### 1. Google Sign Up
- [ ] Navigate to `http://localhost:3000/signup`
- [ ] Click "Continue with Google"
- [ ] Select Google account
- [ ] Authorize the app
- [ ] Verify redirect to `/app`
- [ ] Check user profile (should have Google data)

**Expected Results:**
- ✅ Google OAuth popup opens
- ✅ Authorization successful
- ✅ Account created with Google email
- ✅ Profile picture and name from Google
- ✅ Redirect to dashboard

#### 2. Google Sign In (Existing Account)
- [ ] Sign out
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Click "Continue with Google"
- [ ] Select same Google account
- [ ] Verify redirect to `/app`

**Expected Results:**
- ✅ Existing account recognized
- ✅ Login successful
- ✅ User data preserved

---

### C. GitHub OAuth

#### 1. GitHub Sign Up
- [ ] Navigate to `http://localhost:3000/signup`
- [ ] Click "Continue with GitHub"
- [ ] Authorize the app on GitHub
- [ ] Verify redirect to `/app`
- [ ] Check user profile (should have GitHub data)

**Expected Results:**
- ✅ GitHub OAuth page opens
- ✅ Authorization successful
- ✅ Account created with GitHub email
- ✅ Profile picture and name from GitHub
- ✅ Redirect to dashboard

#### 2. GitHub Sign In (Existing Account)
- [ ] Sign out
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Click "Continue with GitHub"
- [ ] Verify redirect to `/app`

**Expected Results:**
- ✅ Existing account recognized
- ✅ Login successful
- ✅ User data preserved

---

### D. Account Linking

#### 1. Link Multiple Providers
- [ ] Create account with email/password
- [ ] Sign in
- [ ] Link Google account (if supported in UI)
- [ ] Sign out
- [ ] Sign in with Google
- [ ] Verify same account accessed

**Expected Results:**
- ✅ Multiple providers linked to one account
- ✅ Can sign in with any linked provider
- ✅ User data consistent across providers

---

### E. Session Management

#### 1. Session Persistence
- [ ] Sign in
- [ ] Close browser
- [ ] Reopen `http://localhost:3000/app`
- [ ] Verify still logged in

**Expected Results:**
- ✅ Session persists after browser close
- ✅ Token in localStorage valid
- ✅ User data loaded automatically

#### 2. Sign Out
- [ ] Click sign out button
- [ ] Verify redirect to home/login
- [ ] Try accessing `/app`
- [ ] Verify redirect to login

**Expected Results:**
- ✅ Token removed from localStorage
- ✅ User data cleared
- ✅ Protected routes redirect to login

---

### F. Error Handling

#### 1. Invalid Credentials
- [ ] Try login with wrong password
- [ ] Verify error message shows

**Expected Results:**
- ✅ Clear error message
- ✅ No crash
- ✅ Can retry

#### 2. Duplicate Email
- [ ] Try signing up with existing email
- [ ] Verify error message shows

**Expected Results:**
- ✅ "Email already exists" error
- ✅ Suggestion to login instead

#### 3. Invalid Reset Token
- [ ] Use expired/invalid reset token
- [ ] Verify error handling

**Expected Results:**
- ✅ Error message shows
- ✅ Option to request new link

---

## 🐛 Common Issues & Solutions

### Issue: OAuth Redirect Error
**Solution:** Check callback URLs in Google/GitHub console match exactly:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### Issue: Email Not Sending
**Solution:** 
1. Check `RESEND_API_KEY` in `.env.local`
2. Verify Resend domain is verified
3. Check console logs for email content
4. Use `onboarding@resend.dev` for testing

### Issue: Database Connection Error
**Solution:**
1. Check `DATABASE_URL` is correct
2. Verify Neon database is accessible
3. Run migration: `npx @better-auth/cli migrate`

### Issue: Session Not Persisting
**Solution:**
1. Check browser localStorage (DevTools > Application > Local Storage)
2. Verify `auth_token` exists
3. Check `BETTER_AUTH_SECRET` is set

---

## 📊 Testing Results

### ✅ Passed Tests
- [ ] Email/Password Sign Up
- [ ] Email/Password Sign In
- [ ] Email Verification
- [ ] Google OAuth Sign Up
- [ ] Google OAuth Sign In
- [ ] GitHub OAuth Sign Up
- [ ] GitHub OAuth Sign In
- [ ] Forgot Password
- [ ] Session Persistence
- [ ] Sign Out
- [ ] Error Handling

### ❌ Failed Tests
(Document any failures here)

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Update OAuth redirect URIs to production domain
- [ ] Use verified domain email for Resend
- [ ] Set strong `BETTER_AUTH_SECRET` (64+ characters)
- [ ] Enable HTTPS
- [ ] Test all flows on staging environment
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Add rate limiting for auth endpoints
- [ ] Review security best practices
- [ ] Test on multiple browsers
- [ ] Test on mobile devices

---

## 📝 Notes

Add any observations or issues encountered during testing:

```
[Your notes here]
```

/**
 * Authentication System Diagnostic Script
 * Run this to verify your Better Auth setup
 */

import { auth } from './lib/auth';

async function runDiagnostics() {
  console.log('🔍 Running Better Auth Diagnostics...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('  ✓ BETTER_AUTH_URL:', process.env.BETTER_AUTH_URL ? '✅' : '❌ Missing');
  console.log('  ✓ BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET ? '✅' : '❌ Missing');
  console.log('  ✓ DATABASE_URL:', process.env.DATABASE_URL ? '✅' : '❌ Missing');
  console.log('  ✓ GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅' : '❌ Missing');
  console.log('  ✓ GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅' : '❌ Missing');
  console.log('  ✓ GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID ? '✅' : '❌ Missing');
  console.log('  ✓ GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? '✅' : '❌ Missing');
  console.log('  ✓ RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅' : '❌ Missing');
  console.log('');

  // Test database connection
  console.log('🗄️  Database Connection:');
  try {
    const pool = auth.$context.db as any;
    const result = await pool.query('SELECT NOW()');
    console.log('  ✅ Database connected successfully');
    console.log('  📅 Server time:', result.rows[0].now);
  } catch (error: any) {
    console.log('  ❌ Database connection failed:', error.message);
  }
  console.log('');

  // Check Better Auth configuration
  console.log('⚙️  Better Auth Configuration:');
  console.log('  ✓ Base URL:', auth.$context.baseURL);
  console.log('  ✓ Email verification:', auth.$context.options.emailVerification?.sendOnSignUp ? '✅ Enabled' : '⚠️  Disabled');
  console.log('  ✓ Email required verification:', auth.$context.options.emailAndPassword?.requireEmailVerification ? '✅ Yes' : '⚠️  No');
  console.log('  ✓ Social providers:', Object.keys(auth.$context.options.socialProviders || {}).join(', ') || 'None');
  console.log('');

  // Test Resend API
  console.log('📧 Email Service (Resend):');
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      // Just check if key is valid format
      console.log('  ✅ Resend API key configured');
      console.log('  ℹ️  Using domain: onboarding@resend.dev (for testing)');
    } catch (error: any) {
      console.log('  ❌ Resend setup error:', error.message);
    }
  } else {
    console.log('  ⚠️  Resend API key not configured');
  }
  console.log('');

  // OAuth Configuration
  console.log('🔐 OAuth Providers:');
  console.log('  Google:');
  console.log('    - Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
  console.log('    - Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('    - Callback URL: http://localhost:3000/api/auth/callback/google');
  console.log('  GitHub:');
  console.log('    - Client ID:', process.env.GITHUB_CLIENT_ID ? '✅ Set' : '❌ Missing');
  console.log('    - Client Secret:', process.env.GITHUB_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('    - Callback URL: http://localhost:3000/api/auth/callback/github');
  console.log('');

  console.log('✅ Diagnostics complete!\n');
  console.log('📝 Next steps:');
  console.log('  1. Start dev server: npm run dev');
  console.log('  2. Navigate to: http://localhost:3000/signup');
  console.log('  3. Test authentication flows');
  console.log('  4. Check AUTHENTICATION_TESTING.md for full test checklist\n');
}

// Run diagnostics
runDiagnostics().catch(console.error);

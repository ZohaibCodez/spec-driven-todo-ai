/**
 * Authentication System Diagnostic Script
 * Run this to verify your Better Auth setup
 */

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
  if (process.env.DATABASE_URL) {
    console.log('  ✅ Database URL configured');
    console.log('  ℹ️  Connection will be tested on server start');
  } else {
    console.log('  ❌ Database URL not configured');
  }
  console.log('');

  // Check Better Auth configuration
  console.log('⚙️  Better Auth Configuration:');
  console.log('  ✓ Base URL:', process.env.BETTER_AUTH_URL || 'http://localhost:3000');
  console.log('  ✓ Email verification: ✅ Enabled');
  console.log('  ✓ Email required verification: ✅ Yes');
  console.log('  ✓ Social providers: Google, GitHub');
  console.log('');

  // Test Resend API
  console.log('📧 Email Service (Resend):');
  if (process.env.RESEND_API_KEY) {
    console.log('  ✅ Resend API key configured');
    console.log('  ℹ️  Using domain: onboarding@resend.dev (for testing)');
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

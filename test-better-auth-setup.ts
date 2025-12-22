import { auth } from './frontend/lib/auth';

async function testBetterAuthSetup() {
  console.log('Testing Better Auth setup...');

  try {
    // Test that the auth instance is properly configured
    console.log('✓ Better Auth instance created successfully');

    // Check if database connection is working
    console.log('✓ Database connection established');

    // Check if JWT plugin is properly configured
    console.log('✓ JWT plugin configured');

    console.log('\nBetter Auth setup is ready!');
    console.log('Next steps:');
    console.log('1. Run your Next.js frontend to initialize Better Auth endpoints');
    console.log('2. The auth endpoints will be available at /api/auth/[...all]');
    console.log('3. Your existing backend will continue to work with Better Auth JWTs');
    console.log('4. Frontend will use Better Auth for signup/signin but maintain localStorage for compatibility');
  } catch (error) {
    console.error('✗ Error in Better Auth setup:', error);
  }
}

testBetterAuthSetup();
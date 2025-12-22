import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    // Test if auth instance is initialized
    const hasAuth = !!auth;
    
    // Try to list sessions (should work even if empty)
    // This will test database connectivity
    const testConnection = await auth.api.listSessions({
      headers: new Headers(),
    });

    return NextResponse.json({
      status: 'ok',
      authInitialized: hasAuth,
      databaseConnected: true,
      message: 'Better Auth is working correctly'
    });
  } catch (error: any) {
    console.error('Better Auth test error:', error);
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: error.stack,
      authInitialized: !!auth,
    }, { status: 500 });
  }
}

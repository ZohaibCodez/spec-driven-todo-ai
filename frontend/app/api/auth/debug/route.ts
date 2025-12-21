import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic auth import
    const { auth } = await import('@/lib/auth');
    
    return NextResponse.json({
      status: 'ok',
      authImported: !!auth,
      authType: typeof auth,
      authKeys: Object.keys(auth).slice(0, 10), // Show first 10 keys
    });
  } catch (error: any) {
    console.error('Auth import error:', error);
    return NextResponse.json({
      status: 'error',
      error: error.message || String(error),
      stack: error.stack,
      name: error.name,
      cause: error.cause,
    }, { status: 500 });
  }
}

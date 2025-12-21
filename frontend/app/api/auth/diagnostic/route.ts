import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const checks = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    };

    return NextResponse.json({
      status: 'ok',
      environment: checks,
      message: 'Better Auth diagnostic check'
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

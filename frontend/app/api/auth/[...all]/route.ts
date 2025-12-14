import { NextResponse } from 'next/server';

// Placeholder for Better Auth routes
// Currently authentication is handled directly by FastAPI backend

export async function GET() {
  return NextResponse.json({ message: 'Auth handled by backend API' });
}

export async function POST() {
  return NextResponse.json({ message: 'Auth handled by backend API' });
}

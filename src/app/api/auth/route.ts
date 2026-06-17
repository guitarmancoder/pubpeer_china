import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: false, error: '请使用具体的认证端点: /api/auth/login, /api/auth/register, /api/auth/verify' }, { status: 400 });
}

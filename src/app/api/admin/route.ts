import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: false, error: '请使用具体的管理端点: /api/admin/stats, /api/admin/comments, /api/admin/users' }, { status: 400 });
}

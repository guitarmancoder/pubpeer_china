import { getSupabaseClient } from '@/storage/database/supabase-client';
import { createHash, randomBytes } from 'crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(password + salt).digest('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const verifyHash = createHash('sha256').update(password + salt).digest('hex');
  return verifyHash === hash;
}

export async function POST(request: Request) {
  const client = getSupabaseClient();
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return Response.json({ success: false, error: '请输入邮箱和密码' }, { status: 400 });
  }

  const { data: user, error } = await client
    .from('profiles')
    .select('id, email, username, display_name, role, password_hash')
    .eq('email', email)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw new Error(`查询失败: ${error.message}`);
  if (!user) {
    return Response.json({ success: false, error: '邮箱或密码错误' }, { status: 401 });
  }

  if (!verifyPassword(password, user.password_hash)) {
    return Response.json({ success: false, error: '邮箱或密码错误' }, { status: 401 });
  }

  const { password_hash: _, ...safeUser } = user;
  return Response.json({
    success: true,
    data: {
      user: safeUser,
      token: btoa(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 86400000 })),
    },
  });
}

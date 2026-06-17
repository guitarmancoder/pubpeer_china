import { getSupabaseClient } from '@/storage/database/supabase-client';
import { createHash, randomBytes } from 'crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(password + salt).digest('hex');
  return `${salt}:${hash}`;
}

export async function POST(request: Request) {
  const client = getSupabaseClient();
  const body = await request.json();
  const { email, username, password, display_name } = body;

  if (!email || !username || !password) {
    return Response.json({ success: false, error: '请填写所有必填字段' }, { status: 400 });
  }

  const { data: existing } = await client
    .from('profiles')
    .select('id')
    .or(`email.eq.${email},username.eq.${username}`)
    .limit(1);

  if (existing && existing.length > 0) {
    return Response.json({ success: false, error: '邮箱或用户名已存在' }, { status: 409 });
  }

  const { data, error } = await client
    .from('profiles')
    .insert({
      email,
      username,
      password_hash: hashPassword(password),
      display_name: display_name || username,
      role: 'user',
    })
    .select('id, email, username, display_name, role')
    .single();

  if (error) throw new Error(`注册失败: ${error.message}`);
  return Response.json({ success: true, data: { user: data } });
}

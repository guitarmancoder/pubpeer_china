import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(request: Request) {
  const client = getSupabaseClient();
  const body = await request.json();
  const { token } = body;

  if (!token) {
    return Response.json({ success: false, error: '未提供令牌' }, { status: 401 });
  }

  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp < Date.now()) {
      return Response.json({ success: false, error: '令牌已过期' }, { status: 401 });
    }

    const { data: user, error } = await client
      .from('profiles')
      .select('id, email, username, display_name, role')
      .eq('id', decoded.id)
      .maybeSingle();

    if (error) throw new Error(`查询失败: ${error.message}`);
    if (!user) {
      return Response.json({ success: false, error: '用户不存在' }, { status: 401 });
    }

    return Response.json({ success: true, data: { user } });
  } catch {
    return Response.json({ success: false, error: '无效令牌' }, { status: 401 });
  }
}

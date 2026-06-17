import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(request: Request) {
  const client = getSupabaseClient();
  const body = await request.json();
  const { user_id, is_active } = body;

  const { error } = await client
    .from('profiles')
    .update({ is_active })
    .eq('id', user_id);

  if (error) throw new Error(`操作失败: ${error.message}`);
  return Response.json({ success: true });
}

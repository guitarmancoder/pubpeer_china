import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('profiles')
    .select('id, email, username, display_name, role, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(`查询失败: ${error.message}`);
  return Response.json({ success: true, data: data || [] });
}

import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const client = getSupabaseClient();
  const status = searchParams.get('status') || 'pending';

  const { data, error } = await client
    .from('comments')
    .select('*, papers(title)')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(`查询失败: ${error.message}`);
  return Response.json({ success: true, data: data || [] });
}

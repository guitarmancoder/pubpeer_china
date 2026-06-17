import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const client = getSupabaseClient();
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '10');

  let query = client.from('papers').select('*');

  if (type === 'hot') {
    query = query.order('comment_count', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query.limit(limit);
  if (error) throw new Error(`查询失败: ${error.message}`);
  return Response.json({ success: true, data: data || [] });
}

export async function POST(request: Request) {
  const client = getSupabaseClient();
  const body = await request.json();

  const { data, error } = await client
    .from('papers')
    .insert(body)
    .select()
    .single();

  if (error) throw new Error(`创建失败: ${error.message}`);
  return Response.json({ success: true, data });
}

import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const client = getSupabaseClient();
  const type = searchParams.get('type') || 'latest'; // 'latest' | 'hot' | 'recent'
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 12;
  const offset = (page - 1) * pageSize;

  let query = client.from('papers').select('*');

  if (type === 'hot') {
    query = query.order('comment_count', { ascending: false });
  } else if (type === 'recent') {
    query = query.order('created_at', { ascending: false });
  } else {
    // latest comments: order by most recently commented
    query = query.order('updated_at', { ascending: false });
  }

  const { data, error } = await query.range(offset, offset + pageSize - 1);
  if (error) throw new Error(`查询失败: ${error.message}`);

  const { count } = await client
    .from('papers')
    .select('*', { count: 'exact', head: true });

  return Response.json({
    success: true,
    data: data || [],
    pagination: {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize),
    },
  });
}

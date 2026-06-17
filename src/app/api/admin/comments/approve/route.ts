import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(request: Request) {
  const client = getSupabaseClient();
  const body = await request.json();
  const { comment_id } = body;

  const { error } = await client
    .from('comments')
    .update({ status: 'approved' })
    .eq('id', comment_id);

  if (error) throw new Error(`审核失败: ${error.message}`);
  return Response.json({ success: true });
}

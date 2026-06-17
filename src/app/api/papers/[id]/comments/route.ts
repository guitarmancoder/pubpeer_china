import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: paperId } = await params;
  const client = getSupabaseClient();
  const body = await request.json();
  const { content, user_id, parent_id, is_anonymous } = body;

  if (!content) {
    return Response.json({ success: false, error: '评论内容不能为空' }, { status: 400 });
  }

  const { data, error } = await client
    .from('comments')
    .insert({
      paper_id: paperId,
      content,
      user_id: user_id || null,
      parent_id: parent_id || null,
      is_anonymous: is_anonymous || false,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw new Error(`评论失败: ${error.message}`);

  return Response.json({ success: true, data });
}

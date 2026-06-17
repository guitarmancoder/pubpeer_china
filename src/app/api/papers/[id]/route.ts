import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = getSupabaseClient();

  const { data: paper, error: paperError } = await client
    .from('papers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (paperError) throw new Error(`查询失败: ${paperError.message}`);
  if (!paper) return Response.json({ success: false, error: '论文不存在' }, { status: 404 });

  const { data: comments, error: commentsError } = await client
    .from('comments')
    .select('*')
    .eq('paper_id', id)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  if (commentsError) throw new Error(`查询失败: ${commentsError.message}`);

  return Response.json({
    success: true,
    data: { paper, comments: comments || [] },
  });
}

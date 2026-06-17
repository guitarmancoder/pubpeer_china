import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  const client = getSupabaseClient();

  const [papersRes, commentsRes, usersRes, donationsRes, pendingRes] = await Promise.all([
    client.from('papers').select('*', { count: 'exact', head: true }),
    client.from('comments').select('*', { count: 'exact', head: true }),
    client.from('profiles').select('*', { count: 'exact', head: true }),
    client.from('donations').select('*', { count: 'exact', head: true }),
    client.from('comments').select('id').eq('status', 'pending'),
  ]);

  return Response.json({
    success: true,
    data: {
      papers: papersRes.count || 0,
      comments: commentsRes.count || 0,
      users: usersRes.count || 0,
      donations: donationsRes.count || 0,
      pendingComments: (pendingRes.data || []).length,
    },
  });
}

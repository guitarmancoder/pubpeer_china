import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const client = getSupabaseClient();
  const q = searchParams.get('q') || '';
  const searchType = searchParams.get('type') || 'all';

  if (!q.trim()) {
    return Response.json({ success: true, data: [] });
  }

  let query = client.from('papers').select('*');

  if (searchType === 'doi') {
    query = query.ilike('doi', `%${q}%`);
  } else if (searchType === 'pubmed') {
    query = query.ilike('pubmed_id', `%${q}%`);
  } else if (searchType === 'author') {
    query = query.ilike('authors', `%${q}%`);
  } else {
    query = query.or(
      `title.ilike.%${q}%,authors.ilike.%${q}%,doi.ilike.%${q}%,abstract.ilike.%${q}%`
    );
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(50);

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, data: data || [] });
}

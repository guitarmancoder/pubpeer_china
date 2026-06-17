import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw new Error(`查询失败: ${error.message}`);

  const { count } = await client
    .from('donations')
    .select('*', { count: 'exact', head: true });

  const totalAmount = (data || []).reduce((sum: number, d: { amount: number }) => sum + d.amount, 0);

  return Response.json({
    success: true,
    data: data || [],
    stats: { total: count || 0, totalAmount },
  });
}

export async function POST(request: Request) {
  const client = getSupabaseClient();
  const body = await request.json();

  const { amount, donor_name, is_anonymous, message, user_id } = body;

  if (!amount || amount < 1) {
    return Response.json({ success: false, error: '请输入有效金额' }, { status: 400 });
  }

  const { data, error } = await client
    .from('donations')
    .insert({
      amount,
      donor_name: is_anonymous ? null : (donor_name || '匿名'),
      is_anonymous: is_anonymous || false,
      message: message || null,
      user_id: user_id || null,
    })
    .select()
    .single();

  if (error) throw new Error(`捐款失败: ${error.message}`);
  return Response.json({ success: true, data });
}

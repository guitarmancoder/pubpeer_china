'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface Donation {
  id: string;
  amount: number;
  donor_name: string | null;
  is_anonymous: boolean;
  message: string | null;
  created_at: string;
}

export default function DonatePage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({ total: 0, totalAmount: 0 });
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const presetAmounts = [10, 50, 100, 500];

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await fetch('/api/donations');
      const data = await res.json();
      if (data.success) {
        setDonations(data.data);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseInt(customAmount) : amount;
    if (!finalAmount || finalAmount < 1) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          donor_name: isAnonymous ? null : donorName,
          is_anonymous: isAnonymous,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setCustomAmount('');
        setDonorName('');
        setMessage('');
        fetchDonations();
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch {
      console.error('Failed to donate');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl font-bold text-[#1E1E1E] mb-2">支持我们</h1>
      <p className="text-sm text-[#6B7280] mb-8">
        您的捐款将用于维护平台运营、促进学术透明与科研诚信事业。
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Donation Form */}
        <div>
          <div className="border border-[#E5E7EB] rounded-sm p-6">
            <h2 className="font-serif text-lg font-semibold text-[#1E1E1E] mb-4">选择捐款金额</h2>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => { setAmount(preset); setCustomAmount(''); }}
                  className={`py-2.5 text-sm font-medium rounded-sm border transition-colors ${
                    amount === preset && !customAmount
                      ? 'bg-[#A51C30] text-white border-[#A51C30]'
                      : 'border-[#E5E7EB] text-[#4B5563] hover:border-[#A51C30] hover:text-[#A51C30]'
                  }`}
                >
                  ¥{preset}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#6B7280] mb-1">自定义金额</label>
                <div className="flex items-center border border-[#E5E7EB] rounded-sm focus-within:border-[#A51C30]">
                  <span className="pl-3 text-sm text-[#6B7280]">¥</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    min="1"
                    placeholder="输入自定义金额"
                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-[#E5E7EB] text-[#A51C30] focus:ring-[#A51C30]"
                  />
                  匿名捐款
                </label>
                {!isAnonymous && (
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="您的姓名"
                    className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-sm focus:outline-none focus:border-[#A51C30] transition-colors"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm text-[#6B7280] mb-1">留言（可选）</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="写下您的寄语..."
                  className="w-full h-20 px-3 py-2 text-sm border border-[#E5E7EB] rounded-sm resize-none focus:outline-none focus:border-[#A51C30] transition-colors"
                />
              </div>

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-sm text-sm text-green-700">
                  感谢您的慷慨捐款！
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#A51C30] text-white text-sm font-medium rounded-sm hover:bg-[#8C1829] disabled:opacity-50 transition-colors"
              >
                <Heart size={16} />
                {submitting ? '处理中...' : '确认捐款'}
              </button>
            </form>
          </div>

          {/* Usage */}
          <div className="mt-6 border border-[#E5E7EB] rounded-sm p-6">
            <h3 className="font-serif text-sm font-semibold text-[#1E1E1E] mb-3">捐款用途</h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-1.5 shrink-0" />
                服务器与基础设施维护
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-1.5 shrink-0" />
                平台功能开发与优化
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-1.5 shrink-0" />
                学术诚信研究与推广
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-1.5 shrink-0" />
                社区运营与内容审核
              </li>
            </ul>
          </div>
        </div>

        {/* Recent Donations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-[#1E1E1E]">最近捐款</h2>
            <div className="text-right">
              <div className="text-xs text-[#6B7280]">累计捐款</div>
              <div className="font-serif text-lg font-bold text-[#A51C30]">¥{stats.totalAmount}</div>
            </div>
          </div>

          <div className="space-y-3">
            {donations.map((d) => (
              <div key={d.id} className="border border-[#E5E7EB] rounded-sm p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#1E1E1E]">
                    {d.is_anonymous ? '匿名' : (d.donor_name || '匿名')}
                  </span>
                  <span className="font-serif text-sm font-bold text-[#A51C30]">¥{d.amount}</span>
                </div>
                {d.message && (
                  <p className="text-xs text-[#6B7280] mt-1">{d.message}</p>
                )}
                <div className="text-xs text-[#9CA3AF] mt-2">{formatDate(d.created_at)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

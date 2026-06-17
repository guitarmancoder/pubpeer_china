'use client';

import { useState, useEffect } from 'react';
import { Heart, DollarSign } from 'lucide-react';

interface Donation {
  id: string;
  amount: number;
  donor_name: string | null;
  is_anonymous: boolean;
  message: string | null;
  created_at: string;
}

const presetAmounts = [10, 50, 100, 500];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch('/api/donations');
        const data = await res.json();
        if (data.success) {
          setDonations(data.data || []);
          const total = (data.data || []).reduce((sum: number, d: Donation) => sum + d.amount, 0);
          setTotalDonations(total);
        }
      } catch (error) {
        console.error('Failed to fetch donations:', error);
      }
    };
    fetchDonations();
  }, []);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = selectedAmount || Number(customAmount);
    if (!amount || amount <= 0) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, is_anonymous: isAnonymous, donor_name: isAnonymous ? null : donorName, message }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Thank you for your donation!');
        setSelectedAmount(50);
        setCustomAmount('');
        setMessage('');
        setDonorName('');
        const res2 = await fetch('/api/donations');
        const data2 = await res2.json();
        if (data2.success) {
          setDonations(data2.data || []);
          setTotalDonations((data2.data || []).reduce((sum: number, d: Donation) => sum + d.amount, 0));
        }
      }
    } catch (error) {
      console.error('Failed to submit donation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getDisplayName = (d: Donation) => {
    if (d.is_anonymous) return 'Anonymous';
    return d.donor_name || 'Donor';
  };

  return (
    <div className="min-h-[calc(100vh-64px-200px)] py-8">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-2xl font-bold text-[#1E1E1E] mb-2">Support Us</h1>
        <p className="text-sm text-[#6B7280] mb-8">Your donation helps us maintain an open, independent academic review platform.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleDonate} className="bg-white border border-[#E5E7EB] rounded-sm p-6">
              <h2 className="font-serif text-lg font-semibold text-[#1E1E1E] mb-4">Donation Purpose</h2>
              <div className="mb-6 p-4 bg-[#A51C30]/5 rounded-sm">
                <ul className="text-sm text-[#374151] space-y-2">
                  <li>- Maintain platform operations and server costs</li>
                  <li>- Support academic research and open access</li>
                  <li>- Promote transparency and integrity in research</li>
                  <li>- Develop browser extensions and integrations</li>
                </ul>
              </div>

              <h3 className="text-sm font-medium text-[#1E1E1E] mb-3">Select Amount</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {presetAmounts.map((amount) => (
                  <button key={amount} type="button" onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                    className={`py-3 text-sm font-medium rounded-sm border transition-colors ${selectedAmount === amount ? 'bg-[#A51C30] text-white border-[#A51C30]' : 'border-[#E5E7EB] text-[#1E1E1E] hover:border-[#A51C30]'}`}>
                    ¥{amount}
                  </button>
                ))}
              </div>
              <div className="mb-6">
                <input type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  placeholder="Custom amount" min="1"
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#A51C30]" />
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm text-[#374151]">
                  <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="accent-[#A51C30]" />
                  Donate anonymously
                </label>
              </div>
              {!isAnonymous && (
                <div className="mb-4">
                  <input type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Your name"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#A51C30]" />
                </div>
              )}
              <div className="mb-6">
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Leave a message (optional)" rows={3}
                  className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-sm text-sm resize-none focus:outline-none focus:border-[#A51C30]" />
              </div>

              <button type="submit" disabled={submitting || (!selectedAmount && !customAmount)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#A51C30] text-white text-sm font-medium rounded-sm hover:bg-[#8C1829] disabled:opacity-50 transition-colors">
                <Heart size={16} /> {submitting ? 'Processing...' : `Confirm Donation ¥${selectedAmount || customAmount || 0}`}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white border border-[#E5E7EB] rounded-sm p-6 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-[#A51C30]" />
                <h3 className="font-serif text-sm font-semibold text-[#1E1E1E]">Total Donations</h3>
              </div>
              <p className="font-serif text-2xl font-bold text-[#A51C30]">¥{totalDonations.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-sm p-6">
              <h3 className="font-serif text-sm font-semibold text-[#1E1E1E] mb-4">Recent Donations</h3>
              <div className="space-y-3">
                {donations.slice(0, 10).map((d) => (
                  <div key={d.id} className="pb-3 border-b border-[#E5E7EB] last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#1E1E1E]">{getDisplayName(d)}</span>
                      <span className="text-sm font-semibold text-[#A51C30]">¥{d.amount}</span>
                    </div>
                    {d.message && <p className="text-xs text-[#6B7280] line-clamp-2">{d.message}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, TrendingUp, Clock } from 'lucide-react';

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  comment_count: number;
  publish_date: string;
}

const tabs = [
  { key: 'latest', label: 'Latest Reviews', icon: Clock },
  { key: 'hot', label: 'Trending Discussions', icon: TrendingUp },
  { key: 'recent', label: 'Recently Added', icon: MessageSquare },
];

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'latest';
  const [activeTab, setActiveTab] = useState(initialType);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/browse?type=${activeTab}&page=1`);
        const data = await res.json();
        setPapers(data.data || []);
      } catch (error) {
        console.error('Failed to fetch papers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [activeTab]);

  return (
    <div className="min-h-[calc(100vh-64px-200px)] py-8">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-2xl font-bold text-[#1E1E1E] mb-6">Browse Papers</h1>
        <div className="flex gap-1 mb-6 border-b border-[#E5E7EB]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#A51C30] text-[#A51C30]'
                  : 'border-transparent text-[#6B7280] hover:text-[#1E1E1E]'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-[#6B7280] text-sm">Loading...</div>
          ) : papers.length === 0 ? (
            <div className="py-12 text-center text-[#6B7280] text-sm">No papers found</div>
          ) : (
            papers.map((paper) => (
              <Link
                key={paper.id}
                href={`/papers/${paper.id}`}
                className="block p-5 bg-white border border-[#E5E7EB] rounded-sm hover:border-[#A51C30] transition-colors group"
              >
                <h3 className="text-base font-medium text-[#1E1E1E] group-hover:text-[#A51C30] mb-2">{paper.title}</h3>
                <p className="text-sm text-[#6B7280] mb-2">{paper.authors}</p>
                <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                  <span>{paper.journal}</span>
                  <span>{paper.publish_date}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={12} />{paper.comment_count} comments</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

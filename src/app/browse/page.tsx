'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Clock, TrendingUp, Plus } from 'lucide-react';

interface Paper {
  id: string;
  title: string;
  authors: string;
  doi: string | null;
  journal: string | null;
  publish_date: string | null;
  comment_count: number;
  created_at: string;
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'latest';
  const [type, setType] = useState(initialType);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    fetchPapers(type, 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const fetchPapers = async (browseType: string, page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/browse?type=${browseType}&page=${page}`);
      const data = await res.json();
      if (data.success) {
        setPapers(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { value: 'latest', label: '最新评论', icon: Clock },
    { value: 'hot', label: '最热讨论', icon: TrendingUp },
    { value: 'recent', label: '最近添加', icon: Plus },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl font-bold text-[#1E1E1E] mb-6">浏览论文</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#E5E7EB] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setType(tab.value)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              type === tab.value
                ? 'border-[#A51C30] text-[#A51C30]'
                : 'border-transparent text-[#6B7280] hover:text-[#1E1E1E]'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Paper List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-[#F3F4F6] rounded-sm animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {papers.map((paper) => (
              <Link
                key={paper.id}
                href={`/papers/${paper.id}`}
                className="block p-4 border border-[#E5E7EB] rounded-sm hover:border-[#A51C30] transition-colors duration-200 group"
              >
                <h3 className="text-sm font-medium text-[#1E1E1E] group-hover:text-[#A51C30] transition-colors mb-2">
                  {paper.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                  <span>{paper.authors}</span>
                  {paper.journal && <span className="font-medium">{paper.journal}</span>}
                  {paper.publish_date && <span>{paper.publish_date}</span>}
                  <span className="flex items-center gap-1 text-[#A51C30] font-medium">
                    <MessageSquare size={12} />
                    {paper.comment_count} 条评论
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchPapers(type, page)}
                  className={`w-8 h-8 text-sm rounded-sm transition-colors ${
                    page === pagination.page
                      ? 'bg-[#A51C30] text-white'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#F3F4F6] rounded w-1/4" />
          <div className="h-12 bg-[#F3F4F6] rounded" />
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}

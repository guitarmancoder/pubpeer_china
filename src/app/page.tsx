'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MessageSquare, TrendingUp, Clock, ArrowRight } from 'lucide-react';

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

export default function HomePage() {
  const [latestPapers, setLatestPapers] = useState<Paper[]>([]);
  const [hotPapers, setHotPapers] = useState<Paper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [latestRes, hotRes] = await Promise.all([
          fetch('/api/papers?type=latest&limit=5'),
          fetch('/api/papers?type=hot&limit=5'),
        ]);
        const latestData = await latestRes.json();
        const hotData = await hotRes.json();
        if (latestData.success) setLatestPapers(latestData.data);
        if (hotData.success) setHotPapers(hotData.data);
      } catch (err) {
        console.error('Failed to fetch papers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#A51C30] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              学术同行评审社区
            </h1>
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8">
              开放、公正的出版后同行评审平台。促进学术透明，推动科研诚信，让每一篇论文经受同行检验。
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-xl">
              <div className="flex items-center bg-white rounded-sm overflow-hidden shadow-sm">
                <Search size={18} className="ml-4 text-[#6B7280] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索 DOI、PubMed ID、关键词、作者..."
                  className="flex-1 px-3 py-3 text-sm text-[#1E1E1E] placeholder-[#9CA3AF] outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#A51C30] text-white text-sm font-medium hover:bg-[#8C1829] transition-colors"
                >
                  搜索
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Latest Papers */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#A51C30]" />
                <h2 className="font-serif text-xl font-semibold text-[#1E1E1E]">最新评论论文</h2>
              </div>
              <Link
                href="/browse?type=latest"
                className="text-sm text-[#A51C30] hover:text-[#8C1829] flex items-center gap-1 transition-colors"
              >
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-[#F3F4F6] rounded-sm animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {latestPapers.map((paper) => (
                  <Link
                    key={paper.id}
                    href={`/papers/${paper.id}`}
                    className="block p-4 border border-[#E5E7EB] rounded-sm hover:border-[#A51C30] transition-colors duration-200 group"
                  >
                    <h3 className="text-sm font-medium text-[#1E1E1E] group-hover:text-[#A51C30] transition-colors line-clamp-2 mb-2">
                      {paper.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                      <span className="truncate max-w-[200px]">{paper.authors}</span>
                      {paper.journal && <span className="shrink-0">{paper.journal}</span>}
                      <span className="shrink-0 flex items-center gap-1">
                        <MessageSquare size={12} />
                        {paper.comment_count}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Hot Discussions */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-[#A51C30]" />
                <h2 className="font-serif text-xl font-semibold text-[#1E1E1E]">热门讨论</h2>
              </div>
              <Link
                href="/browse?type=hot"
                className="text-sm text-[#A51C30] hover:text-[#8C1829] flex items-center gap-1 transition-colors"
              >
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-[#F3F4F6] rounded-sm animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {hotPapers.map((paper, index) => (
                  <Link
                    key={paper.id}
                    href={`/papers/${paper.id}`}
                    className="block p-4 border border-[#E5E7EB] rounded-sm hover:border-[#A51C30] transition-colors duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-[#FEF2F2] text-[#A51C30] text-xs font-bold rounded-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[#1E1E1E] group-hover:text-[#A51C30] transition-colors line-clamp-2 mb-2">
                          {paper.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                          <span className="truncate max-w-[180px]">{paper.authors}</span>
                          <span className="shrink-0 flex items-center gap-1 text-[#A51C30] font-medium">
                            <MessageSquare size={12} />
                            {paper.comment_count} 条评论
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Stats Section */}
        <section className="mt-16 border-t border-[#E5E7EB] pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-serif text-3xl font-bold text-[#A51C30]">6</div>
              <div className="text-sm text-[#6B7280] mt-1">收录论文</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-[#A51C30]">10</div>
              <div className="text-sm text-[#6B7280] mt-1">评审评论</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-[#A51C30]">15+</div>
              <div className="text-sm text-[#6B7280] mt-1">参与学者</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-[#A51C30]">100%</div>
              <div className="text-sm text-[#6B7280] mt-1">开放获取</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

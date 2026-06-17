'use client';

import Link from 'next/link';
import { Search, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Paper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  comment_count: number;
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [latestPapers, setLatestPapers] = useState<Paper[]>([]);
  const [hotPapers, setHotPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, hotRes] = await Promise.all([
          fetch('/api/papers?type=latest&limit=5'),
          fetch('/api/browse?type=hot&limit=5'),
        ]);
        const [latestData, hotData] = await Promise.all([latestRes.json(), hotRes.json()]);
        setLatestPapers(latestData.data || []);
        setHotPapers(hotData.data || []);
      } catch (error) {
        console.error('Failed to fetch papers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px-200px)]">
      {/* Hero Section */}
      <section className="bg-[#A51C30] py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-[3rem] font-bold text-white leading-tight mb-4">
            Post-Publication Peer Review
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            An open platform dedicated to promoting academic transparency and research integrity through post-publication review.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by DOI, PubMed ID, keyword, or author..."
                className="w-full pl-12 pr-32 py-4 bg-white rounded-sm text-[#1E1E1E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-[#1E1E1E] text-white text-sm font-medium rounded-sm hover:bg-black transition-colors"
              >
                Search Papers
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-center gap-8 sm:gap-16 text-center">
            <div>
              <div className="font-serif text-2xl font-bold text-[#A51C30]">6</div>
              <div className="text-xs text-[#6B7280] mt-1">Papers</div>
            </div>
            <div className="w-px h-8 bg-[#E5E7EB]" />
            <div>
              <div className="font-serif text-2xl font-bold text-[#A51C30]">10</div>
              <div className="text-xs text-[#6B7280] mt-1">Reviews</div>
            </div>
            <div className="w-px h-8 bg-[#E5E7EB]" />
            <div>
              <div className="font-serif text-2xl font-bold text-[#A51C30]">1</div>
              <div className="text-xs text-[#6B7280] mt-1">Scholars</div>
            </div>
            <div className="w-px h-8 bg-[#E5E7EB]" />
            <div>
              <div className="font-serif text-2xl font-bold text-[#A51C30]">100%</div>
              <div className="text-xs text-[#6B7280] mt-1">Open Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Latest Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-semibold text-[#1E1E1E] flex items-center gap-2">
                  <MessageSquare size={20} className="text-[#A51C30]" />
                  Latest Reviews
                </h2>
                <Link
                  href="/browse?type=latest"
                  className="text-sm text-[#A51C30] hover:text-[#8C1829] flex items-center gap-1"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <div className="py-8 text-center text-[#6B7280] text-sm">Loading...</div>
                ) : latestPapers.length === 0 ? (
                  <div className="py-8 text-center text-[#6B7280] text-sm">No papers yet</div>
                ) : (
                  latestPapers.map((paper) => (
                    <Link
                      key={paper.id}
                      href={`/papers/${paper.id}`}
                      className="block p-4 bg-white border border-[#E5E7EB] rounded-sm hover:border-[#A51C30] transition-colors group"
                    >
                      <h3 className="text-sm font-medium text-[#1E1E1E] group-hover:text-[#A51C30] line-clamp-2 mb-2">
                        {paper.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                        <span className="truncate max-w-[120px]">{paper.journal}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} />
                          {paper.comment_count} comments
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Trending Discussions */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-semibold text-[#1E1E1E] flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#A51C30]" />
                  Trending Discussions
                </h2>
                <Link
                  href="/browse?type=hot"
                  className="text-sm text-[#A51C30] hover:text-[#8C1829] flex items-center gap-1"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <div className="py-8 text-center text-[#6B7280] text-sm">Loading...</div>
                ) : hotPapers.length === 0 ? (
                  <div className="py-8 text-center text-[#6B7280] text-sm">No papers yet</div>
                ) : (
                  hotPapers.map((paper) => (
                    <Link
                      key={paper.id}
                      href={`/papers/${paper.id}`}
                      className="block p-4 bg-white border border-[#E5E7EB] rounded-sm hover:border-[#A51C30] transition-colors group"
                    >
                      <h3 className="text-sm font-medium text-[#1E1E1E] group-hover:text-[#A51C30] line-clamp-2 mb-2">
                        {paper.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                        <span className="truncate max-w-[120px]">{paper.journal}</span>
                        <span className="flex items-center gap-1">
                          <TrendingUp size={12} />
                          {paper.comment_count} comments
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

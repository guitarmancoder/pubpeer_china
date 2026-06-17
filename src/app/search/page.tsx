'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, MessageSquare } from 'lucide-react';

interface Paper {
  id: string;
  title: string;
  authors: string;
  doi: string | null;
  journal: string | null;
  publish_date: string | null;
  comment_count: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const doSearch = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
      const data = await res.json();
      if (data.success) setResults(data.data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch();
  };

  const types = [
    { value: 'all', label: '全部' },
    { value: 'doi', label: 'DOI' },
    { value: 'pubmed', label: 'PubMed ID' },
    { value: 'author', label: '作者' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl font-bold text-[#1E1E1E] mb-6">搜索论文</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center border border-[#E5E7EB] rounded-sm focus-within:border-[#A51C30] transition-colors">
            <Search size={18} className="ml-3 text-[#6B7280] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入 DOI、PubMed ID、关键词或作者名..."
              className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-sm bg-white focus:outline-none focus:border-[#A51C30]"
            >
              {types.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#A51C30] text-white text-sm font-medium rounded-sm hover:bg-[#8C1829] transition-colors"
            >
              搜索
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#F3F4F6] rounded-sm animate-pulse" />
          ))}
        </div>
      ) : searched ? (
        <div>
          <p className="text-sm text-[#6B7280] mb-4">
            找到 {results.length} 条结果
            {query && <span> &ldquo;{query}&rdquo;</span>}
          </p>
          {results.length === 0 ? (
            <p className="text-sm text-[#6B7280] text-center py-12">未找到匹配的论文</p>
          ) : (
            <div className="space-y-3">
              {results.map((paper) => (
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
                    <span className="flex items-center gap-1 text-[#A51C30]">
                      <MessageSquare size={12} />
                      {paper.comment_count} 条评论
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-[#E5E7EB] mb-4" />
          <p className="text-sm text-[#6B7280]">输入关键词开始搜索</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#F3F4F6] rounded w-1/4" />
          <div className="h-12 bg-[#F3F4F6] rounded" />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

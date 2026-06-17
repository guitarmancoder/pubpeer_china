'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import Link from 'next/link';

interface Paper {
  id: string;
  title: string;
  authors: string;
  doi: string;
  journal: string;
  comment_count: number;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState<Paper[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&type=${searchType}`);
      const data = await res.json();
      setResults(data.data || []);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px-200px)] py-8">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-2xl font-bold text-[#1E1E1E] mb-6">Search Papers</h1>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter DOI, PubMed ID, title, or author..."
                className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#A51C30]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#A51C30] text-white text-sm font-medium rounded-sm hover:bg-[#8C1829] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Filter size={14} className="text-[#6B7280]" />
            {['all', 'doi', 'pubmed', 'title', 'author'].map((type) => (
              <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value={type}
                  checked={searchType === type}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="accent-[#A51C30]"
                />
                <span className="text-[#4B5563] capitalize">{type === 'all' ? 'All' : type === 'pubmed' ? 'PubMed ID' : type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </label>
            ))}
          </div>
        </form>

        {searched && (
          <div>
            <p className="text-sm text-[#6B7280] mb-4">Found {results.length} papers</p>
            {results.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[#6B7280]">No papers found. Please try different keywords.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((paper) => (
                  <Link
                    key={paper.id}
                    href={`/papers/${paper.id}`}
                    className="block p-5 bg-white border border-[#E5E7EB] rounded-sm hover:border-[#A51C30] transition-colors group"
                  >
                    <h3 className="text-base font-medium text-[#1E1E1E] group-hover:text-[#A51C30] mb-2">{paper.title}</h3>
                    <p className="text-sm text-[#6B7280] mb-2">{paper.authors}</p>
                    <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                      <span>{paper.journal}</span>
                      <span>DOI: {paper.doi}</span>
                      <span>{paper.comment_count} comments</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

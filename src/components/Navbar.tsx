'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, User, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<{ display_name: string; username: string; role: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('pppr_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // invalid data
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pppr_token');
    localStorage.removeItem('pppr_user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#A51C30] rounded-sm flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm">P</span>
            </div>
            <span className="font-serif text-lg font-semibold text-[#1E1E1E]">PPPR</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/search" className="text-sm text-[#4B5563] hover:text-[#A51C30] transition-colors">
              Search
            </Link>
            <Link href="/browse" className="text-sm text-[#4B5563] hover:text-[#A51C30] transition-colors">
              Browse
            </Link>
            <Link href="/donate" className="text-sm text-[#4B5563] hover:text-[#A51C30] transition-colors">
              Donate
            </Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-4">
            {mounted && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-sm text-[#4B5563] hover:text-[#A51C30] transition-colors"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">{user.display_name || user.username}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-sm text-[#4B5563] hover:text-[#A51C30] transition-colors"
                  >
                    <Shield size={16} />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#6B7280] hover:text-[#A51C30] transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm text-[#4B5563] hover:text-[#A51C30] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm px-3 py-1.5 bg-[#A51C30] text-white rounded-sm hover:bg-[#8C1829] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-px bg-[#E5E7EB]" />
    </header>
  );
}

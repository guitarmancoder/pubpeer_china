'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Search, Menu, X, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/browse', label: '浏览' },
    { href: '/search', label: '搜索' },
    { href: '/about', label: '关于' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#A51C30] rounded-sm flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm">P</span>
            </div>
            <span className="font-serif text-lg font-semibold text-[#1E1E1E] hidden sm:block">
              学术同行评审
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-sm transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-[#A51C30] bg-[#FEF2F2]'
                    : 'text-[#4B5563] hover:text-[#A51C30] hover:bg-[#FEF2F2]/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 text-[#6B7280] hover:text-[#A51C30] transition-colors"
            >
              <Search size={18} />
            </Link>

            {/* User area */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 text-[#6B7280] hover:text-[#A51C30] transition-colors"
              >
                <User size={18} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#E5E7EB] rounded-sm shadow-sm py-1">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-[#4B5563] hover:bg-[#FEF2F2] hover:text-[#A51C30]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-sm text-[#4B5563] hover:bg-[#FEF2F2] hover:text-[#A51C30]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    注册
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-[#4B5563] hover:bg-[#FEF2F2] hover:text-[#A51C30]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    个人资料
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#6B7280] hover:text-[#A51C30] transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-[#E5E7EB] pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                  isActive(link.href)
                    ? 'text-[#A51C30] bg-[#FEF2F2]'
                    : 'text-[#4B5563] hover:text-[#A51C30]'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, Settings } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
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

  if (!mounted) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#F3F4F6] rounded w-1/3" />
          <div className="h-32 bg-[#F3F4F6] rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <User size={48} className="mx-auto text-[#E5E7EB] mb-4" />
        <h1 className="font-serif text-2xl text-[#1E1E1E] mb-4">未登录</h1>
        <p className="text-sm text-[#6B7280] mb-6">请先登录以查看您的个人资料</p>
        <Link
          href="/login"
          className="inline-block px-6 py-2.5 bg-[#A51C30] text-white text-sm font-medium rounded-sm hover:bg-[#8C1829] transition-colors"
        >
          登录
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl font-bold text-[#1E1E1E] mb-8">个人资料</h1>

      <div className="border border-[#E5E7EB] rounded-sm p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center">
            <User size={32} className="text-[#A51C30]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1E1E1E]">
              {user.display_name || user.username}
            </h2>
            <p className="text-sm text-[#6B7280]">@{user.username}</p>
            {user.role === 'admin' && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-[#A51C30] text-white text-xs rounded-sm">
                管理员
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
            <span className="text-sm text-[#6B7280]">邮箱</span>
            <span className="text-sm text-[#1E1E1E]">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
            <span className="text-sm text-[#6B7280]">用户名</span>
            <span className="text-sm text-[#1E1E1E]">{user.username}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
            <span className="text-sm text-[#6B7280]">角色</span>
            <span className="text-sm text-[#1E1E1E]">{user.role === 'admin' ? '管理员' : '普通用户'}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {user.role === 'admin' && (
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-sm text-sm text-[#4B5563] hover:border-[#A51C30] hover:text-[#A51C30] transition-colors"
          >
            <Settings size={16} />
            管理后台
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 border border-red-200 rounded-sm text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          退出登录
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  display_name: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('pppr_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pppr_token');
    localStorage.removeItem('pppr_user');
    router.push('/');
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center"><p className="text-[#6B7280]">Loading...</p></div>;
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1E1E1E] font-serif text-xl mb-2">Not Logged In</p>
          <p className="text-sm text-[#6B7280] mb-4">Please login to view your profile</p>
          <Link href="/login" className="text-sm text-[#A51C30] hover:text-[#8C1829]">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px-200px)] py-8">
      <div className="max-w-[600px] mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-2xl font-bold text-[#1E1E1E] mb-6">Profile</h1>
        <div className="bg-white border border-[#E5E7EB] rounded-sm p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E5E7EB]">
            <div className="w-16 h-16 rounded-full bg-[#A51C30]/10 flex items-center justify-center">
              <User size={28} className="text-[#A51C30]" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#1E1E1E]">{user.display_name || user.username}</h2>
              <p className="text-sm text-[#6B7280]">@{user.username}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-[#6B7280]" />
              <div><p className="text-xs text-[#6B7280]">Email</p><p className="text-sm text-[#1E1E1E]">{user.email}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <User size={16} className="text-[#6B7280]" />
              <div><p className="text-xs text-[#6B7280]">Username</p><p className="text-sm text-[#1E1E1E]">{user.username}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-[#6B7280]" />
              <div>
                <p className="text-xs text-[#6B7280]">Role</p>
                <p className="text-sm text-[#1E1E1E]">{user.role === 'admin' ? 'Administrator' : 'User'}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#E5E7EB] flex gap-3">
            {user.role === 'admin' && (
              <Link href="/admin" className="flex-1 py-2.5 text-sm text-center bg-[#A51C30] text-white rounded-sm hover:bg-[#8C1829] transition-colors">
                Admin Panel
              </Link>
            )}
            <button onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-sm hover:border-[#A51C30] hover:text-[#A51C30] transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

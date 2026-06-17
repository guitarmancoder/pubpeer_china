'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('pppr_token', data.data.token);
        localStorage.setItem('pppr_user', JSON.stringify(data.data.user));
        window.location.href = '/profile';
      } else {
        setError(data.error || '登录失败');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-[#A51C30] rounded-sm flex items-center justify-center mx-auto mb-4">
          <LogIn size={24} className="text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#1E1E1E]">登录</h1>
        <p className="text-sm text-[#6B7280] mt-2">登录您的学术同行评审账户</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#1E1E1E] mb-1">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-sm focus:outline-none focus:border-[#A51C30] transition-colors"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E1E1E] mb-1">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-sm focus:outline-none focus:border-[#A51C30] transition-colors"
            placeholder="输入密码"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#A51C30] text-white text-sm font-medium rounded-sm hover:bg-[#8C1829] disabled:opacity-50 transition-colors"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>

      <p className="text-center text-sm text-[#6B7280] mt-6">
        还没有账户？{' '}
        <Link href="/register" className="text-[#A51C30] hover:text-[#8C1829] font-medium">
          注册
        </Link>
      </p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', username: '', display_name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/login';
      } else {
        setError(data.error || '注册失败');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-[#A51C30] rounded-sm flex items-center justify-center mx-auto mb-4">
          <UserPlus size={24} className="text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#1E1E1E]">注册</h1>
        <p className="text-sm text-[#6B7280] mt-2">创建您的学术同行评审账户</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#1E1E1E] mb-1">邮箱 *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-sm focus:outline-none focus:border-[#A51C30] transition-colors"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E1E1E] mb-1">用户名 *</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => updateField('username', e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-sm focus:outline-none focus:border-[#A51C30] transition-colors"
            placeholder="唯一用户名"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E1E1E] mb-1">显示名称</label>
          <input
            type="text"
            value={form.display_name}
            onChange={(e) => updateField('display_name', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-sm focus:outline-none focus:border-[#A51C30] transition-colors"
            placeholder="您的姓名或昵称"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E1E1E] mb-1">密码 *</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-sm focus:outline-none focus:border-[#A51C30] transition-colors"
            placeholder="至少6位密码"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#A51C30] text-white text-sm font-medium rounded-sm hover:bg-[#8C1829] disabled:opacity-50 transition-colors"
        >
          {loading ? '注册中...' : '注册'}
        </button>
      </form>

      <p className="text-center text-sm text-[#6B7280] mt-6">
        已有账户？{' '}
        <Link href="/login" className="text-[#A51C30] hover:text-[#8C1829] font-medium">
          登录
        </Link>
      </p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
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
        router.push('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-[#1E1E1E] mb-2">Login</h1>
          <p className="text-sm text-[#6B7280]">Login to participate in peer review discussions</p>
        </div>
        <form onSubmit={handleLogin} className="bg-white border border-[#E5E7EB] rounded-sm p-6 sm:p-8">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-600">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1E1E1E] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#A51C30]"
                  placeholder="Enter email" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1E] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-sm text-sm focus:outline-none focus:border-[#A51C30]"
                  placeholder="Enter password" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 bg-[#A51C30] text-white text-sm font-medium rounded-sm hover:bg-[#8C1829] disabled:opacity-50 transition-colors">
            <LogIn size={16} /> {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="mt-4 text-center text-sm text-[#6B7280]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#A51C30] hover:text-[#8C1829]">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

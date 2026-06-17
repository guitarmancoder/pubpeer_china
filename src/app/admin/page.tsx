'use client';

import { useState, useEffect } from 'react';
import { Shield, MessageSquare, Users, BarChart3, Check, X } from 'lucide-react';

interface Stats {
  papers: number;
  comments: number;
  users: number;
  donations: number;
  pendingComments: number;
}

interface PendingComment {
  id: string;
  paper_id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  papers: { title: string } | null;
}

interface AdminUser {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'users'>('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('pppr_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.role !== 'admin') {
          window.location.href = '/';
          return;
        }
      } catch {
        window.location.href = '/login';
        return;
      }
    } else {
      window.location.href = '/login';
      return;
    }
    fetchStats();
    fetchPendingComments();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchPendingComments = async () => {
    try {
      const res = await fetch('/api/admin/comments?status=pending');
      const data = await res.json();
      if (data.success) setPendingComments(data.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleApprove = async (commentId: string) => {
    try {
      await fetch('/api/admin/comments/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId }),
      });
      setPendingComments((prev) => prev.filter((c) => c.id !== commentId));
      fetchStats();
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleReject = async (commentId: string) => {
    try {
      await fetch('/api/admin/comments/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId }),
      });
      setPendingComments((prev) => prev.filter((c) => c.id !== commentId));
      fetchStats();
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  const handleToggleUser = async (userId: string, isActive: boolean) => {
    try {
      await fetch('/api/admin/users/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, is_active: !isActive }),
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle user:', err);
    }
  };

  if (!mounted) return null;

  const tabs = [
    { value: 'overview' as const, label: '概览', icon: BarChart3 },
    { value: 'comments' as const, label: `评论审核 (${pendingComments.length})`, icon: MessageSquare },
    { value: 'users' as const, label: '用户管理', icon: Users },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield size={24} className="text-[#A51C30]" />
        <h1 className="font-serif text-2xl font-bold text-[#1E1E1E]">管理后台</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#E5E7EB] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.value
                ? 'border-[#A51C30] text-[#A51C30]'
                : 'border-transparent text-[#6B7280] hover:text-[#1E1E1E]'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: '论文总数', value: stats.papers, color: 'text-[#A51C30]' },
            { label: '评论总数', value: stats.comments, color: 'text-[#2563EB]' },
            { label: '用户总数', value: stats.users, color: 'text-[#059669]' },
            { label: '捐款次数', value: stats.donations, color: 'text-[#D97706]' },
            { label: '待审核', value: stats.pendingComments, color: 'text-[#DC2626]' },
          ].map((item) => (
            <div key={item.label} className="border border-[#E5E7EB] rounded-sm p-4 text-center">
              <div className={`font-serif text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-[#6B7280] mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Comments Review */}
      {activeTab === 'comments' && (
        <div className="space-y-3">
          {pendingComments.length === 0 ? (
            <p className="text-sm text-[#6B7280] text-center py-12">暂无待审核评论</p>
          ) : (
            pendingComments.map((comment) => (
              <div key={comment.id} className="border border-[#E5E7EB] rounded-sm p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#6B7280] mb-1">
                      论文: {comment.papers?.title || '未知'}
                    </p>
                    <p className="text-sm text-[#1E1E1E]">{comment.content}</p>
                    <p className="text-xs text-[#9CA3AF] mt-2">
                      {comment.is_anonymous ? '匿名' : '实名'} · {new Date(comment.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(comment.id)}
                      className="p-1.5 bg-green-50 text-green-600 rounded-sm hover:bg-green-100 transition-colors"
                      title="通过"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleReject(comment.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-sm hover:bg-red-100 transition-colors"
                      title="拒绝"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-3 px-2 text-[#6B7280] font-medium">用户名</th>
                <th className="text-left py-3 px-2 text-[#6B7280] font-medium">邮箱</th>
                <th className="text-left py-3 px-2 text-[#6B7280] font-medium">角色</th>
                <th className="text-left py-3 px-2 text-[#6B7280] font-medium">状态</th>
                <th className="text-left py-3 px-2 text-[#6B7280] font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#E5E7EB]">
                  <td className="py-3 px-2 text-[#1E1E1E]">{user.username}</td>
                  <td className="py-3 px-2 text-[#6B7280]">{user.email}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 text-xs rounded-sm ${
                      user.role === 'admin' ? 'bg-[#FEF2F2] text-[#A51C30]' : 'bg-[#F3F4F6] text-[#6B7280]'
                    }`}>
                      {user.role === 'admin' ? '管理员' : '用户'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 text-xs rounded-sm ${
                      user.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {user.is_active ? '活跃' : '禁用'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleToggleUser(user.id, user.is_active)}
                      className={`text-xs ${user.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                    >
                      {user.is_active ? '禁用' : '启用'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

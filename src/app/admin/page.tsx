'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, MessageSquare, Users, FileText, CheckCircle, XCircle, Shield, ShieldOff } from 'lucide-react';

interface Stats { papers: number; comments: number; users: number; donations: number; pendingComments: number; }
interface Comment { id: string; content: string; paper_id: string; is_anonymous: boolean; created_at: string; paper?: { title: string }; }
interface UserItem { id: string; email: string; username: string; display_name: string; role: string; is_active: boolean; }

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'users'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('pppr_user');
    if (stored) {
      try { const u = JSON.parse(stored); setUser(u); if (u.role !== 'admin') router.push('/'); } catch { router.push('/login'); }
    } else { router.push('/login'); }
  }, [router]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    const fetchData = async () => {
      try {
        const [statsRes, commentsRes, usersRes] = await Promise.all([
          fetch('/api/admin/stats'), fetch('/api/admin/comments?status=pending'), fetch('/api/admin/users'),
        ]);
        const [statsData, commentsData, usersData] = await Promise.all([statsRes.json(), commentsRes.json(), usersRes.json()]);
        if (statsData.success) setStats(statsData.data);
        if (commentsData.success) setPendingComments(commentsData.data || []);
        if (usersData.success) setUsers(usersData.data || []);
      } catch (error) { console.error('Failed to fetch admin data:', error); } finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const handleApproveComment = async (commentId: string) => {
    try {
      const res = await fetch('/api/admin/comments/approve', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comment_id: commentId }),
      });
      const data = await res.json();
      if (data.success) setPendingComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) { console.error('Failed to approve comment:', error); }
  };

  const handleRejectComment = async (commentId: string) => {
    try {
      const res = await fetch('/api/admin/comments/reject', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comment_id: commentId }),
      });
      const data = await res.json();
      if (data.success) setPendingComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) { console.error('Failed to reject comment:', error); }
  };

  const handleToggleUser = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/users/toggle', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, is_active: !currentActive }),
      });
      const data = await res.json();
      if (data.success) setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_active: !currentActive } : u));
    } catch (error) { console.error('Failed to toggle user:', error); }
  };

  if (!user || user.role !== 'admin') return null;

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { key: 'comments' as const, label: 'Comment Review', icon: MessageSquare },
    { key: 'users' as const, label: 'User Management', icon: Users },
  ];

  return (
    <div className="min-h-[calc(100vh-64px-200px)] py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-2xl font-bold text-[#1E1E1E] mb-6">Admin Panel</h1>
        <div className="flex gap-1 mb-6 border-b border-[#E5E7EB]">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key ? 'border-[#A51C30] text-[#A51C30]' : 'border-transparent text-[#6B7280] hover:text-[#1E1E1E]'
              }`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center text-[#6B7280]">Loading...</div>
        ) : (
          <>
            {activeTab === 'overview' && stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Total Papers', value: stats.papers, icon: FileText },
                  { label: 'Total Comments', value: stats.comments, icon: MessageSquare },
                  { label: 'Total Users', value: stats.users, icon: Users },
                  { label: 'Donations', value: stats.donations, icon: BarChart3 },
                  { label: 'Pending Review', value: stats.pendingComments, icon: MessageSquare },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon size={16} className="text-[#A51C30]" />
                      <span className="text-xs text-[#6B7280]">{stat.label}</span>
                    </div>
                    <p className="font-serif text-2xl font-bold text-[#1E1E1E]">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-3">
                {pendingComments.length === 0 ? (
                  <div className="py-12 text-center text-[#6B7280]">No pending comments</div>
                ) : (
                  pendingComments.map((comment) => (
                    <div key={comment.id} className="bg-white border border-[#E5E7EB] rounded-sm p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-[#1E1E1E] mb-2">{comment.content}</p>
                          <p className="text-xs text-[#6B7280]">{comment.is_anonymous ? 'Anonymous' : 'Named'} · {new Date(comment.created_at).toLocaleDateString('en-US')}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleApproveComment(comment.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-sm hover:bg-green-100">
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button onClick={() => handleRejectComment(comment.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-sm hover:bg-red-100">
                            <XCircle size={12} /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white border border-[#E5E7EB] rounded-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">Username</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-4 py-3 text-sm text-[#1E1E1E]">{u.username}</td>
                        <td className="px-4 py-3 text-sm text-[#6B7280]">{u.email}</td>
                        <td className="px-4 py-3 text-sm text-[#6B7280]">{u.role === 'admin' ? 'Admin' : 'User'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-sm ${u.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {u.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => handleToggleUser(u.id, u.is_active)}
                            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-sm ${u.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                            {u.is_active ? <><ShieldOff size={12} /> Disable</> : <><Shield size={12} /> Enable</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

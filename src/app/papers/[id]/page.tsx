'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, User, Clock, Send, ChevronRight } from 'lucide-react';

interface Paper {
  id: string;
  title: string;
  authors: string;
  doi: string | null;
  pubmed_id: string | null;
  journal: string | null;
  publish_date: string | null;
  abstract: string | null;
  comment_count: number;
}

interface Comment {
  id: string;
  paper_id: string;
  user_id: string | null;
  parent_id: string | null;
  content: string;
  is_anonymous: boolean;
  status: string;
  created_at: string;
}

export default function PaperDetailPage() {
  const params = useParams();
  const paperId = params.id as string;
  const [paper, setPaper] = useState<Paper | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function fetchPaper() {
      try {
        const res = await fetch(`/api/papers/${paperId}`);
        const data = await res.json();
        if (data.success) {
          setPaper(data.data.paper);
          setComments(data.data.comments);
        }
      } catch (err) {
        console.error('Failed to fetch paper:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPaper();
  }, [paperId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/papers/${paperId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          is_anonymous: isAnonymous,
          parent_id: replyTo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewComment('');
        setReplyTo(null);
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const rootComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) => comments.filter((c) => c.parent_id === parentId);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#F3F4F6] rounded w-3/4" />
          <div className="h-4 bg-[#F3F4F6] rounded w-1/2" />
          <div className="h-32 bg-[#F3F4F6] rounded" />
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="font-serif text-2xl text-[#1E1E1E] mb-4">论文不存在</h1>
        <Link href="/" className="text-[#A51C30] hover:text-[#8C1829]">返回首页</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
        <Link href="/" className="hover:text-[#A51C30] transition-colors">首页</Link>
        <ChevronRight size={14} />
        <span className="text-[#1E1E1E]">论文详情</span>
      </nav>

      {/* Paper Info */}
      <article className="mb-12">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1E1E] leading-tight mb-4">
          {paper.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6B7280] mb-6">
          <span className="flex items-center gap-1">
            <User size={14} />
            {paper.authors}
          </span>
          {paper.journal && (
            <span className="font-medium text-[#1E1E1E]">{paper.journal}</span>
          )}
          {paper.publish_date && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {paper.publish_date}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-6 text-xs">
          {paper.doi && (
            <span className="px-2 py-1 bg-[#F3F4F6] text-[#4B5563] rounded-sm">
              DOI: {paper.doi}
            </span>
          )}
          {paper.pubmed_id && (
            <span className="px-2 py-1 bg-[#F3F4F6] text-[#4B5563] rounded-sm">
              {paper.pubmed_id}
            </span>
          )}
        </div>

        {paper.abstract && (
          <div className="border border-[#E5E7EB] rounded-sm p-6">
            <h2 className="font-serif text-sm font-semibold text-[#1E1E1E] mb-3 uppercase tracking-wider">摘要</h2>
            <p className="text-sm text-[#4B5563] leading-relaxed">{paper.abstract}</p>
          </div>
        )}
      </article>

      {/* Comments Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare size={20} className="text-[#A51C30]" />
          <h2 className="font-serif text-xl font-semibold text-[#1E1E1E]">
            评审评论 ({comments.length})
          </h2>
        </div>

        {/* Comment Form */}
        <div className="border border-[#E5E7EB] rounded-sm p-4 mb-8">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 text-xs text-[#6B7280]">
              <span>回复评论</span>
              <button onClick={() => setReplyTo(null)} className="text-[#A51C30] hover:underline">取消</button>
            </div>
          )}
          <form onSubmit={handleSubmitComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="发表您的评审意见..."
              className="w-full h-24 px-3 py-2 text-sm border border-[#E5E7EB] rounded-sm resize-none focus:outline-none focus:border-[#A51C30] transition-colors"
            />
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 text-xs text-[#6B7280]">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-[#E5E7EB] text-[#A51C30] focus:ring-[#A51C30]"
                />
                匿名评论
              </label>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="flex items-center gap-1 px-4 py-2 bg-[#A51C30] text-white text-sm font-medium rounded-sm hover:bg-[#8C1829] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} />
                {submitting ? '提交中...' : '提交评论'}
              </button>
            </div>
          </form>
          {submitSuccess && (
            <p className="mt-2 text-xs text-green-600">评论已提交，等待审核后显示。</p>
          )}
        </div>

        {/* Comment List */}
        <div className="space-y-4">
          {rootComments.length === 0 ? (
            <p className="text-sm text-[#6B7280] text-center py-8">暂无评论，成为第一个评审者。</p>
          ) : (
            rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={getReplies(comment.id)}
                onReply={(id) => setReplyTo(id)}
                formatDate={formatDate}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function CommentItem({
  comment,
  replies,
  onReply,
  formatDate,
}: {
  comment: Comment;
  replies: Comment[];
  onReply: (id: string) => void;
  formatDate: (d: string) => string;
}) {
  return (
    <div className="border border-[#E5E7EB] rounded-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <User size={12} />
          <span>{comment.is_anonymous ? '匿名学者' : '认证学者'}</span>
          <span>·</span>
          <span>{formatDate(comment.created_at)}</span>
        </div>
        <button
          onClick={() => onReply(comment.id)}
          className="text-xs text-[#A51C30] hover:text-[#8C1829] transition-colors"
        >
          回复
        </button>
      </div>
      <p className="text-sm text-[#4B5563] leading-relaxed">{comment.content}</p>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="mt-4 ml-4 pl-4 border-l-2 border-[#E5E7EB] space-y-3">
          {replies.map((reply) => (
            <div key={reply.id}>
              <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-1">
                <User size={12} />
                <span>{reply.is_anonymous ? '匿名学者' : '认证学者'}</span>
                <span>·</span>
                <span>{formatDate(reply.created_at)}</span>
              </div>
              <p className="text-sm text-[#4B5563] leading-relaxed">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

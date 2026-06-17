'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, User, Calendar, BookOpen, ExternalLink, Send, Reply } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  parent_id: string | null;
  user?: { display_name: string; username: string };
  replies?: Comment[];
}

interface Paper {
  id: string;
  title: string;
  authors: string;
  doi: string;
  pubmed_id: string;
  journal: string;
  publish_date: string;
  abstract: string;
  comment_count: number;
}

export default function PaperDetailPage() {
  const params = useParams();
  const paperId = params.id as string;
  const [paper, setPaper] = useState<Paper | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [user, setUser] = useState<{ display_name: string; username: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('pppr_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const res = await fetch(`/api/papers/${paperId}`);
        const data = await res.json();
        if (data.success) {
          setPaper(data.data.paper);
          setComments(data.data.comments || []);
        } else {
          setPaper(null);
        }
      } catch (error) {
        console.error('Failed to fetch paper:', error);
      } finally {
        setLoading(false);
      }
    };
    if (paperId) fetchPaper();
  }, [paperId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/papers/${paperId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, is_anonymous: isAnonymous }),
      });
      const data = await res.json();
      if (data.success) {
        setNewComment('');
        setIsAnonymous(false);
        alert('Comment submitted successfully! It will be visible after review.');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/papers/${paperId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent, is_anonymous: isAnonymous, parent_id: parentId }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyContent('');
        setReplyTo(null);
        alert('Reply submitted successfully! It will be visible after review.');
      }
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const buildTree = (comments: Comment[]): Comment[] => {
    const map = new Map<string, Comment>();
    const roots: Comment[] = [];
    comments.forEach((c) => map.set(c.id, { ...c, replies: [] }));
    comments.forEach((c) => {
      const node = map.get(c.id)!;
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id)!.replies!.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  };

  const getAuthorName = (comment: Comment): string => {
    if (comment.is_anonymous) return 'Anonymous Scholar';
    if (comment.user?.display_name) return comment.user.display_name;
    return 'Verified Scholar';
  };

  const CommentNode = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l border-[#E5E7EB]' : ''}`}>
      <div className="py-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-[#A51C30]/10 flex items-center justify-center">
            <User size={12} className="text-[#A51C30]" />
          </div>
          <span className="text-sm font-medium text-[#1E1E1E]">{getAuthorName(comment)}</span>
          <span className="text-xs text-[#6B7280]">{new Date(comment.created_at).toLocaleDateString('en-US')}</span>
        </div>
        <p className="text-sm text-[#374151] leading-relaxed ml-8">{comment.content}</p>
        {depth < 3 && (
          <button
            onClick={() => { setReplyTo(replyTo === comment.id ? null : comment.id); setReplyContent(''); }}
            className="ml-8 mt-2 text-xs text-[#6B7280] hover:text-[#A51C30] flex items-center gap-1"
          >
            <Reply size={12} /> Reply
          </button>
        )}
        {replyTo === comment.id && (
          <div className="ml-8 mt-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full p-3 border border-[#E5E7EB] rounded-sm text-sm resize-none focus:outline-none focus:border-[#A51C30] min-h-[80px]"
              rows={3}
            />
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-xs text-[#6B7280]">
                <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="rounded" />
                Anonymous
              </label>
              <div className="flex gap-2">
                <button onClick={() => setReplyTo(null)} className="px-3 py-1.5 text-xs text-[#6B7280] hover:text-[#1E1E1E]">Cancel</button>
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={submitting || !replyContent.trim()}
                  className="px-3 py-1.5 text-xs bg-[#A51C30] text-white rounded-sm hover:bg-[#8C1829] disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {comment.replies && comment.replies.map((reply) => (
        <CommentNode key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center">
        <p className="text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1E1E1E] font-serif text-xl mb-2">Paper Not Found</p>
          <Link href="/" className="text-sm text-[#A51C30] hover:text-[#8C1829]">Back to Home</Link>
        </div>
      </div>
    );
  }

  const commentTree = buildTree(comments);

  return (
    <div className="min-h-[calc(100vh-64px-200px)] py-8">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6B7280] mb-6">
          <Link href="/" className="hover:text-[#A51C30] flex items-center gap-1">
            <ArrowLeft size={14} /> Home
          </Link>
          <span>/</span>
          <span className="text-[#1E1E1E]">Paper Details</span>
        </nav>

        {/* Paper Info */}
        <article className="bg-white border border-[#E5E7EB] rounded-sm p-6 sm:p-8 mb-8">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1E1E] leading-tight mb-4">{paper.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6B7280] mb-6">
            <span className="flex items-center gap-1.5"><User size={14} />{paper.authors}</span>
            <span className="flex items-center gap-1.5"><BookOpen size={14} />{paper.journal}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} />{paper.publish_date}</span>
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#A51C30]/5 text-[#A51C30] text-xs rounded-sm">DOI: {paper.doi}</span>
            {paper.pubmed_id && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#A51C30]/5 text-[#A51C30] text-xs rounded-sm">PubMed: {paper.pubmed_id}</span>
            )}
          </div>
          <div className="border-t border-[#E5E7EB] pt-6">
            <h2 className="font-serif text-lg font-semibold text-[#1E1E1E] mb-3">Abstract</h2>
            <p className="text-sm text-[#374151] leading-relaxed">{paper.abstract}</p>
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-white border border-[#E5E7EB] rounded-sm p-6 sm:p-8">
          <h2 className="font-serif text-lg font-semibold text-[#1E1E1E] mb-6 flex items-center gap-2">
            <MessageSquare size={18} className="text-[#A51C30]" />
            Peer Review Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8 pb-8 border-b border-[#E5E7EB]">
            <h3 className="text-sm font-medium text-[#1E1E1E] mb-3">Share Your Review</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your analysis, questions, or concerns about this paper..."
              className="w-full p-4 border border-[#E5E7EB] rounded-sm text-sm resize-none focus:outline-none focus:border-[#A51C30] min-h-[120px]"
              rows={5}
            />
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 text-xs text-[#6B7280]">
                <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="rounded" />
                Post anonymously
              </label>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#A51C30] text-white text-sm rounded-sm hover:bg-[#8C1829] disabled:opacity-50 transition-colors"
              >
                <Send size={14} /> {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="divide-y divide-[#E5E7EB]">
            {commentTree.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#6B7280]">No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              commentTree.map((comment) => <CommentNode key={comment.id} comment={comment} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

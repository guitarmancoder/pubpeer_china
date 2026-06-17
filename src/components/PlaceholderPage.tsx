import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-16 text-center">
      <h1 className="font-serif text-3xl font-bold text-[#1E1E1E] mb-4">{title}</h1>
      <p className="text-sm text-[#6B7280] leading-relaxed mb-8 max-w-md mx-auto">
        {description}
      </p>
      <div className="inline-block border border-[#E5E7EB] rounded-sm px-6 py-3">
        <p className="text-sm text-[#9CA3AF]">此页面正在建设中，敬请期待</p>
      </div>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#A51C30] hover:text-[#8C1829] transition-colors"
        >
          <ArrowLeft size={16} />
          返回首页
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 mx-auto mb-6 bg-[#A51C30]/10 rounded-sm flex items-center justify-center">
          <span className="font-serif text-2xl font-bold text-[#A51C30]">P</span>
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#1E1E1E] mb-3">{title}</h1>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-6">{description}</p>
        <Link
          href="/"
          className="inline-block px-5 py-2 text-sm text-[#A51C30] border border-[#A51C30] rounded-sm hover:bg-[#A51C30] hover:text-white transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

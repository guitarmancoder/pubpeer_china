import Link from 'next/link';

export default function Footer() {
  const mainLinks = [
    { href: '/blog', label: '博客' },
    { href: '/journals', label: '期刊' },
    { href: '/institutions', label: '机构' },
    { href: '/about', label: '关于' },
    { href: '/extensions', label: '扩展插件' },
    { href: '/awards', label: '奖项' },
  ];

  const supportLinks = [
    { href: '/faq', label: '常见问题' },
    { href: '/privacy', label: '隐私政策' },
    { href: '/terms', label: '服务条款' },
    { href: '/feedback', label: '问题反馈' },
    { href: '/contact', label: '联系我们' },
  ];

  return (
    <footer className="bg-[#1E1E1E] text-white mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#A51C30] rounded-sm flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">P</span>
              </div>
              <span className="font-serif text-lg font-semibold">学术同行评审社区</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              致力于推动学术透明与科研诚信，为学者提供开放、公正的论文评审交流平台。
            </p>
          </div>

          {/* Main Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">平台</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">支持</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/donate"
                className="text-sm text-[#A51C30] hover:text-[#C4344A] font-medium transition-colors duration-200"
              >
                捐款
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} 学术同行评审社区 (PPPR). 保留所有权利.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                隐私
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                条款
              </Link>
              <Link href="/contact" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                联系
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

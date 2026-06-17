import Link from 'next/link';

const quickLinks = [
  { href: '/search', label: 'Search Papers' },
  { href: '/browse', label: 'Browse' },
  { href: '/donate', label: 'Donate' },
  { href: '/login', label: 'Login' },
];

const communityLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/journals', label: 'Journals' },
  { href: '/institutions', label: 'Institutions' },
  { href: '/about', label: 'About' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/feedback', label: 'Feedback' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#A51C30] rounded-sm flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">P</span>
              </div>
              <span className="font-serif text-lg font-semibold">PPPR</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Post-Publication Peer Review. An open platform dedicated to promoting academic transparency and research integrity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-serif text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">Community</h3>
            <ul className="space-y-2.5">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="font-serif text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wider">Legal & Support</h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} PPPR - Post-Publication Peer Review. All rights reserved.
          </p>
          <Link
            href="/donate"
            className="text-xs text-[#A51C30] hover:text-[#8C1829] font-medium transition-colors"
          >
            Support Us
          </Link>
        </div>
      </div>
    </footer>
  );
}

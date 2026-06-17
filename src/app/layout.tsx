import type { Metadata } from 'next';
import { Noto_Serif_SC } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PPPR - Post-Publication Peer Review',
    template: '%s | PPPR',
  },
  description:
    'PPPR is an open post-publication peer review platform dedicated to promoting academic transparency and research integrity.',
  keywords: [
    'peer review',
    'post-publication review',
    'academic review',
    'research integrity',
    'academic transparency',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={notoSerifSC.variable}>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

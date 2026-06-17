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
    default: '学术同行评审社区 - 开放、公正的论文评审平台',
    template: '%s | 学术同行评审社区',
  },
  description:
    '学术同行评审社区(PPPR)是一个开放的出版后同行评审平台，致力于推动学术透明与科研诚信。',
  keywords: [
    '同行评审',
    '学术评审',
    '出版后评审',
    '论文评审',
    '科研诚信',
    '学术透明',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={notoSerifSC.variable}>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import './globals.css';
import './mobile-fix.css';

export const metadata: Metadata = {
  title: 'Vouch Demo — See What Needs Attention in Your Business',
  description: 'Upload the business data you already have and see what is stuck, what is changing and what you should act on next.',
  openGraph: {
    title: 'Vouch Demo — See What Needs Attention in Your Business',
    description: 'A visual, adaptive decision view shaped by your data and the business question you are trying to answer.',
    url: 'https://demo.yourvouch.com',
    siteName: 'Vouch Demo',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

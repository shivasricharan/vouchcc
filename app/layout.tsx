import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vouch Demo — Business Decision Intelligence',
  description: 'See how Vouch detects business priorities, recommends actions, tracks execution and measures what changes.',
  openGraph: {
    title: 'Vouch Demo — Business Decision Intelligence',
    description: 'See how Vouch detects business priorities, recommends actions, tracks execution and measures what changes.',
    url: 'https://demo.yourvouch.com',
    siteName: 'Vouch Demo',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}

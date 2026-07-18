import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vouch Demo — Know What Needs Attention',
  description: 'Upload business data and see which opportunities need attention, why they matter, and what to do next.',
  openGraph: {
    title: 'Vouch Demo — Know What Needs Attention',
    description: 'Upload business data and see which opportunities need attention, why they matter, and what to do next.',
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

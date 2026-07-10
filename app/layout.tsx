import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vouch Demo — Turn CSV Data into Business Insights',
  description: 'Try the Vouch live demo to analyse leads, sales, pipeline, follow-ups, and revenue opportunities from a CSV. Explore the open-source Vouch Starter Kit on GitHub.',
  openGraph: {
    title: 'Vouch Demo — Turn CSV Data into Business Insights',
    description: 'Upload a CSV and discover missed revenue opportunities, follow-up gaps, and actionable insights in minutes.',
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

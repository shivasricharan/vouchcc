import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vouch Opportunity Analyzer | Upload Your Data',
  description: 'Upload your existing business data and discover missed revenue opportunities, follow-up gaps, customer journey signals and actionable insights in minutes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vouch Command Center — Know What Happens Between Inquiry and Conversion',
  description: 'Upload any lead, sales, or customer journey CSV and turn it into a clean founder dashboard with funnel analytics, stuck leads, team workload, and smart insights.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}

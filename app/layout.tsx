import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vouch Insights | Revenue Leak Analysis',
  description: 'Upload a CSV or explore sample business data to find revenue leaks, stuck leads, missed follow-ups, and conversion opportunities.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}

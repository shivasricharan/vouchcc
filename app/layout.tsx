import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DzineHome — Vouch Command Center',
  description: 'DzineHome Lead Journey Dashboard — powered by Vouch.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}

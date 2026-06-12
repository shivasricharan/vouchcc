import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vouch CC — Stop Losing Leads in WhatsApp',
  description:
    'Vouch helps service businesses capture, qualify, track, and follow up on every enquiry before it goes cold. Sales forensics and lead intelligence for interior designers, architects, and consultants.',
  keywords:
    'lead management, WhatsApp leads, interior design CRM, lead tracking, follow up, sales pipeline, lead intelligence',
  authors: [{ name: 'Vouch CC' }],
  openGraph: {
    title: 'Vouch CC — Stop Losing Leads in WhatsApp',
    description:
      'Vouch turns scattered enquiries into a clear lead pipeline with follow-up intelligence, drop-off visibility, and owner-level control.',
    type: 'website',
    siteName: 'Vouch CC',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vouch CC — Stop Losing Leads in WhatsApp',
    description:
      'Vouch turns scattered enquiries into a clear lead pipeline with follow-up intelligence, drop-off visibility, and owner-level control.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vouch Insights | ViralReels Sample Analysis',
  description: 'Sample analysis showing where ViralReels may be losing users between interest, activation, trial, and paid conversion.',
};

export default function ViralReelsLayout({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 overflow-y-auto">{children}</div>;
}

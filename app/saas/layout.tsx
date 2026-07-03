import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vouch Opportunity Analyzer for SaaS | Upload SaaS Data',
  description: 'Discover where trials, activations and conversions lose momentum before revenue is affected.',
};

export default function SaaSLayout({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 overflow-y-auto">{children}</div>;
}

'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

export default function KPICards() {
  const { stats, leads } = useDashboard();

  const derived = useMemo(() => {
    const highIntent = leads.filter(l => l.probability >= 60).length;
    const hasValues = leads.some(l => l.value > 0);
    const score = stats.total > 0
      ? Math.max(0, Math.min(100, Math.round(((stats.total - stats.stuckCount) / stats.total) * 100)))
      : 0;
    return { highIntent, hasValues, score };
  }, [leads, stats]);

  const scoreColor = derived.score >= 70 ? 'text-green-500' : derived.score >= 40 ? 'text-amber-500' : 'text-red-500';
  const scoreDot = derived.score >= 70 ? 'bg-green-400' : derived.score >= 40 ? 'bg-amber-400' : 'bg-red-400';

  const kpis = [
    { label: 'Opportunity Score', value: `${derived.score}/100`, dot: scoreDot, text: scoreColor },
    {
      label: derived.hasValues ? 'Missed Revenue Opportunities' : 'Missed Opportunities',
      value: derived.hasValues ? `₹${stats.atRiskValue}L` : String(stats.stuckCount),
      dot: 'bg-red-400',
      text: 'text-red-500',
    },
    { label: 'Follow-up Gaps',         value: String(stats.stuckCount),    dot: 'bg-orange-400', text: 'text-orange-500' },
    { label: 'Customer Journey Signals', value: String(derived.highIntent), dot: 'bg-blue-400',  text: 'text-blue-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-th-surface border border-th-border rounded-xl p-4 hover:border-blue-500/20 transition-colors"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className={`w-2 h-2 rounded-full ${kpi.dot} shrink-0`} />
            <span className="text-th-muted text-xs font-medium">{kpi.label}</span>
          </div>
          <div className={`text-2xl font-black ${kpi.text} leading-none`}>{kpi.value}</div>
        </div>
      ))}
    </div>
  );
}

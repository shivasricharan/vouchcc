'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

export default function KPICards() {
  const { stats, leads } = useDashboard();

  const derived = useMemo(() => {
    const highIntent = leads.filter(l => l.probability >= 60).length;
    const hasValues = leads.some(l => l.value > 0);
    return { highIntent, hasValues };
  }, [leads]);

  const kpis = [
    { label: 'Total Leads',       value: String(stats.total),      dot: 'bg-blue-400',   text: 'text-blue-500' },
    { label: 'High-Intent Leads', value: String(derived.highIntent), dot: 'bg-green-400',  text: 'text-green-500' },
    { label: 'Stuck Leads',       value: String(stats.stuckCount),  dot: 'bg-orange-400', text: 'text-orange-500' },
    {
      label: derived.hasValues ? 'Revenue at Risk' : 'Opportunities at Risk',
      value: derived.hasValues ? `₹${stats.atRiskValue}L` : String(stats.stuckCount),
      dot: 'bg-red-400',
      text: 'text-red-500',
    },
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

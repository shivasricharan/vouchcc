'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

function fmt(v: number): string {
  if (v >= 100) return `₹${(v / 100).toFixed(1)}Cr`;
  return `₹${Math.round(v)}L`;
}

export default function KPICards() {
  const { stats } = useDashboard();

  const kpis = useMemo(() => [
    {
      label: 'Total Opportunities',
      value: String(stats.activeFunnelCount || stats.total),
      sub: 'active in pipeline',
      dot: 'bg-blue-400',
      text: 'text-blue-500',
    },
    {
      label: 'Pipeline Value',
      value: stats.hasValues ? fmt(stats.pipelineValue) : String(stats.activeFunnelCount),
      sub: stats.hasValues ? 'estimated value' : 'active leads',
      dot: 'bg-green-400',
      text: 'text-green-500',
    },
    {
      label: 'Need Follow-up',
      value: String(stats.followUpCount),
      sub: '3+ days without activity',
      dot: 'bg-amber-400',
      text: 'text-amber-500',
    },
    {
      label: 'Revenue at Risk',
      value: stats.hasValues && stats.atRiskValue > 0 ? fmt(stats.atRiskValue) : String(stats.stuckCount),
      sub: stats.hasValues && stats.atRiskValue > 0 ? 'stuck 7+ days' : 'stuck 7+ days',
      dot: 'bg-red-400',
      text: 'text-red-500',
    },
  ], [stats]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-th-surface border border-th-border rounded-xl p-4 hover:border-blue-500/20 transition-colors"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className={`w-2 h-2 rounded-full ${kpi.dot} shrink-0`} />
            <span className="text-th-muted text-xs font-medium leading-tight">{kpi.label}</span>
          </div>
          <div className={`text-2xl font-black ${kpi.text} leading-none mb-1`}>{kpi.value}</div>
          <div className="text-th-faint text-[10px]">{kpi.sub}</div>
        </div>
      ))}
    </div>
  );
}

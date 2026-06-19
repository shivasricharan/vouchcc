'use client';

import { useDashboard } from '@/context/DashboardContext';

export default function KPICards() {
  const { stats } = useDashboard();
  const { stageCounts, pipelineValue, stuckCount, activeFunnelCount, followUpCount } = stats;

  const kpis = [
    { label: 'Total Leads',      value: String(stats.total),                        sub: 'All time',               dot: 'bg-blue-400',    text: 'text-blue-500' },
    { label: 'Active in Funnel', value: String(activeFunnelCount),                  sub: 'In pipeline',            dot: 'bg-blue-500',    text: 'text-blue-500' },
    { label: 'Stuck Leads',      value: String(stuckCount),                         sub: '≥7 days no movement',    dot: 'bg-orange-400',  text: 'text-orange-500' },
    { label: 'Follow-ups Due',   value: String(followUpCount),                      sub: '≥3 days since activity', dot: 'bg-amber-400',   text: 'text-amber-500' },
    { label: 'Quotations',       value: String(stageCounts['Quotation Sent'] || stageCounts['Quote Sent'] || 0), sub: 'Awaiting decision', dot: 'bg-amber-500', text: 'text-amber-500' },
    { label: 'Negotiations',     value: String(stageCounts['Negotiation'] || 0),    sub: 'Close to conversion',    dot: 'bg-orange-500',  text: 'text-orange-500' },
    { label: 'Pipeline Value',   value: `₹${(pipelineValue / 100).toFixed(1)} Cr`, sub: 'Active pipeline',        dot: 'bg-green-400',   text: 'text-green-500' },
    { label: 'Lost',             value: String(stageCounts['Lost'] || stageCounts['Closed Lost'] || 0), sub: 'This period',  dot: 'bg-red-400', text: 'text-red-500' },
    { label: 'At-Risk Value',    value: `₹${stats.atRiskValue}L`,                  sub: 'Stuck high-value',       dot: 'bg-red-500',     text: 'text-red-500' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-th-surface border border-th-border rounded-xl p-3 hover:border-blue-500/30 transition-colors"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full ${kpi.dot} shrink-0`} />
            <span className="text-th-muted text-[10px] font-medium leading-tight">{kpi.label}</span>
          </div>
          <div className={`text-xl font-black ${kpi.text} mb-0.5 leading-none`}>{kpi.value}</div>
          <div className="text-th-faint text-[10px] leading-tight">{kpi.sub}</div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useDashboard } from '@/context/DashboardContext';

export default function KPICards() {
  const { stats } = useDashboard();
  const { stageCounts, pipelineValue, stuckCount, activeFunnelCount } = stats;

  const kpis = [
    { label: 'Total Leads',      value: String(stats.total),                              sub: 'All time',                 dot: 'bg-blue-400',    text: 'text-white' },
    { label: 'Active in Funnel', value: String(activeFunnelCount),                        sub: 'New → Negotiation',        dot: 'bg-blue-500',    text: 'text-blue-300' },
    { label: 'Stuck Leads',      value: String(stuckCount),                               sub: '≥7 days no movement',      dot: 'bg-orange-400',  text: 'text-orange-300' },
    { label: 'Site Visits',      value: String(stageCounts['Site Visit'] || 0),           sub: 'Scheduled / done',         dot: 'bg-purple-400',  text: 'text-purple-300' },
    { label: 'Quotations Sent',  value: String(stageCounts['Quotation Sent'] || 0),       sub: 'Awaiting decision',        dot: 'bg-amber-400',   text: 'text-amber-300' },
    { label: 'Negotiations',     value: String(stageCounts['Negotiation'] || 0),          sub: 'In scope / price talk',    dot: 'bg-orange-500',  text: 'text-orange-300' },
    { label: 'Execution',        value: String(stageCounts['Execution'] || 0),            sub: 'Active projects',          dot: 'bg-emerald-400', text: 'text-emerald-300' },
    { label: 'Lost Leads',       value: String(stageCounts['Lost'] || 0),                 sub: 'This period',              dot: 'bg-red-400',     text: 'text-red-300' },
    { label: 'Pipeline Value',   value: `₹${(pipelineValue / 100).toFixed(1)} Cr`,       sub: 'Proposal → Negotiation',   dot: 'bg-green-400',   text: 'text-green-300' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-[#0d1530] border border-white/6 rounded-xl p-3 hover:border-white/12 transition-colors"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full ${kpi.dot} shrink-0`} />
            <span className="text-slate-500 text-[10px] font-medium leading-tight">{kpi.label}</span>
          </div>
          <div className={`text-xl font-black ${kpi.text} mb-0.5 leading-none`}>{kpi.value}</div>
          <div className="text-slate-600 text-[10px] leading-tight">{kpi.sub}</div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

export default function KPICards() {
  const { stats, leads } = useDashboard();

  const derived = useMemo(() => {
    const highIntent = leads.filter(l => l.probability >= 60).length;
    const delayedFollowups = leads.filter(l =>
      l.daysInStage >= 3 &&
      !['Lost', 'Completed', 'Closed Won', 'Closed Lost', 'Active Customer', 'Enrolled', 'Registered'].some(s => l.stage.includes(s))
    ).length;
    const quotePending = leads.filter(l =>
      ['Quotation Sent', 'Quote Sent', 'Proposal Sent', 'Contract Sent'].some(s => l.stage.includes(s))
    ).length;
    const topSource = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1])[0];
    const hasValues = leads.some(l => l.value > 0);

    const fastestStage = stats.byStage
      .filter(s => !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(t => s.stage.includes(t)))
      .reduce((best, s) => {
        const stageLeads = leads.filter(l => l.stage === s.stage);
        const avgDays = stageLeads.length > 0 ? stageLeads.reduce((sum, l) => sum + l.daysInStage, 0) / stageLeads.length : 999;
        if (avgDays < best.avgDays && stageLeads.length >= 2) return { stage: s.stage, avgDays };
        return best;
      }, { stage: '—', avgDays: 999 });

    return { highIntent, delayedFollowups, quotePending, topSource, hasValues, fastestStage };
  }, [stats, leads]);

  const kpis = [
    { label: 'Total Leads',         value: String(stats.total),           dot: 'bg-blue-400',   text: 'text-blue-500' },
    { label: 'High-Intent Leads',   value: String(derived.highIntent),    dot: 'bg-green-400',  text: 'text-green-500' },
    { label: 'Stuck Leads',         value: String(stats.stuckCount),      dot: 'bg-orange-400', text: 'text-orange-500' },
    { label: 'Delayed Follow-ups',  value: String(derived.delayedFollowups), dot: 'bg-amber-400', text: 'text-amber-500' },
    { label: 'Quote / Proposal Pending', value: String(derived.quotePending), dot: 'bg-violet-400', text: 'text-violet-500' },
    {
      label: derived.hasValues ? 'Est. Revenue at Risk' : 'Opportunities at Risk',
      value: derived.hasValues ? `₹${stats.atRiskValue}L` : String(stats.stuckCount),
      dot: 'bg-red-400',
      text: 'text-red-500',
    },
    { label: 'Best Lead Source',    value: derived.topSource ? derived.topSource[0] : '—', dot: 'bg-cyan-400', text: 'text-cyan-500' },
    { label: 'Fastest Stage',       value: derived.fastestStage.stage !== '—' ? derived.fastestStage.stage : '—', dot: 'bg-emerald-400', text: 'text-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-th-surface border border-th-border rounded-xl p-3 hover:border-blue-500/20 transition-colors"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full ${kpi.dot} shrink-0`} />
            <span className="text-th-muted text-[10px] font-medium leading-tight">{kpi.label}</span>
          </div>
          <div className={`text-lg font-black ${kpi.text} leading-none truncate`}>{kpi.value}</div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Lightbulb } from 'lucide-react';

const typeStyles: Record<string, string> = {
  critical: 'border-red-500/20 bg-red-500/5',
  warning:  'border-orange-500/20 bg-orange-500/5',
  insight:  'border-blue-500/15 bg-blue-500/5',
  positive: 'border-green-500/15 bg-green-500/5',
};

export default function AIInsights() {
  const { stats, leads } = useDashboard();

  const insights = useMemo(() => {
    const topSource = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1])[0];
    const topOwner = Object.entries(stats.teamCounts).filter(([k]) => k !== 'Unassigned').sort((a, b) => b[1] - a[1])[0];
    const unassigned = stats.teamCounts['Unassigned'] || 0;

    const stuckByStage: Record<string, number> = {};
    for (const l of leads) {
      if (l.daysInStage >= 7 && !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s))) {
        stuckByStage[l.stage] = (stuckByStage[l.stage] || 0) + 1;
      }
    }
    const biggestBottleneck = Object.entries(stuckByStage).sort((a, b) => b[1] - a[1])[0];

    const list = [];

    if (biggestBottleneck && biggestBottleneck[1] >= 2) {
      list.push({ type: 'warning', title: `${biggestBottleneck[0]} is your biggest bottleneck`, body: `${biggestBottleneck[1]} leads stuck ≥7 days. At-risk value: ₹${stats.atRiskValue}L. Direct action could unlock these.` });
    }

    if (topSource && topSource[1] >= 3) {
      const pct = Math.round((topSource[1] / stats.total) * 100);
      list.push({ type: 'critical', title: `${topSource[0]} is your top source (${pct}%)`, body: `${topSource[1]} leads via ${topSource[0]}. Invest more in high-converting channels and reduce response time for inbound leads.` });
    }

    if (unassigned > 0) {
      list.push({ type: 'insight', title: `${unassigned} leads are unassigned`, body: `Unassigned leads go cold fast. Assign owners immediately to prevent revenue leaks.` });
    }

    if (topOwner && topOwner[1] >= 10) {
      list.push({ type: 'positive', title: `${topOwner[0]} has highest load (${topOwner[1]} leads)`, body: `Consider redistributing to balance team workload and improve follow-up velocity.` });
    }

    const stuckQuotations = leads.filter(l => (l.stage.toLowerCase().includes('quotation') || l.stage.toLowerCase().includes('quote')) && l.daysInStage >= 5);
    if (stuckQuotations.length >= 2) {
      const qVal = stuckQuotations.reduce((s, l) => s + l.value, 0);
      list.push({ type: 'insight', title: `${stuckQuotations.length} quotes with no response in >5 days`, body: `₹${qVal}L pending. Follow up with a call + revised quote within 48 hours.` });
    }

    if (stats.stuckCount > 0) {
      list.push({ type: 'warning', title: `${stats.stuckCount} leads need immediate action`, body: `Review the Stuck Leads table daily. Each stuck lead should have a next action assigned before end of day.` });
    }

    if (list.length === 0) {
      list.push({ type: 'insight', title: 'Upload your data for personalised insights', body: 'Click "Upload CSV" to load your lead data. Vouch will analyse patterns and show actionable recommendations.' });
    }

    return list;
  }, [stats, leads]);

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} className="text-amber-500" />
        <div>
          <div className="text-th-heading font-semibold text-sm">Smart Insights</div>
          <div className="text-th-muted text-xs">Pattern analysis across {stats.total} leads</div>
        </div>
      </div>

      <div className="space-y-2.5">
        {insights.map((insight, i) => (
          <div key={i} className={`border rounded-lg px-3.5 py-2.5 ${typeStyles[insight.type]}`}>
            <div className="text-th-heading text-xs font-semibold mb-1">{insight.title}</div>
            <div className="text-th-body text-[11px] leading-relaxed">{insight.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

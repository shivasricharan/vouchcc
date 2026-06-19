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
    const secondSource = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1])[1];
    const topOwner = Object.entries(stats.teamCounts).filter(([k]) => k !== 'Unassigned').sort((a, b) => b[1] - a[1])[0];
    const unassigned = stats.teamCounts['Unassigned'] || 0;
    const hasValues = leads.some(l => l.value > 0);

    const stuckByStage: Record<string, number> = {};
    for (const l of leads) {
      if (l.daysInStage >= 7 && !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s))) {
        stuckByStage[l.stage] = (stuckByStage[l.stage] || 0) + 1;
      }
    }

    const proposalNoFollowup = leads.filter(l =>
      ['Proposal Sent', 'Quotation Sent', 'Quote Sent', 'Contract Sent'].some(s => l.stage.includes(s)) && l.daysInStage >= 2
    );
    const highIntentNoFollowup = leads.filter(l => l.probability >= 60 && l.daysInStage >= 3 && !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s)));
    const demoCompletedHighConv = leads.filter(l => l.stage === 'Demo Completed').length;
    const highValueStuck = leads.filter(l => l.value >= 40 && l.daysInStage >= 7 && !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s)));

    const list: { type: string; body: string }[] = [];

    if (proposalNoFollowup.length > 0) {
      list.push({ type: 'critical', body: `${proposalNoFollowup.length} leads requested pricing but did not receive follow-up within 48 hours.` });
    }

    if (topSource && secondSource) {
      const topHighIntent = leads.filter(l => l.source === topSource[0] && l.probability >= 60).length;
      const secondHighIntent = leads.filter(l => l.source === secondSource[0] && l.probability >= 60).length;
      if (topSource[1] > secondSource[1] && secondHighIntent > topHighIntent) {
        list.push({ type: 'insight', body: `${topSource[0]} generated more leads, but ${secondSource[0]} produced higher-intent prospects.` });
      } else if (topSource[1] >= 3) {
        list.push({ type: 'insight', body: `${topSource[0]} is your best source with ${topSource[1]} leads (${Math.round((topSource[1] / stats.total) * 100)}% of pipeline).` });
      }
    }

    if (demoCompletedHighConv > 0) {
      list.push({ type: 'positive', body: `Demo completed leads have the highest conversion probability.` });
    }

    if (highValueStuck.length > 0) {
      list.push({ type: 'warning', body: `${highValueStuck.length} high-value leads are stuck after proposal stage.` });
    }

    if (stats.stuckCount > 0) {
      list.push({ type: 'warning', body: `Follow-up delays are the biggest visible leak this week. ${stats.stuckCount} leads stuck ≥7 days.` });
    }

    if (highIntentNoFollowup.length > 0) {
      list.push({ type: 'critical', body: `${highIntentNoFollowup.length} leads with high intent have no recent follow-up activity.` });
    }

    const proposalStage = Object.entries(stuckByStage).filter(([s]) =>
      ['Proposal Sent', 'Quotation Sent', 'Quote Sent'].some(p => s.includes(p))
    );
    if (proposalStage.length > 0) {
      list.push({ type: 'warning', body: `Proposal-stage leads need immediate review.` });
    }

    if (unassigned > 0) {
      list.push({ type: 'critical', body: `${unassigned} leads are unassigned — assign ownership to prevent them from going cold.` });
    }

    if (topOwner && topOwner[1] >= 10) {
      list.push({ type: 'insight', body: `${topOwner[0]} has the highest load (${topOwner[1]} leads). Consider redistributing.` });
    }

    if (list.length === 0) {
      list.push({ type: 'positive', body: 'Upload your data to see personalised revenue insights and recommendations.' });
    }

    return list.slice(0, 6);
  }, [stats, leads]);

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} className="text-amber-500" />
        <div>
          <div className="text-th-heading font-semibold text-sm">Revenue Insights</div>
          <div className="text-th-muted text-xs">Analysis of {stats.total} leads</div>
        </div>
      </div>

      <div className="space-y-2.5">
        {insights.map((insight, i) => (
          <div key={i} className={`border rounded-lg px-3.5 py-2.5 ${typeStyles[insight.type]}`}>
            <div className="text-th-body text-xs leading-relaxed">{insight.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

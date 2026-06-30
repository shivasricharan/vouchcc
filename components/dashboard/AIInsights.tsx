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
    const unassigned = stats.teamCounts['Unassigned'] || 0;

    const proposalNoFollowup = leads.filter(l =>
      ['Proposal Sent', 'Quotation Sent', 'Quote Sent', 'Contract Sent'].some(s => l.stage.includes(s)) && l.daysInStage >= 2
    );
    const highIntentNoFollowup = leads.filter(l => l.probability >= 60 && l.daysInStage >= 3 && !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s)));
    const highValueStuck = leads.filter(l => l.value >= 40 && l.daysInStage >= 7 && !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s)));

    const list: { type: string; body: string }[] = [];

    if (proposalNoFollowup.length > 0) {
      list.push({ type: 'critical', body: `${proposalNoFollowup.length} leads requested pricing but did not receive follow-up within 48 hours.` });
    }

    if (highIntentNoFollowup.length > 0) {
      list.push({ type: 'critical', body: `${highIntentNoFollowup.length} leads with high intent have no recent follow-up activity.` });
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

    if (highValueStuck.length > 0) {
      list.push({ type: 'warning', body: `${highValueStuck.length} high-value leads are stuck after proposal stage.` });
    }

    if (stats.stuckCount > 0) {
      list.push({ type: 'warning', body: `${stats.stuckCount} leads stuck for 7+ days — follow-up delays are the biggest missed opportunity.` });
    }

    if (unassigned > 0) {
      list.push({ type: 'critical', body: `${unassigned} leads are unassigned — assign ownership to prevent them from going cold.` });
    }

    if (list.length === 0) {
      list.push({ type: 'positive', body: 'Upload your data to see personalised opportunity insights.' });
    }

    return list.slice(0, 5);
  }, [stats, leads]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Lightbulb size={18} className="text-amber-500" />
        <h2 className="text-th-heading font-bold text-lg">Vouch Insights</h2>
        <span className="text-th-muted text-xs ml-1">{stats.total} leads analysed</span>
      </div>
      <p className="text-th-muted text-xs mb-4">
        See missed opportunities, follow-up gaps and customer journey signals hidden in your data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight, i) => (
          <div key={i} className={`border rounded-xl px-4 py-3 ${typeStyles[insight.type]}`}>
            <div className="text-th-body text-sm leading-relaxed">{insight.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

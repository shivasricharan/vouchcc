'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface Insight {
  type: 'critical' | 'warning' | 'insight' | 'positive';
  what: string;
  why: string;
  action: string;
}

const typeStyles: Record<string, { card: string; dot: string }> = {
  critical: { card: 'border-red-500/20 bg-red-500/5',    dot: 'bg-red-400'   },
  warning:  { card: 'border-orange-500/20 bg-orange-500/5', dot: 'bg-orange-400' },
  insight:  { card: 'border-blue-500/15 bg-blue-500/5',  dot: 'bg-blue-400'  },
  positive: { card: 'border-green-500/15 bg-green-500/5', dot: 'bg-green-400' },
};

export default function AIInsights() {
  const { stats, leads } = useDashboard();

  const insights = useMemo((): Insight[] => {
    const topSource = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1])[0];
    const secondSource = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1])[1];
    const unassigned = stats.teamCounts['Unassigned'] || 0;

    const proposalNoFollowup = leads.filter(l =>
      ['Proposal Sent', 'Quotation Sent', 'Quote Sent', 'Contract Sent'].some(s => l.stage.includes(s)) &&
      l.daysInStage >= 2
    );
    const highIntentNoFollowup = leads.filter(l =>
      l.probability >= 60 && l.daysInStage >= 3 &&
      !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s))
    );
    const highValueStuck = leads.filter(l =>
      l.value >= 40 && l.daysInStage >= 7 &&
      !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s))
    );

    const list: Insight[] = [];

    if (proposalNoFollowup.length > 0) {
      const val = highValueStuck.filter(l => proposalNoFollowup.some(p => p.id === l.id)).reduce((s, l) => s + l.value, 0);
      list.push({
        type: 'critical',
        what: `${proposalNoFollowup.length} leads received a proposal but no follow-up within 48 hours.`,
        why: 'Proposals go cold quickly. Momentum drops and competitors fill the gap.',
        action: `Follow up today with ${proposalNoFollowup.length === 1 ? 'this lead' : 'each pending quote'}${val > 0 ? ` — ₹${Math.round(val)}L at stake` : ''}.`,
      });
    }

    if (highIntentNoFollowup.length > 0) {
      list.push({
        type: 'critical',
        what: `${highIntentNoFollowup.length} high-intent ${highIntentNoFollowup.length === 1 ? 'lead has' : 'leads have'} had no recent follow-up.`,
        why: 'Ready-to-buy leads don\'t wait — they move to the next option within days.',
        action: `Call or message the top ${Math.min(3, highIntentNoFollowup.length)} this afternoon.`,
      });
    }

    if (topSource && secondSource) {
      const topHighIntent = leads.filter(l => l.source === topSource[0] && l.probability >= 60).length;
      const secondHighIntent = leads.filter(l => l.source === secondSource[0] && l.probability >= 60).length;
      if (topSource[1] > secondSource[1] && secondHighIntent > topHighIntent) {
        list.push({
          type: 'insight',
          what: `${topSource[0]} generates the most leads, but ${secondSource[0]} produces more ready-to-buy prospects.`,
          why: 'Volume and quality are different metrics. Optimising only for volume leaves revenue on the table.',
          action: `Increase focus on ${secondSource[0]} — fewer leads, higher conversion potential.`,
        });
      } else if (topSource[1] >= 3) {
        list.push({
          type: 'insight',
          what: `${topSource[0]} is your top source with ${topSource[1]} leads (${Math.round((topSource[1] / stats.total) * 100)}% of your pipeline).`,
          why: 'Knowing your strongest channel helps you invest where it works.',
          action: 'Double down on this source before testing new channels.',
        });
      }
    }

    if (highValueStuck.length > 0) {
      const stuckVal = highValueStuck.reduce((s, l) => s + l.value, 0);
      list.push({
        type: 'warning',
        what: `${highValueStuck.length} high-value ${highValueStuck.length === 1 ? 'deal is' : 'deals are'} stuck after the proposal stage.`,
        why: `₹${Math.round(stuckVal)}L in potential revenue has stalled — every extra day reduces the chance of closing.`,
        action: 'Schedule a review call for each stalled deal this week.',
      });
    }

    if (stats.stuckCount > 0 && !list.some(i => i.type === 'warning')) {
      list.push({
        type: 'warning',
        what: `${stats.stuckCount} leads have been stuck for 7 or more days.`,
        why: 'Delays at mid-funnel stages are the most common cause of silent revenue loss.',
        action: 'Assign a next step to each stuck lead and update the stage today.',
      });
    }

    if (unassigned > 0) {
      list.push({
        type: 'critical',
        what: `${unassigned} ${unassigned === 1 ? 'lead has' : 'leads have'} no owner assigned.`,
        why: 'Unassigned leads receive no follow-up. They go cold within 48 hours.',
        action: 'Assign each lead to a team member right now.',
      });
    }

    if (list.length === 0) {
      list.push({
        type: 'positive',
        what: 'Your pipeline looks healthy.',
        why: 'No critical follow-up gaps or stuck leads were detected.',
        action: 'Keep follow-up intervals under 3 days to maintain momentum.',
      });
    }

    return list.slice(0, 5);
  }, [stats, leads]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Lightbulb size={17} className="text-amber-500" />
        <h2 className="text-th-heading font-bold text-base">Vouch Insights</h2>
        <span className="text-th-muted text-xs ml-1">{stats.total} leads analysed</span>
      </div>
      <p className="text-th-muted text-xs mb-4">
        Patterns in your data that are silently affecting revenue.
      </p>

      <div className="space-y-3">
        {insights.map((insight, i) => {
          const s = typeStyles[insight.type];
          return (
            <div key={i} className={`border rounded-xl p-4 ${s.card}`}>
              <div className="flex items-start gap-2.5 mb-1.5">
                <div className={`w-2 h-2 rounded-full mt-[5px] shrink-0 ${s.dot}`} />
                <p className="text-th-heading text-sm font-semibold leading-snug">{insight.what}</p>
              </div>
              <p className="text-th-muted text-xs leading-relaxed mb-3 pl-[18px]">{insight.why}</p>
              <div className="pl-[18px] flex items-center gap-1.5 text-blue-500 text-xs font-medium">
                <ArrowRight size={11} className="shrink-0" />
                <span>{insight.action}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

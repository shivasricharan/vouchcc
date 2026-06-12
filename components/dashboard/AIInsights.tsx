'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

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
    const topOwner = Object.entries(stats.teamCounts)
      .filter(([k]) => k !== 'Unassigned')
      .sort((a, b) => b[1] - a[1])[0];
    const unassigned = stats.teamCounts['Unassigned'] || 0;
    const negotiationStuck = leads.filter((l) => l.stage === 'Negotiation' && l.daysInStage >= 7).length;
    const referralLeads = leads.filter((l) => l.source === 'Referral');
    const referralContacted = referralLeads.filter((l) => l.daysInStage <= 2).length;
    const completedReferral = leads.filter((l) => l.stage === 'Completed' && l.source === 'Referral').length;

    const list = [];

    if (negotiationStuck >= 2) {
      list.push({
        type: 'warning', icon: '⚠️',
        title: 'Negotiation stage is your biggest bottleneck',
        body: `${negotiationStuck} of ${stats.stageCounts['Negotiation'] || 0} leads in Negotiation have been stuck for 7+ days. Total at-risk value: ₹${stats.atRiskValue}L. Direct founder conversations could unlock these.`,
      });
    }

    if (topSource && topSource[1] >= 5) {
      const contactRate = Math.round((referralContacted / Math.max(referralLeads.length, 1)) * 100);
      list.push({
        type: 'critical', icon: '🔴',
        title: `${topSource[0]} is your top acquisition channel (${Math.round((topSource[1] / stats.total) * 100)}%)`,
        body: `${topSource[1]} leads came via ${topSource[0]}. ${contactRate < 50 ? `Only ${contactRate}% contacted within 48 hrs — faster first response directly increases revenue.` : 'Good contact rate — keep following up promptly.'}`,
      });
    }

    if (unassigned > 0) {
      list.push({
        type: 'insight', icon: '📈',
        title: `${unassigned} leads are unassigned`,
        body: `${unassigned} leads have no owner. Every day of delay drops response quality for high-intent leads. Assign immediately.`,
      });
    }

    if (topOwner && topOwner[1] >= 15) {
      list.push({
        type: 'positive', icon: '✅',
        title: `${topOwner[0]} is handling disproportionate load`,
        body: `${topOwner[0]} is assigned ${topOwner[1]}+ active leads. Consider distributing high-value Negotiation support to reduce single-point risk.`,
      });
    }

    const stuckQuotations = leads.filter((l) => l.stage === 'Quotation Sent' && l.daysInStage >= 5);
    if (stuckQuotations.length >= 3) {
      const quotationValue = stuckQuotations.reduce((s, l) => s + l.value, 0);
      list.push({
        type: 'insight', icon: '💡',
        title: `${stuckQuotations.length} quotations sent with no response in >5 days`,
        body: `These represent ₹${quotationValue}L+ in pending decisions. A structured follow-up sequence (call + revised quote if needed) within 48 hours could move several to Negotiation.`,
      });
    }

    if (completedReferral >= 2) {
      list.push({
        type: 'positive', icon: '🏆',
        title: `${completedReferral} completed projects — all via Referral`,
        body: `Requesting testimonials from completed clients now can seed 5–8 new high-quality leads in the next 30 days.`,
      });
    }

    if (list.length === 0) {
      list.push({
        type: 'insight', icon: '📊',
        title: 'Upload your data for personalised insights',
        body: 'Click "Upload Data" to load your own lead sheet. Vouch will analyse patterns and show actionable insights specific to your pipeline.',
      });
    }

    return list;
  }, [stats, leads]);

  return (
    <div className="bg-[#0d1530] border border-white/6 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🧠</span>
        <div>
          <div className="text-white font-semibold text-sm">Pipeline Insights</div>
          <div className="text-slate-500 text-xs">Pattern analysis across {stats.total} leads</div>
        </div>
      </div>

      <div className="space-y-2.5">
        {insights.map((insight, i) => (
          <div key={i} className={`border rounded-lg px-3.5 py-2.5 ${typeStyles[insight.type]}`}>
            <div className="flex items-start gap-2.5">
              <span className="text-sm shrink-0 mt-0.5">{insight.icon}</span>
              <div>
                <div className="text-white text-xs font-semibold mb-1">{insight.title}</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">{insight.body}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

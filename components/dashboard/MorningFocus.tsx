'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

export default function MorningFocus() {
  const { stats, leads } = useDashboard();

  const items = useMemo(() => {
    const negotiationStuck = leads.filter(
      (l) => l.stage === 'Negotiation' && l.daysInStage >= 5
    ).length;
    const quotationPending = stats.stageCounts['Quotation Sent'] || 0;
    const siteVisits = stats.stageCounts['Site Visit'] || 0;
    const execution = stats.stageCounts['Execution'] || 0;

    return [
      { icon: '🔁', count: stats.followUpCount, label: 'leads need follow-up',              urgency: 'high' as const },
      { icon: '📄', count: quotationPending,     label: 'quotations pending client response', urgency: 'high' as const },
      { icon: '🤝', count: negotiationStuck,     label: 'negotiations need founder attention', urgency: 'critical' as const },
      { icon: '📍', count: siteVisits,           label: 'site visits scheduled',              urgency: 'medium' as const },
      { icon: '🏗️', count: execution,            label: 'execution updates pending',          urgency: 'medium' as const },
      { icon: '⚠️', count: 0, label: `₹${stats.atRiskValue}L high-value pipeline at risk`,  urgency: 'critical' as const, valueOnly: true },
    ];
  }, [stats, leads]);

  const date = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="bg-[#0d1530] border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">☀️</span>
          <div>
            <div className="text-white font-bold text-sm">Rajender&apos;s Morning Focus</div>
            <div className="text-slate-500 text-xs">{date} — here&apos;s what needs your attention today</div>
          </div>
        </div>
        <div className="ml-auto bg-amber-500/15 border border-amber-500/30 rounded-lg px-2.5 py-1">
          <span className="text-amber-400 text-xs font-bold">{items.length} items</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {items.map((item, i) => (
          <div
            key={i}
            className={`
              flex items-center gap-3 rounded-lg px-3.5 py-2.5
              ${item.urgency === 'critical'
                ? 'bg-red-500/8 border border-red-500/20'
                : item.urgency === 'high'
                ? 'bg-amber-500/8 border border-amber-500/15'
                : 'bg-white/3 border border-white/6'}
            `}
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            <div>
              {item.valueOnly ? (
                <span className="text-white text-sm font-bold">{item.label}</span>
              ) : (
                <>
                  <span className={`text-lg font-black mr-1.5 ${
                    item.urgency === 'critical' ? 'text-red-300' :
                    item.urgency === 'high' ? 'text-amber-300' : 'text-white'
                  }`}>{item.count}</span>
                  <span className="text-slate-400 text-xs">{item.label}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

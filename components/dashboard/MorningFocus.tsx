'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { RotateCcw, FileText, Handshake, MapPin, Wrench, AlertTriangle } from 'lucide-react';

export default function MorningFocus() {
  const { stats, leads } = useDashboard();

  const items = useMemo(() => {
    const negotiationStuck = leads.filter(l => l.stage === 'Negotiation' && l.daysInStage >= 5).length;
    const quotationPending = stats.stageCounts['Quotation Sent'] || stats.stageCounts['Quote Sent'] || 0;
    const siteVisits = stats.stageCounts['Site Visit'] || stats.stageCounts['Consultation'] || 0;
    const execution = stats.stageCounts['Execution'] || stats.stageCounts['Work Started'] || 0;

    return [
      { Icon: RotateCcw,      count: stats.followUpCount, label: 'leads need follow-up',          urgency: 'high' as const },
      { Icon: FileText,       count: quotationPending,    label: 'quotes pending response',        urgency: 'high' as const },
      { Icon: Handshake,      count: negotiationStuck,    label: 'negotiations need attention',    urgency: 'critical' as const },
      { Icon: MapPin,         count: siteVisits,          label: 'consultations/visits active',    urgency: 'medium' as const },
      { Icon: Wrench,         count: execution,           label: 'in execution/delivery',          urgency: 'medium' as const },
      { Icon: AlertTriangle,  count: 0,                   label: `₹${stats.atRiskValue}L pipeline at risk`, urgency: 'critical' as const, valueOnly: true },
    ];
  }, [stats, leads]);

  const date = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="bg-th-surface border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">☀️</span>
          <div>
            <div className="text-th-heading font-bold text-sm">Founder&apos;s Morning Focus</div>
            <div className="text-th-muted text-xs">{date} — here&apos;s what needs attention today</div>
          </div>
        </div>
        <div className="ml-auto bg-amber-500/15 border border-amber-500/30 rounded-lg px-2.5 py-1">
          <span className="text-amber-500 text-xs font-bold">{items.length} items</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {items.map((item, i) => {
          const Icon = item.Icon;
          return (
            <div
              key={i}
              className={`
                flex items-center gap-3 rounded-lg px-3.5 py-2.5
                ${item.urgency === 'critical'
                  ? 'bg-red-500/8 border border-red-500/20'
                  : item.urgency === 'high'
                  ? 'bg-amber-500/8 border border-amber-500/15'
                  : 'bg-th-hover border border-th-border'}
              `}
            >
              <Icon size={18} className={`shrink-0 ${
                item.urgency === 'critical' ? 'text-red-500' :
                item.urgency === 'high' ? 'text-amber-500' : 'text-th-muted'
              }`} />
              <div>
                {item.valueOnly ? (
                  <span className="text-th-heading text-sm font-bold">{item.label}</span>
                ) : (
                  <>
                    <span className={`text-lg font-black mr-1.5 ${
                      item.urgency === 'critical' ? 'text-red-500' :
                      item.urgency === 'high' ? 'text-amber-500' : 'text-th-heading'
                    }`}>{item.count}</span>
                    <span className="text-th-body text-xs">{item.label}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

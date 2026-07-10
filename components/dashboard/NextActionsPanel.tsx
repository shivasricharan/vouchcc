'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { ArrowRight } from 'lucide-react';

interface Action {
  priority: 'urgent' | 'high' | 'medium';
  label: string;
}

const dotColors: Record<string, string> = {
  urgent: 'bg-red-400',
  high: 'bg-amber-400',
  medium: 'bg-blue-400',
};

export default function NextActionsPanel() {
  const { leads, stats } = useDashboard();

  const actions = useMemo((): Action[] => {
    const list: Action[] = [];
    const seen = new Set<string>();

    const closed = ['Lost', 'Completed', 'Closed Won', 'Closed Lost'];
    const isActive = (stage: string) => !closed.some(s => stage.includes(s));

    // Pending proposals (>=2 days, no follow-up)
    const proposals = leads.filter(l =>
      ['Proposal Sent', 'Quotation Sent', 'Quote Sent', 'Contract Sent'].some(s => l.stage.includes(s)) &&
      l.daysInStage >= 2 && isActive(l.stage)
    ).slice(0, 2);
    for (const l of proposals) {
      if (seen.has(l.id)) continue;
      seen.add(l.id);
      list.push({ priority: 'urgent', label: `Follow up on proposal — ${l.client}` });
    }

    // High-intent stalled leads
    const highIntent = leads.filter(l =>
      l.probability >= 60 && l.daysInStage >= 3 && isActive(l.stage) && !seen.has(l.id)
    ).sort((a, b) => b.probability - a.probability).slice(0, 2);
    for (const l of highIntent) {
      seen.add(l.id);
      list.push({ priority: 'high', label: `Call ${l.client} — high intent, no recent activity` });
    }

    // High-value stuck (topStuckLeads)
    for (const l of (stats.topStuckLeads || []).slice(0, 2)) {
      if (seen.has(l.id)) continue;
      seen.add(l.id);
      list.push({ priority: 'high', label: `Review stalled deal — ${l.client} (${l.daysInStage}d)` });
    }

    // Unassigned leads
    const unassigned = leads.filter(l =>
      (l.ownerTeam === 'Unassigned' || !l.ownerTeam || l.ownerTeam === '') &&
      isActive(l.stage) && !seen.has(l.id)
    ).slice(0, 2);
    for (const l of unassigned) {
      seen.add(l.id);
      list.push({ priority: 'medium', label: `Assign ${l.client} to a team member` });
    }

    return list.slice(0, 6);
  }, [leads, stats]);

  if (actions.length === 0) return null;

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-5">
      <div className="mb-4">
        <h2 className="text-th-heading font-bold text-base">Recommended Next Actions</h2>
        <p className="text-th-muted text-xs mt-0.5">Specific steps based on your pipeline right now.</p>
      </div>

      <div className="space-y-2.5">
        {actions.map((action, i) => (
          <div key={i} className="flex items-start gap-2.5 py-2 border-b border-th-border last:border-0">
            <div className={`w-2 h-2 rounded-full mt-[5px] shrink-0 ${dotColors[action.priority]}`} />
            <p className="text-th-body text-sm leading-snug flex-1">{action.label}</p>
            <ArrowRight size={13} className="text-th-faint shrink-0 mt-0.5" />
          </div>
        ))}
      </div>

      <p className="text-th-faint text-[10px] mt-4 leading-relaxed">
        Actions are generated from your pipeline data — not generic suggestions.
      </p>
    </div>
  );
}

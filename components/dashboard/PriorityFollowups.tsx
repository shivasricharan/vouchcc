'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

export default function PriorityFollowups() {
  const { leads } = useDashboard();

  const priority = useMemo(() => {
    return leads
      .filter(l =>
        l.daysInStage >= 3 &&
        !['Lost', 'Completed', 'Closed Won', 'Closed Lost', 'Active Customer', 'Enrolled', 'Registered'].some(s => l.stage.includes(s))
      )
      .sort((a, b) => b.probability - a.probability || b.value - a.value || b.daysInStage - a.daysInStage)
      .slice(0, 5)
      .map(l => {
        let issue = '';
        let action = '';
        if (l.daysInStage >= 7) {
          issue = `Stuck ${l.daysInStage} days`;
          action = 'Escalate or reassign immediately';
        } else if (l.owner === 'Unassigned') {
          issue = 'No owner assigned';
          action = 'Assign to a team member today';
        } else if (l.probability >= 60) {
          issue = 'High intent, needs attention';
          action = 'Follow up within 24 hours';
        } else {
          issue = `${l.daysInStage} days without update`;
          action = l.nextAction !== '—' ? l.nextAction : 'Schedule a follow-up call';
        }
        return { ...l, issue, recommendedAction: action };
      });
  }, [leads]);

  if (priority.length === 0) {
    return (
      <div className="bg-th-surface border border-th-border rounded-xl p-6 text-center">
        <div className="text-th-muted text-sm">No priority follow-ups needed right now.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <h2 className="text-th-heading font-bold text-lg">Follow-up Gaps</h2>
        <span className="bg-amber-500/15 text-amber-500 text-xs font-bold px-2 py-0.5 rounded-full">
          {priority.length}
        </span>
      </div>

      <div className="bg-th-surface border border-th-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="border-b border-th-border bg-th-hover">
              {['Lead', 'Stage', 'Issue', 'Next Action'].map(col => (
                <th key={col} className="px-4 py-3 text-left text-th-muted font-semibold text-xs uppercase tracking-wide">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {priority.map((lead, i) => (
              <tr key={lead.id} className={`border-b border-th-border last:border-0 ${i % 2 === 1 ? 'bg-th-hover/50' : ''}`}>
                <td className="px-4 py-3 text-th-heading font-medium">{lead.client}</td>
                <td className="px-4 py-3 text-th-body">{lead.stage}</td>
                <td className="px-4 py-3">
                  <span className="text-orange-500 text-xs font-medium">{lead.issue}</span>
                </td>
                <td className="px-4 py-3 text-th-body text-xs">{lead.recommendedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { getStageColor } from '@/lib/leadTypes';

export default function PriorityFollowups() {
  const { leads } = useDashboard();

  const priority = useMemo(() => {
    return leads
      .filter(l =>
        l.daysInStage >= 3 &&
        !['Lost', 'Completed', 'Closed Won', 'Closed Lost', 'Active Customer', 'Enrolled', 'Registered'].some(s => l.stage.includes(s))
      )
      .sort((a, b) => b.probability - a.probability || b.value - a.value || b.daysInStage - a.daysInStage)
      .slice(0, 10)
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
    <div className="bg-th-surface border border-th-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-th-border">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <div>
          <span className="text-th-heading font-semibold text-sm">Priority Follow-ups</span>
          <span className="text-th-muted text-xs ml-2">Leads that need immediate attention</span>
        </div>
        <span className="ml-auto bg-amber-500/15 text-amber-500 text-xs font-bold px-2 py-0.5 rounded-full">
          {priority.length} leads
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-th-border bg-th-hover">
              {['Lead Name', 'Source', 'Stage', 'Intent', 'Last Contacted', 'Issue', 'Recommended Action'].map(col => (
                <th key={col} className="px-4 py-2.5 text-left text-th-muted font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {priority.map((lead, i) => {
              const intentLabel = lead.probability >= 80 ? 'Very High' : lead.probability >= 60 ? 'High' : lead.probability >= 40 ? 'Medium' : 'Low';
              const intentColor = lead.probability >= 80 ? 'text-green-500' : lead.probability >= 60 ? 'text-blue-500' : lead.probability >= 40 ? 'text-amber-500' : 'text-th-muted';
              return (
                <tr key={lead.id} className={`border-b border-th-border hover:bg-th-hover ${i % 2 === 1 ? 'bg-th-hover' : ''}`}>
                  <td className="px-4 py-2.5">
                    <div className="text-th-heading font-medium whitespace-nowrap">{lead.client}</div>
                  </td>
                  <td className="px-4 py-2.5 text-th-body whitespace-nowrap">{lead.source}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-th-body">
                      <span className={`w-1.5 h-1.5 rounded-full ${getStageColor(lead.stage, i)}`} />
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`text-[10px] font-bold ${intentColor}`}>{intentLabel}</span>
                  </td>
                  <td className="px-4 py-2.5 text-th-muted whitespace-nowrap">{lead.lastContacted}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-orange-500 text-[10px] font-medium">{lead.issue}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-th-body text-[10px] max-w-[200px] truncate block">{lead.recommendedAction}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

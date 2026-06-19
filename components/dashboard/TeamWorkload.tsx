'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { getTeamColor } from '@/lib/leadTypes';

export default function TeamWorkload() {
  const { stats } = useDashboard();
  const { teamCounts } = stats;

  const teamEntries = useMemo(() =>
    Object.entries(teamCounts).sort((a, b) => {
      if (a[0] === 'Unassigned') return 1;
      if (b[0] === 'Unassigned') return -1;
      return b[1] - a[1];
    }),
    [teamCounts]
  );

  const maxCount = Math.max(...teamEntries.map(([, c]) => c), 1);
  const totalActive = teamEntries.reduce((s, [, v]) => s + v, 0);
  const assigned = teamEntries.filter(([k]) => k !== 'Unassigned').reduce((s, [, v]) => s + v, 0);
  const unassigned = teamCounts['Unassigned'] || 0;

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-4 h-full">
      <div className="mb-4">
        <div className="text-th-heading font-semibold text-sm">Team Workload</div>
        <div className="text-th-muted text-xs">Leads per team member</div>
      </div>

      <div className="space-y-3">
        {teamEntries.map(([name, count], idx) => {
          const pct = Math.round((count / maxCount) * 100);
          const colorClass = getTeamColor(name, idx);
          const overloaded = count >= 20;
          const isUnassigned = name === 'Unassigned';
          const initials = isUnassigned ? '?' : name.split(' ').map(p => p[0]).slice(0, 2).join('');

          return (
            <div key={name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${isUnassigned ? 'bg-slate-500' : colorClass} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}>
                    {initials}
                  </div>
                  <div className="text-th-body text-xs font-medium">{name}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-bold ${overloaded ? 'text-orange-500' : isUnassigned ? 'text-red-500' : 'text-th-heading'}`}>{count}</span>
                  {overloaded && <span className="text-[9px] text-orange-500 font-bold">HIGH</span>}
                  {isUnassigned && count > 0 && <span className="text-[9px] text-red-500 font-bold">UNASSIGNED</span>}
                </div>
              </div>
              <div className="h-1.5 bg-th-hover rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isUnassigned ? 'bg-red-500/60' : overloaded ? 'bg-orange-400' : colorClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-th-border grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Total', value: String(totalActive) },
          { label: 'Assigned', value: String(assigned) },
          { label: 'Unassigned', value: String(unassigned) },
        ].map(stat => (
          <div key={stat.label}>
            <div className="text-th-heading font-bold text-base">{stat.value}</div>
            <div className="text-th-faint text-[10px]">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

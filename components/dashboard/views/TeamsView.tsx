'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { TEAM_COLORS, STAGE_COLORS } from '@/lib/leadTypes';
import type { FunnelStage } from '@/lib/leadTypes';

export default function TeamsView() {
  const { stats, leads } = useDashboard();
  const { teamCounts } = stats;

  const teamData = useMemo(() => {
    return Object.entries(teamCounts)
      .sort((a, b) => {
        if (a[0] === 'Unassigned') return 1;
        if (b[0] === 'Unassigned') return -1;
        return b[1] - a[1];
      })
      .map(([name, count]) => {
        const memberLeads = leads.filter((l) => l.owner === name);
        const stuckLeads = memberLeads.filter((l) => l.daysInStage >= 7).length;
        const totalValue = memberLeads.reduce((s, l) => s + l.value, 0);
        const stageBreakdown: Record<string, number> = {};
        for (const l of memberLeads) {
          stageBreakdown[l.stage] = (stageBreakdown[l.stage] || 0) + 1;
        }
        return { name, count, stuckLeads, totalValue, stageBreakdown };
      });
  }, [teamCounts, leads]);

  const maxCount = Math.max(...teamData.map((t) => t.count), 1);

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-white font-bold text-lg">Team Workload</h2>
        <p className="text-slate-500 text-sm mt-0.5">Leads assigned per team member</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Assigned', value: String(leads.filter((l) => l.owner !== 'Unassigned').length), color: 'text-white' },
          { label: 'Unassigned', value: String(teamCounts['Unassigned'] || 0), color: 'text-red-300' },
          { label: 'Team Members', value: String(teamData.filter((t) => t.name !== 'Unassigned').length), color: 'text-blue-300' },
        ].map((k) => (
          <div key={k.label} className="bg-[#0d1530] border border-white/6 rounded-xl p-4">
            <div className="text-slate-500 text-xs mb-1">{k.label}</div>
            <div className={`text-2xl font-black ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Per-member cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamData.map(({ name, count, stuckLeads, totalValue, stageBreakdown }) => {
          const colorClass = TEAM_COLORS[name] || 'bg-slate-500';
          const pct = Math.round((count / maxCount) * 100);
          const isUnassigned = name === 'Unassigned';
          const initials = isUnassigned ? '?' : name.split(' ').map((p) => p[0]).slice(0, 2).join('');

          return (
            <div key={name} className="bg-[#0d1530] border border-white/6 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${isUnassigned ? 'bg-slate-700' : colorClass} flex items-center justify-center text-white font-bold text-sm`}>
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">{name}</div>
                  <div className="text-slate-500 text-xs">{count} leads · ₹{totalValue}L total value</div>
                </div>
                {stuckLeads > 0 && (
                  <span className="bg-orange-500/15 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {stuckLeads} stuck
                  </span>
                )}
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                <div className={`h-full ${isUnassigned ? 'bg-red-500/60' : colorClass} rounded-full`} style={{ width: `${pct}%` }} />
              </div>

              {/* Top stages */}
              <div className="space-y-1">
                {Object.entries(stageBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([stage, n]) => (
                    <div key={stage} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STAGE_COLORS[stage as FunnelStage] || 'bg-slate-500'}`} />
                      <span className="text-slate-500 text-[10px] flex-1">{stage}</span>
                      <span className="text-slate-400 text-[10px] font-medium">{n}</span>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { FUNNEL_STAGES, STAGE_COLORS, SOURCE_COLORS } from '@/lib/leadTypes';
import type { FunnelStage } from '@/lib/leadTypes';

const PIPELINE_STAGES = FUNNEL_STAGES.filter((s) => !['Advance Received', 'Execution', 'Completed', 'Lost'].includes(s));
const TERMINAL_STAGES: FunnelStage[] = ['Advance Received', 'Execution', 'Completed', 'Lost'];

export default function FunnelChart() {
  const { stats } = useDashboard();
  const { byStage, sourceCounts, total } = stats;

  const maxCount = useMemo(() => Math.max(...byStage.map((s) => s.count), 1), [byStage]);

  const sourceEntries = useMemo(
    () => Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]),
    [sourceCounts]
  );

  return (
    <div className="bg-[#0d1530] border border-white/6 rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-white font-semibold text-sm">Funnel by Stage</div>
          <div className="text-slate-500 text-xs">All {total} leads</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
        {/* Pipeline stages */}
        <div className="space-y-1.5">
          <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Pipeline stages</div>
          {PIPELINE_STAGES.map((stage) => {
            const row = byStage.find((b) => b.stage === stage);
            const count = row?.count || 0;
            const value = row?.value || 0;
            const pct = Math.round((count / maxCount) * 100);
            return (
              <div key={stage} className="flex items-center gap-2">
                <span className="text-slate-500 text-[10px] w-24 shrink-0 truncate">{stage}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${STAGE_COLORS[stage as FunnelStage]} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-slate-400 text-[10px] w-5 text-right font-medium">{count}</span>
                <span className="text-slate-600 text-[10px] w-14 text-right hidden sm:block">₹{value}L</span>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          {/* Terminal stages */}
          <div>
            <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Project stages</div>
            <div className="space-y-1.5">
              {TERMINAL_STAGES.map((stage) => {
                const row = byStage.find((b) => b.stage === stage);
                const count = row?.count || 0;
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={stage} className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] w-24 shrink-0 truncate">{stage}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${STAGE_COLORS[stage]} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-slate-400 text-[10px] w-5 text-right font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Source breakdown */}
          <div>
            <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Lead source</div>
            <div className="space-y-1.5">
              {sourceEntries.map(([src, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const colorClass = SOURCE_COLORS[src] || 'bg-slate-500';
                return (
                  <div key={src} className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] w-24 shrink-0 truncate">{src}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-slate-400 text-[10px] w-5 text-right font-medium">{count}</span>
                    <span className="text-slate-600 text-[10px] w-7 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

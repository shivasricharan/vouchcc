'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { getStageColor } from '@/lib/leadTypes';

function fmt(v: number): string {
  if (v >= 100) return `₹${(v / 100).toFixed(1)}Cr`;
  if (v > 0) return `₹${Math.round(v)}L`;
  return '';
}

export default function PipelineFlow() {
  const { stats, leads } = useDashboard();

  const activeStages = useMemo(() => {
    return stats.byStage.filter(s => s.count > 0);
  }, [stats.byStage]);

  const maxCount = useMemo(() => Math.max(...activeStages.map(s => s.count), 1), [activeStages]);

  const stuckByStage = useMemo(() => {
    const map: Record<string, number> = {};
    for (const l of leads) {
      if (l.daysInStage >= 7) {
        map[l.stage] = (map[l.stage] || 0) + 1;
      }
    }
    return map;
  }, [leads]);

  if (activeStages.length === 0) {
    return (
      <div className="bg-th-surface border border-th-border rounded-xl p-6 text-center">
        <p className="text-th-muted text-sm">Load data to see your pipeline flow.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-th-heading font-bold text-base">Pipeline Flow</h2>
        <span className="text-th-muted text-xs">{stats.total} leads · {activeStages.length} stages</span>
      </div>

      {/* Stage flow — horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <div className="flex items-stretch gap-0 min-w-max mb-6">
          {activeStages.map((s, i) => {
            const colorClass = getStageColor(s.stage, i);
            const heightPct = Math.round((s.count / maxCount) * 100);
            const stuckHere = stuckByStage[s.stage] || 0;
            const isBottleneck = stuckHere >= 2;
            const pct = stats.total > 0 ? Math.round((s.count / stats.total) * 100) : 0;

            // Drop-off to next stage
            const next = activeStages[i + 1];
            const dropoff = next ? Math.round(((s.count - next.count) / Math.max(s.count, 1)) * 100) : null;

            return (
              <div key={s.stage} className="flex items-stretch">
                <div className="flex flex-col items-center" style={{ width: 100 }}>
                  {/* Bar */}
                  <div className="flex-1 flex items-end justify-center w-full px-1 pb-2">
                    <div className="w-full relative" style={{ height: 80 }}>
                      <div
                        className={`absolute bottom-0 left-0 right-0 rounded-t-md ${colorClass} opacity-80 animate-progress-fill`}
                        style={{
                          height: `${Math.max(heightPct, 8)}%`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      />
                      {isBottleneck && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400 animate-pulse-soft" />
                      )}
                    </div>
                  </div>

                  {/* Count badge */}
                  <div className={`text-base font-black text-th-heading mb-1`}>{s.count}</div>

                  {/* Stage name */}
                  <div className="text-[9px] text-th-muted text-center leading-tight px-1 w-full truncate" title={s.stage}>
                    {s.stage.length > 12 ? s.stage.slice(0, 11) + '…' : s.stage}
                  </div>

                  {/* Pct */}
                  <div className="text-[9px] text-th-faint mt-0.5">{pct}%</div>

                  {/* Value */}
                  {s.value > 0 && (
                    <div className="text-[9px] text-blue-400 font-medium mt-0.5">{fmt(s.value)}</div>
                  )}

                  {/* Stuck indicator */}
                  {stuckHere > 0 && (
                    <div className="text-[9px] text-red-400 mt-0.5">{stuckHere} stuck</div>
                  )}
                </div>

                {/* Arrow between stages */}
                {next && (
                  <div className="flex flex-col items-center justify-center px-1 pb-8">
                    <div className="text-th-faint text-[10px] mb-0.5">
                      {dropoff !== null && dropoff > 0 ? `-${dropoff}%` : '→'}
                    </div>
                    <div className="text-th-border text-lg">›</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap text-[10px] text-th-faint">
        <span>Bar height = relative volume</span>
        {Object.values(stuckByStage).some(v => v >= 2) && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
            Bottleneck (2+ stuck leads)
          </span>
        )}
      </div>
    </div>
  );
}

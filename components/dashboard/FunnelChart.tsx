'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { getStageColor, SOURCE_COLORS } from '@/lib/leadTypes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CHART_COLORS = [
  '#64748b', '#2563eb', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#f59e0b', '#f97316', '#16a34a', '#10b981',
  '#14b8a6', '#ef4444', '#06b6d4', '#ec4899', '#84cc16',
];

export default function FunnelChart() {
  const { stats } = useDashboard();
  const { byStage, sourceCounts, total } = stats;

  const stageData = useMemo(() =>
    byStage.map((s, i) => ({
      name: s.stage.length > 14 ? s.stage.slice(0, 14) + '…' : s.stage,
      fullName: s.stage,
      count: s.count,
      value: s.value,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    })),
    [byStage]
  );

  const sourceEntries = useMemo(
    () => Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]),
    [sourceCounts]
  );

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-th-heading font-semibold text-sm">Funnel by Stage</div>
          <div className="text-th-muted text-xs">{total} leads across {byStage.length} stages</div>
        </div>
      </div>

      {/* Stage bar chart */}
      {stageData.length > 0 && (
        <div className="mb-5" style={{ height: Math.max(180, stageData.length * 28) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageData} layout="vertical" margin={{ left: 0, right: 12, top: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fill: 'var(--th-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)', borderRadius: 8, fontSize: 12, color: 'var(--th-heading)' }}
                formatter={(val, _, props) => {
                  const p = (props as unknown as { payload: { fullName: string; value: number } }).payload;
                  return [`${val} leads · ₹${p.value}L`, p.fullName];
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                {stageData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Source breakdown */}
      <div>
        <div className="text-th-muted text-[10px] uppercase tracking-wide mb-2 font-semibold">Lead sources</div>
        <div className="space-y-1.5">
          {sourceEntries.map(([src, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const colorClass = SOURCE_COLORS[src] || 'bg-slate-500';
            return (
              <div key={src} className="flex items-center gap-2">
                <span className="text-th-muted text-[10px] w-24 shrink-0 truncate">{src}</span>
                <div className="flex-1 h-1.5 bg-th-hover rounded-full overflow-hidden">
                  <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-th-body text-[10px] w-5 text-right font-medium">{count}</span>
                <span className="text-th-faint text-[10px] w-7 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { SOURCE_COLORS } from '@/lib/leadTypes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CHART_COLORS = [
  '#64748b', '#2563eb', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#f59e0b', '#f97316', '#16a34a', '#10b981',
];

export default function FunnelChart() {
  const { stats, leads } = useDashboard();
  const { byStage, sourceCounts, total } = stats;

  const stageData = useMemo(() =>
    byStage.map((s, i) => ({
      name: s.stage.length > 16 ? s.stage.slice(0, 16) + '…' : s.stage,
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

  const followUpData = useMemo(() => {
    const buckets = [
      { label: '0–2 days', min: 0, max: 2, count: 0 },
      { label: '3–5 days', min: 3, max: 5, count: 0 },
      { label: '6–10 days', min: 6, max: 10, count: 0 },
      { label: '11+ days', min: 11, max: 999, count: 0 },
    ];
    const activeLeads = leads.filter(l =>
      !['Lost', 'Completed', 'Closed Won', 'Closed Lost', 'Active Customer', 'Enrolled', 'Registered'].some(s => l.stage.includes(s))
    );
    for (const l of activeLeads) {
      const b = buckets.find(b => l.daysInStage >= b.min && l.daysInStage <= b.max);
      if (b) b.count++;
    }
    return buckets;
  }, [leads]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stage Drop-Off */}
      <div className="bg-th-surface border border-th-border rounded-xl p-5">
        <div className="mb-4">
          <div className="text-th-heading font-semibold text-sm">Stage Drop-Off</div>
          <div className="text-th-muted text-xs">{total} leads across {byStage.length} stages</div>
        </div>
        {stageData.length > 0 && (
          <div style={{ height: Math.max(160, stageData.length * 26) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
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
      </div>

      {/* Source Quality */}
      <div className="bg-th-surface border border-th-border rounded-xl p-5">
        <div className="mb-4">
          <div className="text-th-heading font-semibold text-sm">Source Quality</div>
          <div className="text-th-muted text-xs">{sourceEntries.length} channels</div>
        </div>
        <div className="space-y-3">
          {sourceEntries.map(([src, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const colorClass = SOURCE_COLORS[src] || 'bg-slate-500';
            return (
              <div key={src}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-th-body text-xs">{src}</span>
                  <span className="text-th-muted text-xs">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-th-hover rounded-full overflow-hidden">
                  <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Follow-Up Delay */}
      <div className="bg-th-surface border border-th-border rounded-xl p-5">
        <div className="mb-4">
          <div className="text-th-heading font-semibold text-sm">Follow-Up Delay</div>
          <div className="text-th-muted text-xs">Time since last stage change</div>
        </div>
        <div className="space-y-3">
          {followUpData.map((bucket) => {
            const maxCount = Math.max(...followUpData.map(b => b.count), 1);
            const pct = Math.round((bucket.count / maxCount) * 100);
            const isWarning = bucket.min >= 6;
            return (
              <div key={bucket.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-th-body text-xs">{bucket.label}</span>
                  <span className={`text-xs font-medium ${isWarning ? 'text-orange-500' : 'text-th-muted'}`}>{bucket.count}</span>
                </div>
                <div className="h-2 bg-th-hover rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isWarning ? 'bg-orange-500' : 'bg-blue-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

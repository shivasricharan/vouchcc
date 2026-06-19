'use client';

import { useDashboard } from '@/context/DashboardContext';
import { getStageColor } from '@/lib/leadTypes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CHART_COLORS = [
  '#64748b', '#2563eb', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#f59e0b', '#f97316', '#16a34a', '#10b981',
  '#14b8a6', '#ef4444', '#06b6d4', '#ec4899',
];

export default function FunnelView() {
  const { stats, leads } = useDashboard();
  const { byStage, sourceCounts, total } = stats;

  const totalValue = leads.reduce((s, l) => s + l.value, 0);
  const convRate = total > 0 ? Math.round(((stats.stageCounts['Completed'] || stats.stageCounts['Closed Won'] || 0) / total) * 100) : 0;
  const maxCount = Math.max(...byStage.map(s => s.count), 1);

  const chartData = byStage.map((s, i) => ({
    name: s.stage.length > 16 ? s.stage.slice(0, 16) + '…' : s.stage,
    fullName: s.stage,
    count: s.count,
    value: s.value,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-th-heading font-bold text-lg">Funnel Analysis</h2>
        <p className="text-th-muted text-sm mt-0.5">Stage-by-stage breakdown of {total} leads</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: String(total), color: 'text-th-heading' },
          { label: 'Total Pipeline', value: `₹${totalValue}L`, color: 'text-green-500' },
          { label: 'Conversion', value: `${convRate}%`, color: 'text-blue-500' },
          { label: 'Stuck', value: String(stats.stuckCount), color: 'text-orange-500' },
        ].map(k => (
          <div key={k.label} className="bg-th-surface border border-th-border rounded-xl p-4">
            <div className="text-th-muted text-xs mb-1">{k.label}</div>
            <div className={`text-2xl font-black ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Recharts funnel */}
      {chartData.length > 0 && (
        <div className="bg-th-surface border border-th-border rounded-xl p-4">
          <div className="text-th-heading font-semibold text-sm mb-3">Stage Distribution</div>
          <div style={{ height: Math.max(200, chartData.length * 32) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: 'var(--th-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)', borderRadius: 8, fontSize: 12, color: 'var(--th-heading)' }}
                  formatter={(val, _, props) => {
                    const p = (props as unknown as { payload: { fullName: string; value: number } }).payload;
                    return [`${val} leads · ₹${p.value}L`, p.fullName];
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                  {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Stage table */}
      <div className="bg-th-surface border border-th-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-th-border">
          <div className="text-th-heading font-semibold text-sm">Detailed Breakdown</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-th-border bg-th-hover">
                {['Stage', 'Leads', '% of Total', 'Pipeline Value', 'Avg Value', 'Bar'].map(col => (
                  <th key={col} className="px-4 py-2.5 text-left text-th-muted font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {byStage.map((row, i) => {
                const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
                const barPct = Math.round((row.count / maxCount) * 100);
                const avgValue = row.count > 0 ? Math.round(row.value / row.count) : 0;
                return (
                  <tr key={row.stage} className={`border-b border-th-border hover:bg-th-hover ${i % 2 === 1 ? 'bg-th-hover' : ''}`}>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-th-body">
                        <span className={`w-1.5 h-1.5 rounded-full ${getStageColor(row.stage, i)}`} />
                        {row.stage}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-th-heading font-bold">{row.count}</td>
                    <td className="px-4 py-2.5 text-th-body">{pct}%</td>
                    <td className="px-4 py-2.5 text-th-body">₹{row.value}L</td>
                    <td className="px-4 py-2.5 text-th-muted">₹{avgValue}L</td>
                    <td className="px-4 py-2.5 w-32">
                      <div className="h-1.5 bg-th-hover rounded-full overflow-hidden">
                        <div className={`h-full ${getStageColor(row.stage, i)} rounded-full`} style={{ width: `${barPct}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source breakdown */}
      <div className="bg-th-surface border border-th-border rounded-xl p-4">
        <div className="text-th-heading font-semibold text-sm mb-4">Lead Source Breakdown</div>
        <div className="space-y-2.5">
          {Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).map(([src, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={src} className="flex items-center gap-3">
                <span className="text-th-body text-xs w-28 shrink-0">{src}</span>
                <div className="flex-1 h-2 bg-th-hover rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-th-heading font-bold text-xs w-8 text-right">{count}</span>
                <span className="text-th-faint text-xs w-10 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

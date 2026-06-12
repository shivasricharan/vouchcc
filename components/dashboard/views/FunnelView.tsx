'use client';

import { useDashboard } from '@/context/DashboardContext';
import { FUNNEL_STAGES, STAGE_COLORS } from '@/lib/leadTypes';
import type { FunnelStage } from '@/lib/leadTypes';

export default function FunnelView() {
  const { stats, leads } = useDashboard();
  const { byStage, sourceCounts, total } = stats;

  const maxCount = Math.max(...byStage.map((s) => s.count), 1);
  const totalValue = leads.reduce((s, l) => s + l.value, 0);

  const conversionRate = total > 0
    ? Math.round(((stats.stageCounts['Completed'] || 0) / total) * 100)
    : 0;

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-white font-bold text-lg">Funnel Analysis</h2>
        <p className="text-slate-500 text-sm mt-0.5">Stage-by-stage breakdown of your {total} leads</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: String(total), color: 'text-white' },
          { label: 'Total Pipeline', value: `₹${totalValue}L`, color: 'text-green-300' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, color: 'text-blue-300' },
          { label: 'Stuck Leads', value: String(stats.stuckCount), color: 'text-orange-300' },
        ].map((k) => (
          <div key={k.label} className="bg-[#0d1530] border border-white/6 rounded-xl p-4">
            <div className="text-slate-500 text-xs mb-1">{k.label}</div>
            <div className={`text-2xl font-black ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Full funnel table */}
      <div className="bg-[#0d1530] border border-white/6 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <div className="text-white font-semibold text-sm">Stage-by-Stage Breakdown</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                {['Stage', 'Leads', '% of Total', 'Pipeline Value', 'Avg Value', 'Bar'].map((col) => (
                  <th key={col} className="px-4 py-2.5 text-left text-slate-500 font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {byStage.map((row, i) => {
                const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
                const barPct = Math.round((row.count / maxCount) * 100);
                const avgValue = row.count > 0 ? Math.round(row.value / row.count) : 0;
                const stageColor = STAGE_COLORS[row.stage as FunnelStage] || 'bg-slate-500';
                return (
                  <tr key={row.stage} className={`border-b border-white/3 hover:bg-white/3 ${i % 2 === 1 ? 'bg-white/1' : ''}`}>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${stageColor}`} />
                        {row.stage}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-white font-bold">{row.count}</td>
                    <td className="px-4 py-2.5 text-slate-400">{pct}%</td>
                    <td className="px-4 py-2.5 text-slate-300">₹{row.value}L</td>
                    <td className="px-4 py-2.5 text-slate-500">₹{avgValue}L</td>
                    <td className="px-4 py-2.5 w-32">
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${stageColor} rounded-full`} style={{ width: `${barPct}%` }} />
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
      <div className="bg-[#0d1530] border border-white/6 rounded-xl p-4">
        <div className="text-white font-semibold text-sm mb-4">Lead Source Breakdown</div>
        <div className="space-y-2.5">
          {Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).map(([src, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={src} className="flex items-center gap-3">
                <span className="text-slate-400 text-xs w-28 shrink-0">{src}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-white font-bold text-xs w-8 text-right">{count}</span>
                <span className="text-slate-600 text-xs w-10 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

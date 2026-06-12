'use client';

import { useDashboard } from '@/context/DashboardContext';
import { STAGE_COLORS } from '@/lib/leadTypes';
import type { FunnelStage } from '@/lib/leadTypes';

export default function StuckLeads() {
  const { stats } = useDashboard();
  const { topStuckLeads, stuckCount } = stats;

  return (
    <div className="bg-[#0d1530] border border-orange-500/20 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
        <div>
          <span className="text-white font-semibold text-sm">Stuck Leads</span>
          <span className="text-slate-500 text-xs ml-2">No movement in ≥7 days</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="bg-orange-500/15 text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full">
            {stuckCount} total
          </span>
          <span className="text-slate-600 text-xs">Showing top 8 by value</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              {['Lead ID', 'Client', 'Stage', 'Assigned To', 'Days Stuck', 'Value', 'Next Action'].map((col) => (
                <th key={col} className="px-4 py-2.5 text-left text-slate-500 font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topStuckLeads.map((lead, i) => {
              const isCritical = lead.daysInStage >= 9 || lead.value >= 80;
              return (
                <tr key={lead.id} className={`border-b border-white/4 transition-colors hover:bg-white/3 ${i % 2 === 0 ? '' : 'bg-white/1'}`}>
                  <td className="px-4 py-2.5 font-mono text-slate-400 whitespace-nowrap">{lead.id}</td>
                  <td className="px-4 py-2.5">
                    <div className="text-white font-medium whitespace-nowrap">{lead.client}</div>
                    <div className="text-slate-600 text-[10px]">{lead.location}</div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5">
                      <span className={`w-1.5 h-1.5 rounded-full ${STAGE_COLORS[lead.stage as FunnelStage] || 'bg-slate-500'}`} />
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">{lead.owner}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`font-bold ${lead.daysInStage >= 9 ? 'text-red-400' : lead.daysInStage >= 7 ? 'text-orange-400' : 'text-slate-400'}`}>
                      {lead.daysInStage}d
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`font-bold ${lead.value >= 80 ? 'text-green-300' : lead.value >= 40 ? 'text-white' : 'text-slate-400'}`}>
                      ₹{lead.value}L
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      {isCritical && (
                        <span className="text-[9px] bg-red-500/15 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-bold shrink-0">
                          URGENT
                        </span>
                      )}
                      <span className="text-slate-500 text-[10px] max-w-[180px] truncate">{lead.nextAction}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {topStuckLeads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-600 text-sm">
                  No stuck leads — everything is moving!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

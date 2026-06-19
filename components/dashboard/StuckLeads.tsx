'use client';

import { useDashboard } from '@/context/DashboardContext';
import { getStageColor } from '@/lib/leadTypes';

export default function StuckLeads() {
  const { stats } = useDashboard();
  const { topStuckLeads, stuckCount } = stats;

  return (
    <div className="bg-th-surface border border-orange-500/20 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-th-border">
        <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
        <div>
          <span className="text-th-heading font-semibold text-sm">Stuck Leads</span>
          <span className="text-th-muted text-xs ml-2">No movement in ≥7 days</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="bg-orange-500/15 text-orange-500 text-xs font-bold px-2 py-0.5 rounded-full">
            {stuckCount} total
          </span>
          <span className="text-th-faint text-xs">Showing top 8 by value</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-th-border">
              {['Lead ID', 'Client', 'Stage', 'Assigned To', 'Days Stuck', 'Value', 'Next Action'].map(col => (
                <th key={col} className="px-4 py-2.5 text-left text-th-muted font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topStuckLeads.map((lead, i) => {
              const isCritical = lead.daysInStage >= 9 || lead.value >= 80;
              const stageIdx = i % 12;
              return (
                <tr key={lead.id} className={`border-b border-th-border transition-colors hover:bg-th-hover ${i % 2 === 1 ? 'bg-th-hover' : ''}`}>
                  <td className="px-4 py-2.5 font-mono text-th-muted whitespace-nowrap">{lead.id}</td>
                  <td className="px-4 py-2.5">
                    <div className="text-th-heading font-medium whitespace-nowrap">{lead.client}</div>
                    <div className="text-th-faint text-[10px]">{lead.location}</div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-th-hover">
                      <span className={`w-1.5 h-1.5 rounded-full ${getStageColor(lead.stage, stageIdx)}`} />
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-th-body whitespace-nowrap">{lead.owner}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`font-bold ${lead.daysInStage >= 9 ? 'text-red-500' : 'text-orange-500'}`}>{lead.daysInStage}d</span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`font-bold ${lead.value >= 80 ? 'text-green-500' : lead.value >= 40 ? 'text-th-heading' : 'text-th-body'}`}>₹{lead.value}L</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      {isCritical && (
                        <span className="text-[9px] bg-red-500/15 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded font-bold shrink-0">URGENT</span>
                      )}
                      <span className="text-th-muted text-[10px] max-w-[180px] truncate">{lead.nextAction}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {topStuckLeads.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-th-muted text-sm">No stuck leads — everything is moving!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

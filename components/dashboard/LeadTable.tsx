'use client';

import { useState, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { FUNNEL_STAGES, STAGE_COLORS } from '@/lib/leadTypes';
import type { FunnelStage } from '@/lib/leadTypes';

const PAGE_SIZE = 25;

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  won:    { label: 'Won',    cls: 'text-green-400 bg-green-500/10 border-green-500/20' },
  active: { label: 'Active', cls: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  stuck:  { label: 'Stuck',  cls: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  lost:   { label: 'Lost',   cls: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

function getStatus(stage: string, daysInStage: number): keyof typeof STATUS_LABEL {
  if (stage === 'Lost') return 'lost';
  if (['Advance Received', 'Execution', 'Completed'].includes(stage)) return 'won';
  if (daysInStage >= 7) return 'stuck';
  return 'active';
}

export default function LeadTable() {
  const { leads } = useDashboard();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<FunnelStage | 'All'>('All');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchStage = stageFilter === 'All' || l.stage === stageFilter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        l.client.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.requirement.toLowerCase().includes(q) ||
        l.owner.toLowerCase().includes(q);
      return matchStage && matchSearch;
    });
  }, [leads, search, stageFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  function handleStageChange(s: FunnelStage | 'All') {
    setStageFilter(s);
    setPage(0);
  }
  function handleSearch(v: string) {
    setSearch(v);
    setPage(0);
  }

  return (
    <div className="bg-[#0d1530] border border-white/6 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/5">
        <div>
          <span className="text-white font-semibold text-sm">Lead Table</span>
          <span className="text-slate-500 text-xs ml-2">{filtered.length} leads</span>
        </div>
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <input
            type="text"
            placeholder="Search client, location…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-blue-500/50 w-44"
          />
          <select
            value={stageFilter}
            onChange={(e) => handleStageChange(e.target.value as FunnelStage | 'All')}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500/50"
          >
            <option value="All">All Stages</option>
            {FUNNEL_STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              {['Lead ID', 'Client', 'Source', 'Location', 'Requirement', 'Stage', 'Owner', 'Last Contact', 'Value', 'Status'].map((col) => (
                <th key={col} className="px-4 py-2.5 text-left text-slate-500 font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((lead, i) => {
              const status = getStatus(lead.stage, lead.daysInStage);
              const statusCfg = STATUS_LABEL[status];
              const stageColor = STAGE_COLORS[lead.stage as FunnelStage] || 'bg-slate-500';
              return (
                <tr key={lead.id} className={`border-b border-white/3 hover:bg-white/3 transition-colors ${i % 2 === 1 ? 'bg-white/1' : ''}`}>
                  <td className="px-4 py-2.5 font-mono text-slate-500 whitespace-nowrap text-[10px]">{lead.id}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="text-white font-medium text-xs">{lead.client}</div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">{lead.source}</td>
                  <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap max-w-[140px] truncate">{lead.location}</td>
                  <td className="px-4 py-2.5 text-slate-400 max-w-[160px] truncate">{lead.requirement}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${stageColor}`} />
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">{lead.owner}</td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{lead.lastContacted}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`font-bold ${lead.value >= 80 ? 'text-green-300' : lead.value >= 40 ? 'text-white' : 'text-slate-400'}`}>
                      ₹{lead.value}L
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusCfg.cls}`}>
                      {statusCfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-600 text-sm">
                  No leads match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5">
          <span className="text-slate-600 text-xs">
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2.5 py-1 text-xs rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
            >
              ‹ Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-6 text-xs rounded transition-colors ${i === page ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 7 && <span className="text-slate-600 text-xs px-1">…{totalPages}</span>}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-2.5 py-1 text-xs rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

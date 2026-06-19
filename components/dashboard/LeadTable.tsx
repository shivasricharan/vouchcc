'use client';

import { useState, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { getStageColor } from '@/lib/leadTypes';
import { Search } from 'lucide-react';

const PAGE_SIZE = 25;

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  won:    { label: 'Won',    cls: 'text-green-500 bg-green-500/10 border-green-500/20' },
  active: { label: 'Active', cls: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  stuck:  { label: 'Stuck',  cls: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
  lost:   { label: 'Lost',   cls: 'text-red-500 bg-red-500/10 border-red-500/20' },
};

function getLeadStatus(stage: string, daysInStage: number): keyof typeof STATUS_LABEL {
  const s = stage.toLowerCase();
  if (['lost', 'closed lost', 'cancelled', 'dead'].some(k => s.includes(k))) return 'lost';
  if (['completed', 'closed won', 'won', 'advance received', 'execution', 'work started', 'active customer', 'enrolled', 'onboarding'].some(k => s.includes(k))) return 'won';
  if (daysInStage >= 7) return 'stuck';
  return 'active';
}

export default function LeadTable() {
  const { leads, stats } = useDashboard();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [page, setPage] = useState(0);

  const stages = useMemo(() => stats.byStage.map(s => s.stage), [stats.byStage]);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      const matchStage = stageFilter === 'All' || l.stage === stageFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || l.client.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.location.toLowerCase().includes(q) || l.requirement.toLowerCase().includes(q) || l.owner.toLowerCase().includes(q);
      return matchStage && matchSearch;
    });
  }, [leads, search, stageFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="bg-th-surface border border-th-border rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-th-border">
        <div>
          <span className="text-th-heading font-semibold text-sm">Lead Table</span>
          <span className="text-th-muted text-xs ml-2">{filtered.length} leads</span>
        </div>
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-th-muted" />
            <input
              type="text" placeholder="Search client, location…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
              className="bg-th-input border border-th-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-th-heading placeholder-th-muted outline-none focus:border-blue-500/50 w-44"
            />
          </div>
          <select
            value={stageFilter}
            onChange={e => { setStageFilter(e.target.value); setPage(0); }}
            className="bg-th-input border border-th-border rounded-lg px-3 py-1.5 text-xs text-th-heading outline-none focus:border-blue-500/50"
          >
            <option value="All">All Stages</option>
            {stages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-th-border bg-th-hover">
              {['Lead ID', 'Client', 'Source', 'Location', 'Requirement', 'Stage', 'Owner', 'Last Contact', 'Value', 'Status'].map(col => (
                <th key={col} className="px-4 py-2.5 text-left text-th-muted font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((lead, i) => {
              const status = getLeadStatus(lead.stage, lead.daysInStage);
              const statusCfg = STATUS_LABEL[status];
              const stageIdx = stages.indexOf(lead.stage);
              return (
                <tr key={lead.id} className={`border-b border-th-border hover:bg-th-hover transition-colors ${i % 2 === 1 ? 'bg-th-hover' : ''}`}>
                  <td className="px-4 py-2.5 font-mono text-th-muted whitespace-nowrap text-[10px]">{lead.id}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap"><div className="text-th-heading font-medium text-xs">{lead.client}</div></td>
                  <td className="px-4 py-2.5 text-th-body whitespace-nowrap">{lead.source}</td>
                  <td className="px-4 py-2.5 text-th-body whitespace-nowrap max-w-[140px] truncate">{lead.location}</td>
                  <td className="px-4 py-2.5 text-th-body max-w-[160px] truncate">{lead.requirement}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-th-body">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStageColor(lead.stage, stageIdx >= 0 ? stageIdx : 0)}`} />
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-th-body whitespace-nowrap">{lead.owner}</td>
                  <td className="px-4 py-2.5 text-th-muted whitespace-nowrap">{lead.lastContacted}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`font-bold ${lead.value >= 80 ? 'text-green-500' : lead.value >= 40 ? 'text-th-heading' : 'text-th-body'}`}>₹{lead.value}L</span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusCfg.cls}`}>{statusCfg.label}</span>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-8 text-center text-th-muted text-sm">No leads match your filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-th-border">
          <span className="text-th-faint text-xs">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-2.5 py-1 text-xs rounded bg-th-hover hover:bg-th-input disabled:opacity-30 text-th-body transition-colors">‹ Prev</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`w-7 h-6 text-xs rounded transition-colors ${i === page ? 'bg-blue-600 text-white' : 'bg-th-hover hover:bg-th-input text-th-body'}`}>{i + 1}</button>
            ))}
            {totalPages > 7 && <span className="text-th-faint text-xs px-1">…{totalPages}</span>}
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="px-2.5 py-1 text-xs rounded bg-th-hover hover:bg-th-input disabled:opacity-30 text-th-body transition-colors">Next ›</button>
          </div>
        </div>
      )}
    </div>
  );
}

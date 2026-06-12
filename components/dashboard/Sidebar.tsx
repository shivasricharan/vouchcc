'use client';

import { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import type { ViewId } from '@/context/DashboardContext';

const NAV_ITEMS: { label: string; icon: string; id: ViewId }[] = [
  { label: 'Dashboard', icon: '◈', id: 'dashboard' },
  { label: 'Leads',     icon: '◎', id: 'leads' },
  { label: 'Funnel',    icon: '◇', id: 'funnel' },
  { label: 'Teams',     icon: '◯', id: 'teams' },
  { label: 'Insights',  icon: '◆', id: 'insights' },
  { label: 'Settings',  icon: '⚙', id: 'settings' },
  { label: 'Guide',     icon: '?', id: 'guide' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const { view, setView, dataMode, fileName, uploadedAt } = useDashboard();

  const badgeLabel = dataMode === 'live'
    ? `Live: ${fileName ? (fileName.length > 18 ? fileName.slice(0, 18) + '…' : fileName) : 'uploaded'}`
    : 'Sample data — June 2026';

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`
          ${open ? 'w-56' : 'w-14'}
          hidden lg:flex flex-col flex-shrink-0 h-screen
          bg-[#0a0f1e] border-r border-white/6
          transition-all duration-200
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-white/6 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xs">V</span>
          </div>
          {open && (
            <div className="min-w-0">
              <div className="text-white font-bold text-sm leading-tight truncate">DzineHome</div>
              <div className="text-slate-500 text-[10px] truncate">Command Center</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`
                  w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left
                  transition-colors text-sm
                  ${isActive
                    ? 'bg-blue-600/15 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                `}
              >
                <span className="text-base shrink-0 w-5 text-center">{item.icon}</span>
                {open && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Data badge */}
        <div className="px-2 pb-4 shrink-0">
          {open ? (
            <div className={`border rounded-lg px-3 py-2 text-center ${
              dataMode === 'live'
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-amber-500/10 border-amber-500/20'
            }`}>
              <div className={`text-[10px] font-bold uppercase tracking-wide ${dataMode === 'live' ? 'text-green-400' : 'text-amber-400'}`}>
                {dataMode === 'live' ? 'Live Data' : 'Demo Mode'}
              </div>
              <div className="text-slate-500 text-[10px] mt-0.5 truncate">{badgeLabel}</div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className={`w-2 h-2 rounded-full ${dataMode === 'live' ? 'bg-green-400' : 'bg-amber-400'}`} />
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="h-10 border-t border-white/6 flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors text-xs shrink-0"
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {open ? '‹ collapse' : '›'}
        </button>
      </aside>
    </>
  );
}

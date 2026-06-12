'use client';

import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: '◈', active: true },
  { label: 'Leads',     icon: '◎', active: false },
  { label: 'Funnel',    icon: '◇', active: false },
  { label: 'Teams',     icon: '◯', active: false },
  { label: 'Insights',  icon: '◆', active: false },
  { label: 'Settings',  icon: '⚙', active: false },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
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
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`
                w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left
                transition-colors text-sm
                ${item.active
                  ? 'bg-blue-600/15 text-blue-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
              `}
            >
              <span className="text-base shrink-0 w-5 text-center">{item.icon}</span>
              {open && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Demo badge */}
        <div className="px-2 pb-4 shrink-0">
          {open ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-center">
              <div className="text-amber-400 text-[10px] font-bold uppercase tracking-wide">Demo Mode</div>
              <div className="text-slate-500 text-[10px] mt-0.5">Sample data — June 2026</div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-400" title="Demo Mode" />
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

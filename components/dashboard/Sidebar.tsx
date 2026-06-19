'use client';

import { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import type { ViewId } from '@/context/DashboardContext';
import { LayoutDashboard, Upload, Users, GitBranch, UserCircle, Lightbulb, Settings, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const NAV_ITEMS: { label: string; icon: typeof LayoutDashboard; id: ViewId }[] = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Upload CSV', icon: Upload,          id: 'upload' },
  { label: 'Leads',      icon: Users,           id: 'leads' },
  { label: 'Funnel',     icon: GitBranch,       id: 'funnel' },
  { label: 'Teams',      icon: UserCircle,      id: 'teams' },
  { label: 'Insights',   icon: Lightbulb,       id: 'insights' },
  { label: 'Settings',   icon: Settings,        id: 'settings' },
  { label: 'Guide',      icon: BookOpen,        id: 'guide' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const { view, setView, dataMode, fileName } = useDashboard();

  const badgeLabel = dataMode === 'live'
    ? `Live: ${fileName ? (fileName.length > 18 ? fileName.slice(0, 18) + '…' : fileName) : 'uploaded'}`
    : 'Sample Demo Data';

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`
          ${open ? 'w-56' : 'w-14'}
          hidden lg:flex flex-col flex-shrink-0 h-screen
          bg-th-elevated border-r border-th-border
          transition-all duration-200
        `}
      >
        <div className="flex items-center gap-3 px-4 h-14 border-b border-th-border shrink-0">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-xs">V</span>
          </div>
          {open && (
            <div className="min-w-0">
              <div className="text-th-heading font-bold text-sm leading-tight truncate">Vouch</div>
              <div className="text-th-muted text-[10px] truncate">Command Center</div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`
                  w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left
                  transition-colors text-sm
                  ${isActive
                    ? 'bg-blue-600/15 text-blue-500 font-semibold'
                    : 'text-th-body hover:text-th-heading hover:bg-th-hover'}
                `}
              >
                <Icon size={16} className="shrink-0" />
                {open && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-2 pb-4 shrink-0">
          {open ? (
            <div className={`border rounded-lg px-3 py-2 text-center ${
              dataMode === 'live'
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-amber-500/10 border-amber-500/20'
            }`}>
              <div className={`text-[10px] font-bold uppercase tracking-wide ${dataMode === 'live' ? 'text-green-500' : 'text-amber-500'}`}>
                {dataMode === 'live' ? 'Live Data' : 'Demo Mode'}
              </div>
              <div className="text-th-muted text-[10px] mt-0.5 truncate">{badgeLabel}</div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className={`w-2 h-2 rounded-full ${dataMode === 'live' ? 'bg-green-400' : 'bg-amber-400'}`} />
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="h-10 border-t border-th-border flex items-center justify-center text-th-muted hover:text-th-heading transition-colors text-xs shrink-0"
        >
          {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </aside>
    </>
  );
}

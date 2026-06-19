'use client';

import { useDashboard } from '@/context/DashboardContext';
import type { ViewId } from '@/context/DashboardContext';
import { LayoutDashboard, Upload, BookOpen } from 'lucide-react';

const NAV_ITEMS: { label: string; icon: typeof LayoutDashboard; id: ViewId }[] = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Upload CSV', icon: Upload,          id: 'upload' },
  { label: 'Guide',      icon: BookOpen,        id: 'guide' },
];

export default function Sidebar() {
  const { view, setView } = useDashboard();

  return (
    <aside className="hidden lg:flex flex-col flex-shrink-0 h-screen w-14 bg-th-elevated border-r border-th-border">
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600/15 text-blue-500' : 'text-th-body hover:text-th-heading hover:bg-th-hover'
              }`}
              title={item.label}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

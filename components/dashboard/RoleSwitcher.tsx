'use client';

import { useDashboard } from '@/context/DashboardContext';
import { ROLES } from '@/lib/actionTypes';
import type { RoleId } from '@/lib/actionTypes';

const ROLE_ICONS: Record<RoleId, string> = {
  executive: '◈',
  sales: '◎',
  marketing: '◇',
  finance: '◆',
  operations: '⊕',
};

export default function RoleSwitcher() {
  const { role, setRole } = useDashboard();

  return (
    <div className="flex items-center gap-1 bg-th-elevated border border-th-border rounded-xl p-1 overflow-x-auto">
      {ROLES.map(r => (
        <button
          key={r.id}
          onClick={() => setRole(r.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
            role === r.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-th-muted hover:text-th-heading hover:bg-th-hover'
          }`}
        >
          <span className="text-[10px]">{ROLE_ICONS[r.id]}</span>
          {r.label}
        </button>
      ))}
      <div className="flex-1 min-w-0" />
      <span className="text-th-faint text-[10px] font-medium px-2 shrink-0 hidden sm:block">View</span>
    </div>
  );
}

'use client';

import { useDashboard } from '@/context/DashboardContext';
import { ROLES } from '@/lib/actionTypes';
import type { RoleId } from '@/lib/actionTypes';
import { BriefcaseBusiness, CircleDollarSign, Megaphone, Settings2, TrendingUp } from 'lucide-react';

const ROLE_ICONS: Record<RoleId, typeof BriefcaseBusiness> = {
  executive: BriefcaseBusiness,
  sales: TrendingUp,
  marketing: Megaphone,
  finance: CircleDollarSign,
  operations: Settings2,
};

export default function RoleSwitcher() {
  const { role, setRole } = useDashboard();

  return (
    <div className="flex items-center gap-1 bg-th-elevated border border-th-border rounded-xl p-1 overflow-x-auto">
      {ROLES.map(r => {
        const Icon = ROLE_ICONS[r.id];
        return (
        <button
          key={r.id}
          onClick={() => setRole(r.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
            role === r.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-th-muted hover:text-th-heading hover:bg-th-hover'
          }`}
        >
          <Icon size={12} aria-hidden="true" />
          {r.label}
        </button>
      )})}
      <div className="flex-1 min-w-0" />
      <span className="text-th-faint text-[10px] font-medium px-2 shrink-0 hidden sm:block">View</span>
    </div>
  );
}

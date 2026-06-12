'use client';

import { useDashboard } from '@/context/DashboardContext';

const typeConfig = {
  won:    { dot: 'bg-green-400',  label: 'Won' },
  new:    { dot: 'bg-blue-400',   label: 'New' },
  update: { dot: 'bg-slate-400',  label: 'Update' },
  stuck:  { dot: 'bg-orange-400', label: 'Stuck' },
};

export default function RecentActivity() {
  const { stats } = useDashboard();
  const { recentActivity } = stats;

  return (
    <div className="bg-[#0d1530] border border-white/6 rounded-xl p-4">
      <div className="mb-4">
        <div className="text-white font-semibold text-sm">Recent Activity</div>
        <div className="text-slate-500 text-xs">Latest changes</div>
      </div>

      <div className="space-y-3">
        {recentActivity.length === 0 && (
          <div className="text-slate-600 text-xs text-center py-4">No activity data</div>
        )}
        {recentActivity.map((item, i) => {
          const config = typeConfig[item.type as keyof typeof typeConfig] || typeConfig.update;
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${config.dot} shrink-0 mt-0.5`} />
                {i < recentActivity.length - 1 && (
                  <div className="w-px flex-1 bg-white/5 mt-1" />
                )}
              </div>
              <div className="pb-3 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-white text-[11px] font-medium">{item.client}</span>
                  <span className="text-slate-600 text-[10px] font-mono">{item.lead}</span>
                </div>
                <div className="text-slate-400 text-[11px] leading-snug mt-0.5">{item.action}</div>
                <div className="text-slate-600 text-[10px] mt-0.5">{item.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

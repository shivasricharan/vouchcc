import { dzinehomeStats, TEAM_COLORS } from '@/data/dzinehome';

const { teamCounts } = dzinehomeStats;

const TEAM = [
  { name: 'Kavitha R.', role: 'Lead Designer' },
  { name: 'Pradeep S.', role: 'Designer' },
  { name: 'Ananya M.',  role: 'Junior Designer' },
  { name: 'Sriram V.', role: 'Business Dev' },
  { name: 'Unassigned', role: 'Needs assignment' },
];

export default function TeamWorkload() {
  const maxCount = Math.max(...TEAM.map((t) => teamCounts[t.name] || 0), 1);

  return (
    <div className="bg-[#0d1530] border border-white/6 rounded-xl p-4 h-full">
      <div className="mb-4">
        <div className="text-white font-semibold text-sm">Team Workload</div>
        <div className="text-slate-500 text-xs">Active funnel leads per member</div>
      </div>

      <div className="space-y-3">
        {TEAM.map((member) => {
          const count = teamCounts[member.name] || 0;
          const pct = Math.round((count / maxCount) * 100);
          const colorClass = TEAM_COLORS[member.name] || 'bg-slate-500';
          const overloaded = count >= 20;
          const unassigned = member.name === 'Unassigned';

          return (
            <div key={member.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${unassigned ? 'bg-slate-700' : colorClass} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}>
                    {member.name.split(' ')[0][0]}{member.name.split(' ')[1]?.[0] ?? ''}
                  </div>
                  <div>
                    <div className="text-slate-300 text-xs font-medium">{member.name}</div>
                    <div className="text-slate-600 text-[10px]">{member.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-bold ${overloaded ? 'text-orange-400' : unassigned ? 'text-red-400' : 'text-white'}`}>
                    {count}
                  </span>
                  {overloaded && <span className="text-[9px] text-orange-400 font-bold">HIGH</span>}
                  {unassigned && count > 0 && <span className="text-[9px] text-red-400 font-bold">UNASSIGNED</span>}
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${unassigned ? 'bg-red-500/60' : overloaded ? 'bg-orange-400' : colorClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Total active', value: String(Object.values(teamCounts).reduce((a, b) => a + b, 0)) },
          { label: 'Assigned', value: String(Object.entries(teamCounts).filter(([k]) => k !== 'Unassigned').reduce((a, [,v]) => a + v, 0)) },
          { label: 'Unassigned', value: String(teamCounts['Unassigned'] || 0) },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-white font-bold text-base">{stat.value}</div>
            <div className="text-slate-600 text-[10px]">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

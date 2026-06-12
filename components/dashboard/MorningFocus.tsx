const items = [
  { icon: '🔁', count: 18, label: 'leads need follow-up',               urgency: 'high' },
  { icon: '📄', count: 7,  label: 'quotations pending client response',  urgency: 'high' },
  { icon: '🤝', count: 5,  label: 'negotiations need founder attention',  urgency: 'critical' },
  { icon: '📍', count: 4,  label: 'site visits scheduled today',          urgency: 'medium' },
  { icon: '🏗️', count: 3,  label: 'execution updates pending',           urgency: 'medium' },
  { icon: '⚠️', count: 0,  label: '₹58L high-value pipeline at risk',    urgency: 'critical', valueOnly: true },
];

export default function MorningFocus() {
  return (
    <div className="bg-[#0d1530] border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">☀️</span>
          <div>
            <div className="text-white font-bold text-sm">Rajender&apos;s Morning Focus</div>
            <div className="text-slate-500 text-xs">Friday, June 12 — here&apos;s what needs your attention today</div>
          </div>
        </div>
        <div className="ml-auto bg-amber-500/15 border border-amber-500/30 rounded-lg px-2.5 py-1">
          <span className="text-amber-400 text-xs font-bold">6 items</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {items.map((item, i) => (
          <div
            key={i}
            className={`
              flex items-center gap-3 rounded-lg px-3.5 py-2.5
              ${item.urgency === 'critical'
                ? 'bg-red-500/8 border border-red-500/20'
                : item.urgency === 'high'
                ? 'bg-amber-500/8 border border-amber-500/15'
                : 'bg-white/3 border border-white/6'}
            `}
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            <div>
              {item.valueOnly ? (
                <span className="text-white text-sm font-bold">{item.label}</span>
              ) : (
                <>
                  <span className={`text-lg font-black mr-1.5 ${
                    item.urgency === 'critical' ? 'text-red-300' :
                    item.urgency === 'high' ? 'text-amber-300' : 'text-white'
                  }`}>{item.count}</span>
                  <span className="text-slate-400 text-xs">{item.label}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

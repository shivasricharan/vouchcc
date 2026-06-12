const pipelineStages = [
  { label: 'New', count: 12, color: 'bg-slate-500', width: 'w-full' },
  { label: 'Contacted', count: 9, color: 'bg-blue-500', width: 'w-3/4' },
  { label: 'Qualified', count: 6, color: 'bg-violet-500', width: 'w-1/2' },
  { label: 'Proposal', count: 4, color: 'bg-amber-500', width: 'w-1/3' },
  { label: 'Negotiation', count: 2, color: 'bg-orange-500', width: 'w-1/4' },
  { label: 'Won', count: 1, color: 'bg-green-500', width: 'w-1/6' },
];

const sources = [
  { name: 'WhatsApp', leads: 18, pct: 42, color: 'bg-green-500' },
  { name: 'Referral', leads: 12, pct: 28, color: 'bg-blue-500' },
  { name: 'Instagram', leads: 8, pct: 19, color: 'bg-pink-500' },
  { name: 'Website', leads: 4, pct: 9, color: 'bg-violet-500' },
  { name: 'Other', leads: 1, pct: 2, color: 'bg-slate-500' },
];

export default function DashboardSection() {
  return (
    <section id="dashboard" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1 mb-4">
            <span className="text-violet-400 text-sm font-semibold">Dashboard Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            Your business, in one view.
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            This is what owner-level visibility looks like. No reports to pull. No spreadsheets
            to update.
          </p>
        </div>

        {/* Dashboard mock */}
        <div className="bg-navy-800/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 card-glow">
          {/* Top bar */}
          <div className="bg-navy-900/60 border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-slate-400 text-sm font-medium">Vouch Dashboard — June 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-500">Live</span>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Leads', value: '43', sub: '+8 this week', color: 'text-white', dot: 'bg-blue-400' },
                { label: 'Hot Leads', value: '11', sub: 'Need reply today', color: 'text-amber-400', dot: 'bg-amber-400' },
                { label: 'Pending Follow-up', value: '7', sub: '3 overdue', color: 'text-orange-400', dot: 'bg-orange-400' },
                { label: 'Lost This Month', value: '4', sub: '-2 vs last month', color: 'text-red-400', dot: 'bg-red-400' },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="bg-navy-900/60 border border-white/8 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${kpi.dot}`} />
                    <span className="text-slate-500 text-xs font-medium">{kpi.label}</span>
                  </div>
                  <div className={`text-3xl font-black ${kpi.color} mb-1`}>{kpi.value}</div>
                  <div className="text-slate-500 text-xs">{kpi.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Pipeline */}
              <div>
                <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Stage-wise Pipeline
                </h3>
                <div className="space-y-3">
                  {pipelineStages.map((stage) => (
                    <div key={stage.label} className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs w-20 shrink-0">{stage.label}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${stage.color} rounded-full transition-all`}
                          style={{ width: `${(stage.count / 12) * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-xs w-6 text-right">{stage.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div>
                <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Source-wise Leads
                </h3>
                <div className="space-y-3">
                  {sources.map((source) => (
                    <div key={source.name} className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs w-20 shrink-0">{source.name}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${source.color} rounded-full`}
                          style={{ width: `${source.pct}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-xs w-6 text-right">{source.leads}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Follow-up today */}
            <div className="mt-8 bg-amber-500/5 border border-amber-500/15 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400 text-sm font-bold">Follow-up Due Today</span>
                <span className="ml-auto bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">7</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Priya Sharma', business: 'Bliss Interiors', status: 'Proposal sent 5 days ago', hot: true },
                  { name: 'Rajan Mehta', business: 'Studio M Architecture', status: 'Site visit done, no reply', hot: true },
                  { name: 'Deepa Iyer', business: 'Self — Home Reno', status: 'First contact 3 days ago', hot: false },
                ].map((lead) => (
                  <div key={lead.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{lead.name}</span>
                        {lead.hot && (
                          <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded font-bold">HOT</span>
                        )}
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5">{lead.business} · {lead.status}</div>
                    </div>
                    <button className="text-xs bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
                      Follow up
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion insight */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Conversion Rate', value: '18%', sub: 'Enquiry → Won', trend: '↑ 3% vs last month' },
                { label: 'Avg. Response Time', value: '4.2 hrs', sub: 'First reply to lead', trend: '↓ 1.1 hrs improved' },
                { label: 'Pipeline Value', value: '₹48L', sub: 'Across open stages', trend: '+₹12L this month' },
              ].map((metric) => (
                <div key={metric.label} className="bg-navy-900/40 border border-white/8 rounded-xl p-4">
                  <div className="text-slate-500 text-xs mb-1">{metric.label}</div>
                  <div className="text-white font-black text-xl mb-1">{metric.value}</div>
                  <div className="text-slate-500 text-xs">{metric.sub}</div>
                  <div className="text-green-400 text-xs mt-1 font-medium">{metric.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

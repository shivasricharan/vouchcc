import { dzinehomeStats, FUNNEL_STAGES, STAGE_COLORS, SOURCE_COLORS } from '@/data/dzinehome';
import type { FunnelStage, LeadSource } from '@/data/dzinehome';

const { byStage, sourceCounts } = dzinehomeStats;

const maxCount = Math.max(...byStage.map((s) => s.count), 1);

const sourceOrder: LeadSource[] = ['WhatsApp', 'Instagram', 'Referral', 'Website', 'Phone Call', 'Walk-in'];
const totalLeads = 100;

export default function FunnelChart() {
  return (
    <div className="bg-[#0d1530] border border-white/6 rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-white font-semibold text-sm">Funnel by Stage</div>
          <div className="text-slate-500 text-xs">All 100 leads · click to filter</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
        {/* Funnel bars */}
        <div className="space-y-1.5">
          <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Pipeline stages</div>
          {FUNNEL_STAGES.filter((s) => !['Advance Received','Execution','Completed','Lost'].includes(s)).map((stage) => {
            const row = byStage.find((b) => b.stage === stage)!;
            const pct = Math.round((row.count / maxCount) * 100);
            return (
              <div key={stage} className="flex items-center gap-2">
                <span className="text-slate-500 text-[10px] w-24 shrink-0 truncate">{stage}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${STAGE_COLORS[stage as FunnelStage]} rounded-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-slate-400 text-[10px] w-5 text-right font-medium">{row.count}</span>
                <span className="text-slate-600 text-[10px] w-14 text-right hidden sm:block">
                  ₹{row.value}L
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: terminal + source */}
        <div className="space-y-4">
          {/* Terminal stages */}
          <div>
            <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Project stages</div>
            <div className="space-y-1.5">
              {(['Advance Received','Execution','Completed','Lost'] as FunnelStage[]).map((stage) => {
                const row = byStage.find((b) => b.stage === stage)!;
                const pct = Math.round((row.count / maxCount) * 100);
                return (
                  <div key={stage} className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] w-24 shrink-0 truncate">{stage}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${STAGE_COLORS[stage]} rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-[10px] w-5 text-right font-medium">{row.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Source breakdown */}
          <div>
            <div className="text-slate-500 text-[10px] uppercase tracking-wide mb-2 font-semibold">Lead source</div>
            <div className="space-y-1.5">
              {sourceOrder.map((src) => {
                const count = sourceCounts[src];
                const pct = Math.round((count / totalLeads) * 100);
                return (
                  <div key={src} className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] w-24 shrink-0">{src}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${SOURCE_COLORS[src]} rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-[10px] w-5 text-right font-medium">{count}</span>
                    <span className="text-slate-600 text-[10px] w-7 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { generateTextSummary, generateHTMLSummary, buildMailtoLink } from '@/lib/generateSummary';

export default function InsightsView() {
  const { stats, leads, dataMode, fileName } = useDashboard();
  const [emailInput, setEmailInput] = useState('');
  const [showEmailBox, setShowEmailBox] = useState(false);

  const businessName = dataMode === 'live' && fileName
    ? fileName.replace(/\.[^.]+$/, '')
    : 'DzineHome';

  const insights = useMemo(() => {
    const topSource = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1]);
    const topOwner = Object.entries(stats.teamCounts)
      .filter(([k]) => k !== 'Unassigned')
      .sort((a, b) => b[1] - a[1]);

    const stuckByStage: Record<string, number> = {};
    const stuckValueByStage: Record<string, number> = {};
    for (const l of leads) {
      if (l.daysInStage >= 7) {
        stuckByStage[l.stage] = (stuckByStage[l.stage] || 0) + 1;
        stuckValueByStage[l.stage] = (stuckValueByStage[l.stage] || 0) + l.value;
      }
    }

    const biggestBottleneck = Object.entries(stuckByStage).sort((a, b) => b[1] - a[1])[0];
    const unassigned = stats.teamCounts['Unassigned'] || 0;
    const referralCount = stats.sourceCounts['Referral'] || 0;
    const referralCompleted = leads.filter((l) => l.source === 'Referral' && l.stage === 'Completed').length;

    return {
      topSource: topSource[0],
      topOwner: topOwner[0],
      biggestBottleneck,
      unassigned,
      referralCount,
      referralCompleted,
      stuckByStage,
      stuckValueByStage,
    };
  }, [stats, leads]);

  function downloadTxt() {
    const text = generateTextSummary(stats, leads, businessName);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vouch-pipeline-summary-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadHTML() {
    const html = generateHTMLSummary(stats, leads, businessName);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vouch-pipeline-summary-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleEmail() {
    if (!emailInput.trim()) return;
    const link = buildMailtoLink(emailInput.trim(), stats, businessName);
    window.open(link, '_blank');
  }

  const convRate = stats.total > 0
    ? ((stats.stageCounts['Completed'] || 0) / stats.total * 100).toFixed(1)
    : '0.0';

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white font-bold text-lg">Pipeline Insights</h2>
          <p className="text-slate-500 text-sm mt-0.5">Deep analysis of {stats.total} leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadTxt}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <span>↓</span> Download .txt
          </button>
          <button
            onClick={downloadHTML}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <span>↓</span> Download .html
          </button>
          <button
            onClick={() => setShowEmailBox(!showEmailBox)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            ✉ Email Summary
          </button>
        </div>
      </div>

      {showEmailBox && (
        <div className="bg-[#0d1530] border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
          <input
            type="email"
            placeholder="rajender@dzinehome.in"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-blue-500/50"
          />
          <button
            onClick={handleEmail}
            disabled={!emailInput.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Send via Email App
          </button>
        </div>
      )}

      {/* Health Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pipeline Health', value: stats.stuckCount <= 5 ? 'Good' : stats.stuckCount <= 15 ? 'At Risk' : 'Critical', color: stats.stuckCount <= 5 ? 'text-green-300' : stats.stuckCount <= 15 ? 'text-amber-300' : 'text-red-300' },
          { label: 'Conversion Rate', value: `${convRate}%`, color: 'text-blue-300' },
          { label: 'At-Risk Value', value: `₹${stats.atRiskValue}L`, color: 'text-orange-300' },
          { label: 'Pipeline Value', value: `₹${(stats.pipelineValue / 100).toFixed(1)} Cr`, color: 'text-green-300' },
        ].map((k) => (
          <div key={k.label} className="bg-[#0d1530] border border-white/6 rounded-xl p-4">
            <div className="text-slate-500 text-xs mb-1">{k.label}</div>
            <div className={`text-xl font-black ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Key findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0d1530] border border-white/6 rounded-xl p-4">
          <div className="text-white font-semibold text-sm mb-3">Bottleneck Analysis</div>
          <div className="space-y-2">
            {Object.entries(insights.stuckByStage)
              .sort((a, b) => b[1] - a[1])
              .map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">{stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-300 font-bold text-xs">{count} stuck</span>
                    <span className="text-slate-600 text-[10px]">₹{insights.stuckValueByStage[stage] || 0}L</span>
                  </div>
                </div>
              ))}
            {Object.keys(insights.stuckByStage).length === 0 && (
              <div className="text-slate-600 text-sm">No stuck leads — great velocity!</div>
            )}
          </div>
        </div>

        <div className="bg-[#0d1530] border border-white/6 rounded-xl p-4">
          <div className="text-white font-semibold text-sm mb-3">Source Performance</div>
          <div className="space-y-2">
            {Object.entries(stats.sourceCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([src, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={src} className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs w-28 shrink-0">{src}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-white text-xs font-bold w-6 text-right">{count}</span>
                    <span className="text-slate-600 text-[10px] w-9 text-right">{pct}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-[#0d1530] border border-blue-500/15 rounded-xl p-4">
        <div className="text-white font-semibold text-sm mb-3">🧠 Recommendations</div>
        <div className="space-y-2">
          {insights.unassigned > 0 && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-red-400 font-bold shrink-0">→</span>
              <span className="text-slate-300">Assign {insights.unassigned} unassigned leads immediately — these are at high risk of going cold.</span>
            </div>
          )}
          {insights.biggestBottleneck && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-orange-400 font-bold shrink-0">→</span>
              <span className="text-slate-300">
                Focus on {insights.biggestBottleneck[0]} — {insights.biggestBottleneck[1]} leads stuck, worth ₹{insights.stuckValueByStage[insights.biggestBottleneck[0]] || 0}L.
              </span>
            </div>
          )}
          {insights.topSource && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-blue-400 font-bold shrink-0">→</span>
              <span className="text-slate-300">
                {insights.topSource[0]} is your top source ({insights.topSource[1]} leads). Invest more in this channel.
              </span>
            </div>
          )}
          {insights.topOwner && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-violet-400 font-bold shrink-0">→</span>
              <span className="text-slate-300">
                {insights.topOwner[0]} has the highest load ({insights.topOwner[1]} leads). Consider redistributing.
              </span>
            </div>
          )}
          {insights.referralCompleted >= 2 && (
            <div className="flex items-start gap-2 text-xs">
              <span className="text-green-400 font-bold shrink-0">→</span>
              <span className="text-slate-300">
                {insights.referralCompleted} completed projects via Referral — request testimonials now to seed your next pipeline.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

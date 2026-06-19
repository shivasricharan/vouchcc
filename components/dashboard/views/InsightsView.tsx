'use client';

import { useMemo, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { generateTextSummary, generateHTMLSummary, buildMailtoLink } from '@/lib/generateSummary';
import { Download, Mail, TrendingDown, Users, Target, AlertTriangle, ArrowRight } from 'lucide-react';

export default function InsightsView() {
  const { stats, leads, dataMode, fileName } = useDashboard();
  const [emailInput, setEmailInput] = useState('');
  const [showEmailBox, setShowEmailBox] = useState(false);

  const businessName = dataMode === 'live' && fileName ? fileName.replace(/\.[^.]+$/, '') : 'Your Business';

  const insights = useMemo(() => {
    const topSource = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1]);
    const topOwner = Object.entries(stats.teamCounts).filter(([k]) => k !== 'Unassigned').sort((a, b) => b[1] - a[1]);
    const stuckByStage: Record<string, number> = {};
    const stuckValueByStage: Record<string, number> = {};
    for (const l of leads) {
      if (l.daysInStage >= 7 && !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s))) {
        stuckByStage[l.stage] = (stuckByStage[l.stage] || 0) + 1;
        stuckValueByStage[l.stage] = (stuckValueByStage[l.stage] || 0) + l.value;
      }
    }
    const biggestBottleneck = Object.entries(stuckByStage).sort((a, b) => b[1] - a[1])[0];
    const unassigned = stats.teamCounts['Unassigned'] || 0;
    return { topSource: topSource[0], topOwner: topOwner[0], biggestBottleneck, unassigned, stuckByStage, stuckValueByStage };
  }, [stats, leads]);

  function downloadTxt() {
    const blob = new Blob([generateTextSummary(stats, leads, businessName)], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `vouch-summary-${Date.now()}.txt`; a.click();
  }
  function downloadHTML() {
    const blob = new Blob([generateHTMLSummary(stats, leads, businessName)], { type: 'text/html' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `vouch-summary-${Date.now()}.html`; a.click();
  }
  function handleEmail() {
    if (!emailInput.trim()) return;
    window.open(buildMailtoLink(emailInput.trim(), stats, businessName), '_blank');
  }

  const convRate = stats.total > 0 ? ((stats.stageCounts['Completed'] || stats.stageCounts['Closed Won'] || 0) / stats.total * 100).toFixed(1) : '0.0';

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-th-heading font-bold text-lg">Smart Insights</h2>
          <p className="text-th-muted text-sm mt-0.5">Deep analysis of {stats.total} leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={downloadTxt} className="flex items-center gap-1.5 bg-th-hover border border-th-border text-th-body text-xs font-medium px-3 py-2 rounded-lg hover:bg-th-input transition-colors">
            <Download size={13} /> .txt
          </button>
          <button onClick={downloadHTML} className="flex items-center gap-1.5 bg-th-hover border border-th-border text-th-body text-xs font-medium px-3 py-2 rounded-lg hover:bg-th-input transition-colors">
            <Download size={13} /> .html
          </button>
          <button onClick={() => setShowEmailBox(!showEmailBox)} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            <Mail size={13} /> Email
          </button>
        </div>
      </div>

      {showEmailBox && (
        <div className="bg-th-surface border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
          <input type="email" placeholder="founder@business.com" value={emailInput} onChange={e => setEmailInput(e.target.value)}
            className="flex-1 bg-th-input border border-th-border rounded-lg px-3 py-2 text-sm text-th-heading placeholder-th-muted outline-none focus:border-blue-500/50" />
          <button onClick={handleEmail} disabled={!emailInput.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Send</button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pipeline Health', value: stats.stuckCount <= 5 ? 'Good' : stats.stuckCount <= 15 ? 'At Risk' : 'Critical', color: stats.stuckCount <= 5 ? 'text-green-500' : stats.stuckCount <= 15 ? 'text-amber-500' : 'text-red-500' },
          { label: 'Conversion Rate', value: `${convRate}%`, color: 'text-blue-500' },
          { label: 'At-Risk Value', value: `₹${stats.atRiskValue}L`, color: 'text-orange-500' },
          { label: 'Pipeline Value', value: `₹${(stats.pipelineValue / 100).toFixed(1)} Cr`, color: 'text-green-500' },
        ].map(k => (
          <div key={k.label} className="bg-th-surface border border-th-border rounded-xl p-4">
            <div className="text-th-muted text-xs mb-1">{k.label}</div>
            <div className={`text-xl font-black ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-th-surface border border-th-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={14} className="text-orange-500" />
            <span className="text-th-heading font-semibold text-sm">Bottleneck Analysis</span>
          </div>
          <div className="space-y-2">
            {Object.entries(insights.stuckByStage).sort((a, b) => b[1] - a[1]).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-th-body text-xs">{stage}</span>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold text-xs">{count} stuck</span>
                  <span className="text-th-faint text-[10px]">₹{insights.stuckValueByStage[stage] || 0}L</span>
                </div>
              </div>
            ))}
            {Object.keys(insights.stuckByStage).length === 0 && <div className="text-th-muted text-sm">No bottlenecks — great velocity!</div>}
          </div>
        </div>

        <div className="bg-th-surface border border-th-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} className="text-blue-500" />
            <span className="text-th-heading font-semibold text-sm">Source Performance</span>
          </div>
          <div className="space-y-2">
            {Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1]).map(([src, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={src} className="flex items-center gap-3">
                  <span className="text-th-body text-xs w-28 shrink-0">{src}</span>
                  <div className="flex-1 h-1.5 bg-th-hover rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-th-heading text-xs font-bold w-6 text-right">{count}</span>
                  <span className="text-th-faint text-[10px] w-9 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-th-surface border border-blue-500/15 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={14} className="text-amber-500" />
          <span className="text-th-heading font-semibold text-sm">Recommendations</span>
        </div>
        <div className="space-y-2">
          {insights.unassigned > 0 && (
            <div className="flex items-start gap-2 text-xs"><ArrowRight size={12} className="text-red-500 shrink-0 mt-0.5" /><span className="text-th-body">Assign {insights.unassigned} unassigned leads immediately — they go cold fast.</span></div>
          )}
          {insights.biggestBottleneck && (
            <div className="flex items-start gap-2 text-xs"><ArrowRight size={12} className="text-orange-500 shrink-0 mt-0.5" /><span className="text-th-body">Focus on {insights.biggestBottleneck[0]} — {insights.biggestBottleneck[1]} leads stuck, ₹{insights.stuckValueByStage[insights.biggestBottleneck[0]] || 0}L at risk.</span></div>
          )}
          {insights.topSource && (
            <div className="flex items-start gap-2 text-xs"><ArrowRight size={12} className="text-blue-500 shrink-0 mt-0.5" /><span className="text-th-body">{insights.topSource[0]} is your top source ({insights.topSource[1]} leads). Invest more here.</span></div>
          )}
          {insights.topOwner && (
            <div className="flex items-start gap-2 text-xs"><ArrowRight size={12} className="text-violet-500 shrink-0 mt-0.5" /><span className="text-th-body">{insights.topOwner[0]} has highest load ({insights.topOwner[1]} leads). Consider redistributing.</span></div>
          )}
          {stats.stuckCount > 0 && (
            <div className="flex items-start gap-2 text-xs"><ArrowRight size={12} className="text-amber-500 shrink-0 mt-0.5" /><span className="text-th-body">{stats.stuckCount} leads stuck ≥7 days. Review daily and assign clear next actions.</span></div>
          )}
        </div>
      </div>
    </div>
  );
}

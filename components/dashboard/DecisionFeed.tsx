'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { RefreshCw } from 'lucide-react';

interface FeedItem {
  type: 'risk' | 'opportunity' | 'action' | 'alert' | 'positive';
  message: string;
  sub?: string;
}

const TYPE_DOT: Record<FeedItem['type'], string> = {
  risk: 'bg-red-400',
  opportunity: 'bg-blue-400',
  action: 'bg-amber-400',
  alert: 'bg-orange-400',
  positive: 'bg-green-400',
};

export default function DecisionFeed() {
  const { stats, leads, actions, lastAnalyzed, refreshAnalysis, dataMode } = useDashboard();

  const signals = useMemo((): FeedItem[] => {
    const list: FeedItem[] = [];

    if (stats.stuckCount > 0) {
      list.push({
        type: 'risk',
        message: `${stats.stuckCount} deals have been inactive for 7+ days`,
        sub: stats.atRiskValue > 0 ? `₹${Math.round(stats.atRiskValue)}L at risk` : undefined,
      });
    }

    const proposals = leads.filter(l =>
      ['Proposal Sent', 'Quotation Sent', 'Quote Sent'].some(s => l.stage.includes(s)) && l.daysInStage >= 2
    );
    if (proposals.length > 0) {
      list.push({
        type: 'alert',
        message: `${proposals.length} pending ${proposals.length === 1 ? 'proposal has' : 'proposals have'} no follow-up`,
        sub: `Oldest: ${Math.max(...proposals.map(p => p.daysInStage))} days`,
      });
    }

    const unassigned = leads.filter(l =>
      (!l.owner || l.owner === 'Unassigned') &&
      !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s))
    );
    if (unassigned.length > 0) {
      list.push({
        type: 'alert',
        message: `${unassigned.length} active ${unassigned.length === 1 ? 'lead is' : 'leads are'} unassigned`,
        sub: 'No follow-up being done',
      });
    }

    if (stats.followUpCount > 0) {
      list.push({
        type: 'action',
        message: `${stats.followUpCount} leads need follow-up today`,
        sub: '3+ days without activity',
      });
    }

    // Source concentration
    const srcEntries = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1]);
    if (srcEntries.length > 0 && stats.total >= 5) {
      const [topSrc, topCnt] = srcEntries[0];
      const pct = Math.round((topCnt / stats.total) * 100);
      if (pct > 50) {
        list.push({
          type: 'alert',
          message: `${pct}% of leads from ${topSrc} — channel concentration risk`,
        });
      }
    }

    // High-intent opportunities
    const highIntent = leads.filter(l =>
      l.probability >= 60 && l.daysInStage >= 3 &&
      !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s))
    );
    if (highIntent.length > 0) {
      list.push({
        type: 'opportunity',
        message: `${highIntent.length} high-intent ${highIntent.length === 1 ? 'lead has' : 'leads have'} gone quiet`,
        sub: 'Close probability ≥60%, no recent activity',
      });
    }

    // Actions completed
    const completed = actions.filter(a => a.status === 'completed');
    if (completed.length > 0) {
      list.push({
        type: 'positive',
        message: `${completed.length} ${completed.length === 1 ? 'action' : 'actions'} completed — good progress`,
      });
    }

    // Positive: healthy funnel
    if (stats.stuckCount === 0 && stats.followUpCount < 3) {
      list.push({
        type: 'positive',
        message: 'Pipeline movement is healthy — no critical delays',
      });
    }

    return list.slice(0, 7);
  }, [stats, leads, actions]);

  const timeStr = lastAnalyzed?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) ?? null;

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-th-heading font-bold text-sm">Business Signals</h2>
        <button
          onClick={refreshAnalysis}
          className="flex items-center gap-1 text-th-faint hover:text-th-muted text-[10px] transition-colors"
          title="Refresh analysis"
        >
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      <div className="space-y-2.5 flex-1">
        {signals.map((s, i) => (
          <div key={i} className="flex items-start gap-2.5 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={`w-1.5 h-1.5 rounded-full mt-[5px] shrink-0 ${TYPE_DOT[s.type]}`} />
            <div className="min-w-0">
              <p className="text-th-body text-xs leading-snug">{s.message}</p>
              {s.sub && <p className="text-th-faint text-[10px] mt-0.5">{s.sub}</p>}
            </div>
          </div>
        ))}

        {signals.length === 0 && (
          <p className="text-th-muted text-xs">No signals yet. Load data to begin analysis.</p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-th-border">
        {timeStr ? (
          <p className="text-th-faint text-[10px]">
            {dataMode === 'demo' ? 'Demo data' : 'Updated from uploaded data'} · {timeStr}
          </p>
        ) : (
          <p className="text-th-faint text-[10px]">Analysis ready</p>
        )}
      </div>
    </div>
  );
}

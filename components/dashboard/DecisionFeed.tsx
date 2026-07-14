'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import type { DecisionFeedEvent } from '@/context/DashboardContext';
import { RefreshCw, CheckCircle2, ArrowRight, Play, XCircle, Database, RotateCcw } from 'lucide-react';

// ─── Signal Pulse ──────────────────────────────────────────────────────────

interface Signal {
  label: string;
  count: number;
  value?: string;
  severity: 'critical' | 'high' | 'medium' | 'positive';
}

const SEVERITY_BAR: Record<Signal['severity'], string> = {
  critical: 'bg-red-500',
  high: 'bg-amber-500',
  medium: 'bg-blue-500',
  positive: 'bg-green-500',
};

const SEVERITY_TEXT: Record<Signal['severity'], string> = {
  critical: 'text-red-400',
  high: 'text-amber-400',
  medium: 'text-blue-400',
  positive: 'text-green-400',
};

const SEVERITY_LABEL: Record<Signal['severity'], string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  positive: 'Healthy',
};

function SignalPulse({ signals }: { signals: Signal[] }) {
  if (signals.length === 0) return (
    <p className="text-th-faint text-xs italic">Load data to see business signals.</p>
  );

  const maxCount = Math.max(...signals.map(s => s.count), 1);

  return (
    <div className="space-y-2">
      {signals.map((s, i) => (
        <div key={i} className="group">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-th-body text-[11px] font-medium leading-none">{s.label}</span>
            <div className="flex items-center gap-1.5">
              {s.value && <span className="text-th-faint text-[10px]">{s.value}</span>}
              <span className={`text-[9px] font-bold ${SEVERITY_TEXT[s.severity]}`}>
                {SEVERITY_LABEL[s.severity]}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-th-hover rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${SEVERITY_BAR[s.severity]}`}
                style={{
                  width: `${Math.max(6, Math.round((s.count / maxCount) * 100))}%`,
                  opacity: 0.85,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            </div>
            <span className="text-th-heading text-[11px] font-bold tabular-nums w-5 text-right">
              {s.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Activity Log ──────────────────────────────────────────────────────────

const EVENT_ICON: Record<DecisionFeedEvent['type'], typeof CheckCircle2> = {
  action_complete: CheckCircle2,
  action_assign: ArrowRight,
  action_start: Play,
  action_dismiss: XCircle,
  data_load: Database,
  refresh: RotateCcw,
};

const EVENT_COLOR: Record<DecisionFeedEvent['type'], string> = {
  action_complete: 'text-green-400',
  action_assign: 'text-violet-400',
  action_start: 'text-amber-400',
  action_dismiss: 'text-th-faint',
  data_load: 'text-blue-400',
  refresh: 'text-th-muted',
};

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function ActivityLog({ events }: { events: DecisionFeedEvent[] }) {
  if (events.length === 0) return (
    <p className="text-th-faint text-[11px] italic">
      Take actions to see your decision history here.
    </p>
  );

  return (
    <div className="space-y-2">
      {events.slice(0, 6).map(evt => {
        const Icon = EVENT_ICON[evt.type];
        const color = EVENT_COLOR[evt.type];
        return (
          <div key={evt.id} className="flex items-start gap-2 animate-fade-up">
            <Icon size={11} className={`${color} shrink-0 mt-0.5`} />
            <div className="min-w-0 flex-1">
              <p className="text-th-body text-[11px] leading-snug">{evt.message}</p>
              {evt.detail && (
                <p className="text-th-faint text-[10px] mt-0.5 leading-snug">{evt.detail}</p>
              )}
            </div>
            <span className="text-th-faint text-[9px] shrink-0 tabular-nums">
              {timeAgo(evt.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function DecisionFeed() {
  const { stats, leads, actions, lastAnalyzed, refreshAnalysis, dataMode, feedEvents } = useDashboard();

  const signals = useMemo((): Signal[] => {
    const list: Signal[] = [];

    if (stats.followUpCount > 0) {
      list.push({
        label: 'Needs follow-up',
        count: stats.followUpCount,
        severity: stats.followUpCount >= 8 ? 'critical' : 'high',
      });
    }

    if (stats.stuckCount > 0) {
      list.push({
        label: 'Inactive 7d+',
        count: stats.stuckCount,
        value: stats.atRiskValue > 0
          ? stats.atRiskValue >= 100
            ? `₹${(stats.atRiskValue / 100).toFixed(1)}Cr at risk`
            : `₹${Math.round(stats.atRiskValue)}L at risk`
          : undefined,
        severity: stats.stuckCount >= 5 ? 'critical' : 'high',
      });
    }

    const proposals = leads.filter(l =>
      ['Proposal Sent', 'Quotation Sent', 'Quote Sent'].some(s => l.stage.includes(s)) && l.daysInStage >= 2
    );
    if (proposals.length > 0) {
      list.push({ label: 'Pending proposals', count: proposals.length, severity: 'high' });
    }

    const unassigned = leads.filter(l =>
      (!l.owner || l.owner === 'Unassigned') &&
      !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s))
    );
    if (unassigned.length > 0) {
      list.push({ label: 'Unassigned leads', count: unassigned.length, severity: 'medium' });
    }

    const highIntent = leads.filter(l =>
      l.probability >= 60 && l.daysInStage >= 3 &&
      !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s))
    );
    if (highIntent.length > 0) {
      list.push({ label: 'High-intent gone quiet', count: highIntent.length, severity: 'high' });
    }

    const completedCount = actions.filter(a => a.status === 'completed').length;
    if (completedCount > 0) {
      list.push({ label: 'Actions completed', count: completedCount, severity: 'positive' });
    }

    if (list.length === 0 && leads.length > 0) {
      list.push({ label: 'No critical issues', count: leads.length, severity: 'positive' });
    }

    return list;
  }, [stats, leads, actions]);

  const timeStr = lastAnalyzed?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) ?? null;

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-5 flex flex-col gap-4">
      {/* Signal Pulse */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-th-heading font-bold text-sm">Signal Pulse</h2>
          <button
            onClick={refreshAnalysis}
            className="flex items-center gap-1 text-th-faint hover:text-th-muted text-[10px] transition-colors"
            title="Refresh analysis"
          >
            <RefreshCw size={10} /> Refresh
          </button>
        </div>
        <SignalPulse signals={signals} />
      </div>

      {/* Divider */}
      <div className="border-t border-th-border" />

      {/* Decision feed */}
      <div>
        <h3 className="text-th-muted text-[11px] font-semibold uppercase tracking-wider mb-2.5">
          Recent Decisions
        </h3>
        <ActivityLog events={feedEvents} />
      </div>

      {/* Footer */}
      <div className="pt-1">
        {timeStr ? (
          <p className="text-th-faint text-[10px]">
            {dataMode === 'demo' ? 'Interactive demo' : 'Updated from uploaded data'} · {timeStr}
          </p>
        ) : (
          <p className="text-th-faint text-[10px]">Analysis ready</p>
        )}
      </div>
    </div>
  );
}

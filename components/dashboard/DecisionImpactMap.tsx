'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

type NodeState = 'healthy' | 'attention' | 'critical' | 'improved' | 'projected';

interface FlowNode {
  id: string;
  label: string;
  sub?: string;
  state: NodeState;
  column: number;
}

const STATE_STYLES: Record<NodeState, { border: string; bg: string; text: string; dot: string }> = {
  healthy: { border: 'border-green-500/40', bg: 'bg-green-500/5', text: 'text-green-400', dot: 'bg-green-400' },
  attention: { border: 'border-amber-500/40', bg: 'bg-amber-500/5', text: 'text-amber-400', dot: 'bg-amber-400' },
  critical: { border: 'border-red-500/40', bg: 'bg-red-500/5', text: 'text-red-400', dot: 'bg-red-400' },
  improved: { border: 'border-blue-500/40', bg: 'bg-blue-500/5', text: 'text-blue-400', dot: 'bg-blue-400' },
  projected: { border: 'border-violet-500/30', bg: 'bg-violet-500/5', text: 'text-violet-400', dot: 'bg-violet-400' },
};

const COL_LABELS = ['Signals', 'Actions', 'KPIs', 'Outcomes'];

function fmt(v: number): string {
  if (v >= 100) return `₹${(v / 100).toFixed(1)}Cr`;
  if (v > 0) return `₹${v}L`;
  return '—';
}

export default function DecisionImpactMap() {
  const { stats, actions, projectedMetrics, leads } = useDashboard();

  const nodes = useMemo((): FlowNode[] => {
    const completedCount = actions.filter(a => a.status === 'completed').length;
    const priorityCount = actions.filter(a => ['recommended', 'assigned', 'in_progress'].includes(a.status)).length;

    const proposals = leads.filter(l =>
      ['Proposal Sent', 'Quotation Sent', 'Quote Sent'].some(s => l.stage.includes(s)) && l.daysInStage >= 2
    );
    const unassigned = leads.filter(l =>
      (!l.owner || l.owner === 'Unassigned') &&
      !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s))
    );

    // Column 0 — Signals
    const signalNodes: FlowNode[] = [];

    if (stats.stuckCount > 0) {
      signalNodes.push({
        id: 'sig-stuck',
        label: `${stats.stuckCount} Inactive`,
        sub: '7+ days',
        state: stats.stuckCount >= 5 ? 'critical' : 'attention',
        column: 0,
      });
    }
    if (stats.followUpCount > 0) {
      signalNodes.push({
        id: 'sig-followup',
        label: `${stats.followUpCount} Follow-ups`,
        sub: 'overdue',
        state: 'attention',
        column: 0,
      });
    }
    if (proposals.length > 0) {
      signalNodes.push({
        id: 'sig-proposals',
        label: `${proposals.length} Proposals`,
        sub: 'no response',
        state: 'attention',
        column: 0,
      });
    }
    if (unassigned.length > 0) {
      signalNodes.push({
        id: 'sig-unassigned',
        label: `${unassigned.length} Unassigned`,
        sub: 'no owner',
        state: 'attention',
        column: 0,
      });
    }
    if (signalNodes.length === 0) {
      signalNodes.push({ id: 'sig-ok', label: 'All clear', state: 'healthy', column: 0 });
    }

    // Column 1 — Actions
    const actionNodes: FlowNode[] = [
      {
        id: 'act-priority',
        label: `${priorityCount} Active`,
        sub: 'actions',
        state: priorityCount > 0 ? 'attention' : 'healthy',
        column: 1,
      },
      {
        id: 'act-completed',
        label: `${completedCount} Done`,
        sub: 'completed',
        state: completedCount > 0 ? 'improved' : 'projected',
        column: 1,
      },
    ];

    // Column 2 — KPIs
    const kpiNodes: FlowNode[] = [
      {
        id: 'kpi-health',
        label: 'Health Score',
        sub: projectedMetrics.healthBoost > 0
          ? `+${projectedMetrics.healthBoost} projected`
          : 'current',
        state: projectedMetrics.healthBoost > 0 ? 'projected' : stats.stuckCount >= 5 ? 'critical' : 'attention',
        column: 2,
      },
      {
        id: 'kpi-risk',
        label: 'Revenue Risk',
        sub: stats.atRiskValue > 0 ? fmt(stats.atRiskValue) : 'none',
        state: stats.atRiskValue > 0
          ? projectedMetrics.recoveredValue > 0 ? 'projected' : 'critical'
          : 'healthy',
        column: 2,
      },
      {
        id: 'kpi-pipeline',
        label: 'Pipeline',
        sub: fmt(stats.pipelineValue),
        state: stats.pipelineValue > 0 ? 'healthy' : 'attention',
        column: 2,
      },
    ];

    // Column 3 — Outcomes
    const outcomeNodes: FlowNode[] = [
      {
        id: 'out-recovery',
        label: projectedMetrics.recoveredValue > 0
          ? `${fmt(projectedMetrics.recoveredValue)} recovered`
          : 'Revenue recovery',
        sub: projectedMetrics.recoveredValue > 0 ? 'simulated impact' : 'pending actions',
        state: projectedMetrics.recoveredValue > 0 ? 'projected' : 'attention',
        column: 3,
      },
      {
        id: 'out-winrate',
        label: projectedMetrics.winRateBoost > 0
          ? `+${projectedMetrics.winRateBoost}% win rate`
          : 'Win rate boost',
        sub: projectedMetrics.winRateBoost > 0 ? 'simulated impact' : 'pending actions',
        state: projectedMetrics.winRateBoost > 0 ? 'projected' : 'attention',
        column: 3,
      },
    ];

    return [...signalNodes, ...actionNodes, ...kpiNodes, ...outcomeNodes];
  }, [stats, actions, projectedMetrics, leads]);

  const byColumn = useMemo(() => {
    const cols: FlowNode[][] = [[], [], [], []];
    for (const n of nodes) cols[n.column]?.push(n);
    return cols;
  }, [nodes]);

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-4 gap-2 flex-wrap">
        <div>
          <h2 className="text-th-heading font-bold text-base leading-none">Decision Impact Map</h2>
          <p className="text-th-faint text-[11px] mt-0.5">How signals drive actions, KPIs, and outcomes</p>
        </div>
        <span className="text-[9px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
          Causal Flow
        </span>
      </div>

      {/* Column header labels */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        {COL_LABELS.map(l => (
          <div key={l} className="text-center text-[9px] font-bold uppercase tracking-widest text-th-faint">{l}</div>
        ))}
      </div>

      {/* Node grid */}
      <div className="grid grid-cols-4 gap-2 relative">
        {/* Connecting arrows — subtle horizontal lines between columns */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-l border-dashed border-th-border/40"
              style={{ left: `${(i / 4) * 100}%` }}
            />
          ))}
        </div>

        {byColumn.map((col, ci) => (
          <div key={ci} className="space-y-2 relative z-10">
            {col.map((node, ni) => {
              const s = STATE_STYLES[node.state];
              return (
                <div
                  key={node.id}
                  className={`border rounded-lg p-2 text-center transition-all duration-500 ${s.border} ${s.bg} animate-fade-up`}
                  style={{ animationDelay: `${(ci * 4 + ni) * 60}ms` }}
                >
                  <div className={`text-[10px] font-bold leading-tight ${s.text}`}>{node.label}</div>
                  {node.sub && <div className="text-th-faint text-[9px] mt-0.5 leading-tight">{node.sub}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 flex-wrap">
        {(Object.entries(STATE_STYLES) as [NodeState, typeof STATE_STYLES[NodeState]][]).map(([state, s]) => (
          <div key={state} className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            <span className="text-[9px] text-th-faint capitalize">{state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

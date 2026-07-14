'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import type { RoleId } from '@/lib/actionTypes';

// ─── Types ─────────────────────────────────────────────────────────────────

type NodeType = 'priority' | 'signal' | 'kpi' | 'action' | 'outcome';
type NodeSeverity = 'critical' | 'high' | 'medium' | 'healthy' | 'projected';

interface CanvasNode {
  id: string;
  type: NodeType;
  label: string;
  value: string;
  sub?: string;
  severity: NodeSeverity;
}

interface CanvasData {
  center: CanvasNode;
  signals: CanvasNode[];
  kpis: CanvasNode[];
  action: CanvasNode | null;
  outcome: CanvasNode | null;
}

// ─── Colors ────────────────────────────────────────────────────────────────

const SEV_BORDER: Record<NodeSeverity, string> = {
  critical:  'border-red-500/50',
  high:      'border-amber-500/50',
  medium:    'border-blue-500/40',
  healthy:   'border-green-500/40',
  projected: 'border-violet-500/40',
};
const SEV_BG: Record<NodeSeverity, string> = {
  critical:  'bg-red-500/8',
  high:      'bg-amber-500/8',
  medium:    'bg-blue-500/8',
  healthy:   'bg-green-500/8',
  projected: 'bg-violet-500/8',
};
const SEV_TEXT: Record<NodeSeverity, string> = {
  critical:  'text-red-400',
  high:      'text-amber-400',
  medium:    'text-blue-400',
  healthy:   'text-green-400',
  projected: 'text-violet-400',
};
const SEV_EDGE: Record<NodeSeverity, string> = {
  critical:  '#ef4444',
  high:      '#f59e0b',
  medium:    '#3b82f6',
  healthy:   '#22c55e',
  projected: '#8b5cf6',
};
const PULSE_GLOW: Record<NodeSeverity, string> = {
  critical:  '0 0 0 0 rgba(239,68,68,0.6)',
  high:      '0 0 0 0 rgba(245,158,11,0.6)',
  medium:    '0 0 0 0 rgba(59,130,246,0.6)',
  healthy:   '0 0 0 0 rgba(34,197,94,0.6)',
  projected: '0 0 0 0 rgba(139,92,246,0.6)',
};

// ─── Data derivation ───────────────────────────────────────────────────────

function fmt(v: number): string {
  if (v >= 100) return `₹${(v / 100).toFixed(1)}Cr`;
  if (v > 0) return `₹${Math.round(v)}L`;
  return '—';
}

function computeHealthScore(stats: ReturnType<typeof useDashboard>['stats'], leads: ReturnType<typeof useDashboard>['leads']): number {
  if (stats.total === 0) return 0;
  const active = Math.max(stats.activeFunnelCount, 1);
  const unassigned = leads.filter(l => !l.owner || l.owner === 'Unassigned').length;
  let penalty = 0;
  penalty += (stats.stuckCount / active) * 35;
  penalty += (stats.followUpCount / active) * 25;
  penalty += (unassigned / Math.max(stats.total, 1)) * 20;
  if (stats.pipelineValue > 0) penalty += (stats.atRiskValue / stats.pipelineValue) * 20;
  return Math.max(0, Math.min(100, Math.round(100 - penalty)));
}

function deriveCanvasData(
  role: RoleId,
  stats: ReturnType<typeof useDashboard>['stats'],
  leads: ReturnType<typeof useDashboard>['leads'],
  actions: ReturnType<typeof useDashboard>['actions'],
  projectedMetrics: ReturnType<typeof useDashboard>['projectedMetrics'],
): CanvasData {
  const healthScore = computeHealthScore(stats, leads);
  const topAction = actions.find(a => a.status !== 'completed' && a.status !== 'dismissed');
  const nextAction = actions.filter(a => a.status !== 'completed' && a.status !== 'dismissed')[1] ?? null;

  // ── CENTER NODE ──
  let center: CanvasNode;
  if (role === 'finance') {
    center = {
      id: 'center', type: 'priority',
      label: 'Revenue at Risk',
      value: stats.atRiskValue > 0 ? fmt(stats.atRiskValue) : '—',
      sub: `${stats.stuckCount} deals stuck`,
      severity: stats.atRiskValue > 0 ? 'critical' : 'healthy',
    };
  } else if (role === 'sales') {
    center = {
      id: 'center', type: 'priority',
      label: 'Active Pipeline',
      value: String(stats.activeFunnelCount),
      sub: stats.hasValues ? fmt(stats.pipelineValue) : `${stats.followUpCount} need follow-up`,
      severity: stats.followUpCount > stats.activeFunnelCount * 0.4 ? 'high' : 'medium',
    };
  } else if (role === 'marketing') {
    const topSrc = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1])[0];
    center = {
      id: 'center', type: 'priority',
      label: 'Top Lead Source',
      value: topSrc ? topSrc[0] : '—',
      sub: topSrc ? `${topSrc[1]} of ${stats.total} leads` : 'No data',
      severity: topSrc && topSrc[1] / stats.total > 0.5 ? 'high' : 'medium',
    };
  } else if (role === 'operations') {
    center = {
      id: 'center', type: 'priority',
      label: 'Pipeline Bottleneck',
      value: String(stats.stuckCount),
      sub: `deals stalled 7+ days`,
      severity: stats.stuckCount >= 5 ? 'critical' : stats.stuckCount > 0 ? 'high' : 'healthy',
    };
  } else {
    // Executive — top priority action or health score
    center = {
      id: 'center', type: 'priority',
      label: topAction ? topAction.title.slice(0, 32) + (topAction.title.length > 32 ? '…' : '') : 'Pipeline Healthy',
      value: topAction
        ? topAction.urgency === 'critical' ? 'Critical' : topAction.urgency === 'high' ? 'High' : 'Medium'
        : `${healthScore}/100`,
      sub: topAction ? topAction.department + ' · ' + topAction.dueDate : 'No issues detected',
      severity: topAction
        ? (topAction.urgency === 'critical' ? 'critical' : topAction.urgency === 'high' ? 'high' : 'medium')
        : 'healthy',
    };
  }

  // ── SIGNALS (left) ──
  const signals: CanvasNode[] = [];
  if (stats.stuckCount > 0) {
    signals.push({
      id: 'sig-stuck', type: 'signal',
      label: 'Inactive 7d+',
      value: String(stats.stuckCount),
      sub: stats.atRiskValue > 0 ? fmt(stats.atRiskValue) + ' at risk' : 'deals stuck',
      severity: stats.stuckCount >= 5 ? 'critical' : 'high',
    });
  }
  if (stats.followUpCount > 0) {
    signals.push({
      id: 'sig-followup', type: 'signal',
      label: 'Follow-up Overdue',
      value: String(stats.followUpCount),
      sub: '3+ days inactive',
      severity: stats.followUpCount > 8 ? 'critical' : 'high',
    });
  }
  const proposals = leads.filter(l =>
    ['Proposal Sent', 'Quotation Sent', 'Quote Sent'].some(s => l.stage.includes(s)) && l.daysInStage >= 2
  );
  if (proposals.length > 0) {
    signals.push({
      id: 'sig-proposals', type: 'signal',
      label: 'Pending Proposals',
      value: String(proposals.length),
      sub: 'no client response',
      severity: 'high',
    });
  }
  if (signals.length === 0) {
    signals.push({ id: 'sig-ok', type: 'signal', label: 'All Signals Clear', value: '✓', severity: 'healthy' });
  }

  // ── KPIs (right) ──
  const completedCount = actions.filter(a => a.status === 'completed').length;
  const kpis: CanvasNode[] = [];

  if (role === 'finance') {
    kpis.push(
      { id: 'kpi-pipeline', type: 'kpi', label: 'Pipeline Value', value: fmt(stats.pipelineValue), severity: 'medium' },
      { id: 'kpi-recovery', type: 'kpi', label: 'Projected Recovery', value: projectedMetrics.recoveredValue > 0 ? fmt(projectedMetrics.recoveredValue) : 'Pending', severity: projectedMetrics.recoveredValue > 0 ? 'projected' : 'medium' },
      { id: 'kpi-actions', type: 'kpi', label: 'Actions Done', value: String(completedCount), sub: `of ${actions.length}`, severity: completedCount > 0 ? 'healthy' : 'medium' },
    );
  } else if (role === 'sales') {
    kpis.push(
      { id: 'kpi-stuck', type: 'kpi', label: 'Stuck Deals', value: String(stats.stuckCount), severity: stats.stuckCount >= 5 ? 'critical' : 'high' },
      { id: 'kpi-health', type: 'kpi', label: 'Business Health', value: `${Math.min(100, healthScore + (projectedMetrics.healthBoost > 0 ? projectedMetrics.healthBoost : 0))}`, sub: projectedMetrics.healthBoost > 0 ? `+${projectedMetrics.healthBoost} projected` : undefined, severity: healthScore >= 70 ? 'healthy' : 'high' },
      { id: 'kpi-completed', type: 'kpi', label: 'Actions Done', value: String(completedCount), severity: completedCount > 0 ? 'healthy' : 'medium' },
    );
  } else {
    kpis.push(
      { id: 'kpi-risk', type: 'kpi', label: 'Revenue at Risk', value: stats.atRiskValue > 0 ? fmt(stats.atRiskValue) : '—', sub: projectedMetrics.recoveredValue > 0 ? `-${fmt(projectedMetrics.recoveredValue)} projected` : undefined, severity: stats.atRiskValue > 0 ? 'critical' : 'healthy' },
      { id: 'kpi-health', type: 'kpi', label: 'Business Health', value: `${healthScore}`, sub: projectedMetrics.healthBoost > 0 ? `+${projectedMetrics.healthBoost} projected` : '/100', severity: healthScore >= 70 ? 'healthy' : healthScore >= 50 ? 'high' : 'critical' },
      { id: 'kpi-pipeline', type: 'kpi', label: 'Pipeline Value', value: fmt(stats.pipelineValue), severity: 'medium' },
    );
  }

  // ── ACTION (bottom center) ──
  let action: CanvasNode | null = null;
  if (topAction) {
    action = {
      id: 'action', type: 'action',
      label: topAction.title.length > 36 ? topAction.title.slice(0, 36) + '…' : topAction.title,
      value: `${topAction.status === 'completed' ? '✓ Done' : topAction.status === 'in_progress' ? '⚡ In Progress' : topAction.status === 'assigned' ? '→ Assigned' : '• Recommended'}`,
      sub: `${topAction.owner} · ${topAction.dueDate}`,
      severity: topAction.status === 'completed' ? 'healthy' : topAction.urgency === 'critical' ? 'critical' : 'high',
    };
  }

  // ── OUTCOME (bottom right) ──
  let outcome: CanvasNode | null = null;
  if (projectedMetrics.recoveredValue > 0 || projectedMetrics.winRateBoost > 0) {
    outcome = {
      id: 'outcome', type: 'outcome',
      label: 'Simulated Impact',
      value: projectedMetrics.recoveredValue > 0 ? `+${fmt(projectedMetrics.recoveredValue)}` : `+${projectedMetrics.winRateBoost}% win rate`,
      sub: `from ${completedCount} completed action${completedCount !== 1 ? 's' : ''}`,
      severity: 'projected',
    };
  } else if (nextAction) {
    outcome = {
      id: 'outcome', type: 'outcome',
      label: 'Next Priority',
      value: nextAction.urgency === 'critical' ? 'Critical' : 'High',
      sub: nextAction.title.slice(0, 28) + (nextAction.title.length > 28 ? '…' : ''),
      severity: nextAction.urgency === 'critical' ? 'critical' : 'high',
    };
  }

  return {
    center,
    signals: signals.slice(0, 3),
    kpis: kpis.slice(0, 3),
    action,
    outcome,
  };
}

// ─── SVG path helpers ──────────────────────────────────────────────────────

function curvePath(x1: number, y1: number, x2: number, y2: number): string {
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  // Pull the control point slightly toward center-y for smooth S-curve
  const ctrlX = cx;
  const ctrlY = y1 === y2 ? y1 - 30 : cy;
  return `M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`;
}

// ─── Node Component ────────────────────────────────────────────────────────

function CanvasNodeCard({
  node, isCenter, animClass, pulsing,
}: {
  node: CanvasNode;
  isCenter?: boolean;
  animClass?: string;
  pulsing?: boolean;
}) {
  const borderClass = SEV_BORDER[node.severity];
  const bgClass = SEV_BG[node.severity];
  const textClass = SEV_TEXT[node.severity];
  const typeLabels: Record<NodeType, string> = {
    priority: 'TOP PRIORITY',
    signal: 'SIGNAL',
    kpi: 'KPI',
    action: 'ACTION',
    outcome: 'OUTCOME',
  };

  return (
    <div
      className={`
        rounded-xl border transition-all duration-500 select-none
        ${borderClass} ${bgClass}
        ${isCenter ? 'p-3.5' : 'p-2.5'}
        ${animClass ?? ''}
        ${pulsing ? 'ring-2 ring-offset-1 ring-offset-transparent' : ''}
      `}
      style={pulsing ? {
        animation: node.severity === 'critical' ? 'nodePulseRed 0.7s ease-out'
          : node.severity === 'healthy' ? 'nodePulseGreen 0.8s ease-out'
          : 'nodePulse 0.7s ease-out',
      } : undefined}
    >
      <div className="text-[8px] font-bold uppercase tracking-widest text-th-faint/70 mb-1">
        {typeLabels[node.type]}
      </div>
      <div className={`font-black leading-none ${textClass} ${isCenter ? 'text-xl mb-1' : 'text-base mb-0.5'}`}>
        {node.value}
      </div>
      <div className="text-th-body text-[10px] font-medium leading-tight">{node.label}</div>
      {node.sub && (
        <div className="text-th-faint text-[9px] mt-0.5 leading-tight">{node.sub}</div>
      )}
    </div>
  );
}

// ─── Mobile vertical flow ──────────────────────────────────────────────────

function MobileFlow({ data, pulsing }: { data: CanvasData; pulsing: boolean }) {
  const nodes = [
    data.center,
    data.signals[0],
    data.action,
    data.kpis[0],
    data.outcome,
  ].filter(Boolean) as CanvasNode[];

  return (
    <div className="flex flex-col items-center gap-0 py-2">
      {nodes.map((node, i) => (
        <div key={node.id} className="w-full max-w-[280px] flex flex-col items-center">
          <div
            className="w-full animate-node-enter"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <CanvasNodeCard
              node={node}
              isCenter={node.type === 'priority'}
              pulsing={pulsing && (node.type === 'kpi' || node.type === 'outcome')}
            />
          </div>
          {i < nodes.length - 1 && (
            <div className="flex flex-col items-center my-1">
              <div
                className="w-px bg-th-border animate-fade-in"
                style={{ height: 20, animationDelay: `${i * 80 + 40}ms` }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full bg-th-faint animate-fade-in"
                style={{ animationDelay: `${i * 80 + 60}ms` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Canvas Component ─────────────────────────────────────────────────

export default function LivingDecisionCanvas() {
  const { stats, leads, actions, role, projectedMetrics, ripple } = useDashboard();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [pulsing, setPulsing] = useState(false);
  const [pulsingNodes, setPulsingNodes] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Ripple effect: when an action changes state
  useEffect(() => {
    if (!ripple) return;
    setPulsing(true);
    const affected = new Set<string>();
    if (ripple.targetType === 'risk') affected.add('kpi-risk').add('outcome');
    else if (ripple.targetType === 'health') affected.add('kpi-health').add('outcome');
    else if (ripple.targetType === 'pipeline') affected.add('kpi-pipeline');
    else { affected.add('kpi-health'); affected.add('kpi-risk'); }
    setPulsingNodes(affected);

    const t1 = setTimeout(() => setPulsing(false), 800);
    const t2 = setTimeout(() => setPulsingNodes(new Set()), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ripple?.timestamp]);

  const data = useMemo(() =>
    deriveCanvasData(role, stats, leads, actions, projectedMetrics),
    [role, stats, leads, actions, projectedMetrics]
  );

  const isEmpty = stats.total === 0;

  // ── Fixed layout positions for desktop canvas ──
  // Container: 860 wide, 380 tall (viewBox units)
  const VW = 860;
  const VH = 370;
  const CX = VW / 2;         // center x
  const CY = 155;             // center y
  const SIG_X = 85;           // signal column x (center of node)
  const KPI_X = VW - 85;      // kpi column x
  const ACT_Y = 300;          // action/outcome row y

  // Signal y-positions (up to 3, evenly spaced)
  const sigYs = data.signals.length === 1 ? [CY]
    : data.signals.length === 2 ? [CY - 65, CY + 65]
    : [CY - 90, CY, CY + 90];

  // KPI y-positions
  const kpiYs = data.kpis.length === 1 ? [CY]
    : data.kpis.length === 2 ? [CY - 65, CY + 65]
    : [CY - 90, CY, CY + 90];

  // Path endpoints (approximating node edge touches)
  const NODE_R = 42; // visual half-width
  const CTR_R = 70;  // center node visual half-width

  if (!mounted) return null;

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div>
          <h2 className="text-th-heading font-bold text-sm leading-none">Decision Canvas</h2>
          <p className="text-th-faint text-[10px] mt-0.5">
            {isEmpty ? 'Load data to see live decision flow' : 'Signal → Priority → Action → Outcome'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {ripple && (
            <span className="text-[10px] text-green-400 font-semibold animate-fade-in">
              ↻ Updating…
            </span>
          )}
          <span className="text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
            {isEmpty ? 'Demo' : 'Interactive demo'}
          </span>
        </div>
      </div>

      {isEmpty ? (
        <EmptyCanvas />
      ) : (
        <>
          {/* ── Desktop: SVG + HTML hybrid canvas ── */}
          <div className="hidden md:block relative" style={{ height: VH }}>
            {/* SVG layer (paths behind nodes) */}
            <svg
              ref={svgRef}
              viewBox={`0 0 ${VW} ${VH}`}
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden
            >
              <defs>
                {data.signals.map((s, i) => (
                  <marker key={`m-s${i}`} id={`arr-s${i}`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth={6} markerHeight={6} orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6 z" fill={SEV_EDGE[s.severity]} opacity={0.5} />
                  </marker>
                ))}
                {data.kpis.map((k, i) => (
                  <marker key={`m-k${i}`} id={`arr-k${i}`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth={6} markerHeight={6} orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6 z" fill={SEV_EDGE[k.severity]} opacity={0.5} />
                  </marker>
                ))}
              </defs>

              {/* Signal → Center paths */}
              {data.signals.map((sig, i) => {
                const x1 = SIG_X + NODE_R;
                const y1 = sigYs[i];
                const x2 = CX - CTR_R;
                const y2 = CY;
                return (
                  <g key={`sp-${i}`}>
                    <path
                      d={curvePath(x1, y1, x2, y2)}
                      stroke={SEV_EDGE[sig.severity]}
                      strokeWidth={1.5}
                      fill="none"
                      opacity={0.25}
                      strokeDasharray="4 6"
                    />
                    {/* Reveal path */}
                    <path
                      d={curvePath(x1, y1, x2, y2)}
                      stroke={SEV_EDGE[sig.severity]}
                      strokeWidth={2}
                      fill="none"
                      opacity={0}
                      className="animate-path-reveal"
                      style={{
                        '--path-length': '300',
                        animationDelay: `${i * 120 + 200}ms`,
                      } as React.CSSProperties}
                    />
                    {/* Pulse when ripple fires */}
                    {pulsing && (
                      <path
                        key={`sp-pulse-${i}-${ripple?.timestamp}`}
                        d={curvePath(x1, y1, x2, y2)}
                        stroke={SEV_EDGE[sig.severity]}
                        strokeWidth={3}
                        fill="none"
                        className="animate-path-pulse"
                        style={{ '--path-length': '300' } as React.CSSProperties}
                      />
                    )}
                  </g>
                );
              })}

              {/* Center → KPI paths */}
              {data.kpis.map((kpi, i) => {
                const x1 = CX + CTR_R;
                const y1 = CY;
                const x2 = KPI_X - NODE_R;
                const y2 = kpiYs[i];
                return (
                  <g key={`kp-${i}`}>
                    <path
                      d={curvePath(x1, y1, x2, y2)}
                      stroke={SEV_EDGE[kpi.severity]}
                      strokeWidth={1.5}
                      fill="none"
                      opacity={0.2}
                      strokeDasharray="4 6"
                    />
                    <path
                      d={curvePath(x1, y1, x2, y2)}
                      stroke={SEV_EDGE[kpi.severity]}
                      strokeWidth={2}
                      fill="none"
                      opacity={0}
                      className="animate-path-reveal"
                      style={{
                        '--path-length': '300',
                        animationDelay: `${i * 120 + 400}ms`,
                      } as React.CSSProperties}
                    />
                    {/* Ripple pulse to KPI */}
                    {pulsing && pulsingNodes.has(kpi.id) && (
                      <path
                        key={`kp-pulse-${i}-${ripple?.timestamp}`}
                        d={curvePath(x1, y1, x2, y2)}
                        stroke="#22c55e"
                        strokeWidth={3}
                        fill="none"
                        className="animate-path-pulse"
                        style={{ '--path-length': '300' } as React.CSSProperties}
                      />
                    )}
                  </g>
                );
              })}

              {/* Center → Action path */}
              {data.action && (
                <g>
                  <line
                    x1={CX} y1={CY + CTR_R}
                    x2={CX} y2={ACT_Y - 40}
                    stroke="var(--th-faint)"
                    strokeWidth={1.5}
                    strokeDasharray="3 5"
                    opacity={0.4}
                  />
                  <path
                    d={`M ${CX} ${CY + CTR_R} L ${CX} ${ACT_Y - 40}`}
                    stroke={SEV_EDGE[data.action.severity]}
                    strokeWidth={2}
                    fill="none"
                    opacity={0}
                    className="animate-path-reveal"
                    style={{ '--path-length': '120', animationDelay: '600ms' } as React.CSSProperties}
                  />
                </g>
              )}

              {/* Action → Outcome path */}
              {data.action && data.outcome && (
                <path
                  d={curvePath(CX + 90, ACT_Y, KPI_X - NODE_R - 20, ACT_Y)}
                  stroke={SEV_EDGE[data.outcome.severity]}
                  strokeWidth={1.5}
                  fill="none"
                  opacity={0.3}
                  strokeDasharray="3 5"
                />
              )}
            </svg>

            {/* HTML node layer (positioned absolutely) */}
            {/* Signal nodes */}
            {data.signals.map((sig, i) => (
              <div
                key={sig.id}
                className="absolute animate-node-enter"
                style={{
                  left: `${(SIG_X / VW) * 100}%`,
                  top: `${(sigYs[i] / VH) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${(NODE_R * 2 + 28) / VW * 100}%`,
                  minWidth: 108,
                  animationDelay: `${i * 100 + 100}ms`,
                  transition: 'top 0.6s ease, left 0.6s ease',
                }}
              >
                <CanvasNodeCard node={sig} />
              </div>
            ))}

            {/* Center node */}
            <div
              className="absolute animate-node-enter"
              style={{
                left: '50%',
                top: `${(CY / VH) * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: `${(CTR_R * 2 + 40) / VW * 100}%`,
                minWidth: 180,
                animationDelay: '60ms',
                transition: 'top 0.6s ease',
              }}
            >
              <CanvasNodeCard
                node={data.center}
                isCenter
                pulsing={pulsing}
              />
            </div>

            {/* KPI nodes */}
            {data.kpis.map((kpi, i) => (
              <div
                key={kpi.id}
                className="absolute animate-node-enter"
                style={{
                  left: `${(KPI_X / VW) * 100}%`,
                  top: `${(kpiYs[i] / VH) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${(NODE_R * 2 + 28) / VW * 100}%`,
                  minWidth: 108,
                  animationDelay: `${i * 100 + 300}ms`,
                  transition: 'top 0.6s ease',
                }}
              >
                <CanvasNodeCard
                  node={kpi}
                  pulsing={pulsingNodes.has(kpi.id)}
                />
              </div>
            ))}

            {/* Action node */}
            {data.action && (
              <div
                className="absolute animate-node-enter"
                style={{
                  left: '50%',
                  top: `${(ACT_Y / VH) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '26%',
                  minWidth: 180,
                  animationDelay: '500ms',
                  transition: 'top 0.6s ease',
                }}
              >
                <CanvasNodeCard node={data.action} />
              </div>
            )}

            {/* Outcome node */}
            {data.outcome && (
              <div
                className="absolute animate-node-enter"
                style={{
                  left: `${(KPI_X / VW) * 100}%`,
                  top: `${(ACT_Y / VH) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${(NODE_R * 2 + 28) / VW * 100}%`,
                  minWidth: 108,
                  animationDelay: '700ms',
                  transition: 'top 0.6s ease',
                }}
              >
                <CanvasNodeCard
                  node={data.outcome}
                  pulsing={pulsingNodes.has('outcome')}
                />
              </div>
            )}
          </div>

          {/* ── Mobile: vertical causal flow ── */}
          <div className="md:hidden">
            <MobileFlow data={data} pulsing={pulsing} />
          </div>
        </>
      )}

      {/* Demo label */}
      {!isEmpty && (
        <p className="text-th-faint text-[9px] text-center mt-2">
          Interactive demo · completing actions updates KPIs above
        </p>
      )}
    </div>
  );
}

function EmptyCanvas() {
  const steps = [
    { label: 'Signal', color: 'border-red-500/30 text-red-400' },
    { label: 'Priority', color: 'border-amber-500/30 text-amber-400' },
    { label: 'Action', color: 'border-blue-500/30 text-blue-400' },
    { label: 'Outcome', color: 'border-green-500/30 text-green-400' },
  ];
  return (
    <div className="flex items-center justify-center gap-2 py-8 flex-wrap">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
          <div className={`border rounded-lg px-3 py-2 text-[11px] font-semibold ${s.color} bg-th-hover/50 animate-node-enter`} style={{ animationDelay: `${i * 120}ms` }}>
            {s.label}
          </div>
          {i < steps.length - 1 && <span className="text-th-faint text-xs animate-fade-in" style={{ animationDelay: `${i * 120 + 60}ms` }}>→</span>}
        </div>
      ))}
      <p className="w-full text-center text-th-faint text-[11px] mt-2">Load sample data to see the living decision canvas</p>
    </div>
  );
}

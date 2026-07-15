'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react';

// ─── Slope chart: 3-point visual (Before → Current → Projected) ───────────

interface SlopePoint {
  label: string;
  value: number;
  color: string;
  isSimulated?: boolean;
}

interface SlopeMetric {
  title: string;
  points: [SlopePoint, SlopePoint, SlopePoint];
  unit: string;
  higherIsBetter: boolean;
}

function SlopeChart({ metric }: { metric: SlopeMetric }) {
  const vals = metric.points.map(p => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  const WIDTH = 180;
  const HEIGHT = 60;
  const PADDING = { top: 8, bottom: 8, left: 8, right: 8 };
  const INNER_W = WIDTH - PADDING.left - PADDING.right;
  const INNER_H = HEIGHT - PADDING.top - PADDING.bottom;
  const xs = [0, INNER_W / 2, INNER_W];

  function yOf(v: number) {
    // invert: higher value should be higher on canvas only if higherIsBetter
    const norm = (v - min) / range;
    return metric.higherIsBetter
      ? INNER_H * (1 - norm)
      : INNER_H * norm;
  }

  const pts = metric.points.map((p, i) => ({ ...p, cx: xs[i], cy: yOf(p.value) }));

  return (
    <div>
      <div className="text-th-muted text-[10px] font-medium mb-1">{metric.title}</div>
      <div className="flex items-end gap-3">
        <svg
          width={WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          style={{ overflow: 'visible' }}
          aria-hidden
        >
          <g transform={`translate(${PADDING.left},${PADDING.top})`}>
            {/* Lines between points */}
            {pts.slice(0, -1).map((p, i) => {
              const next = pts[i + 1];
              return (
                <line
                  key={i}
                  x1={p.cx} y1={p.cy}
                  x2={next.cx} y2={next.cy}
                  stroke={next.isSimulated ? '#8b5cf6' : next.color}
                  strokeWidth={1.5}
                  strokeDasharray={next.isSimulated ? '3 2' : undefined}
                  opacity={0.7}
                />
              );
            })}
            {/* Dots */}
            {pts.map((p, i) => (
              <circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={3.5}
                fill={p.isSimulated ? '#8b5cf6' : p.color}
                opacity={p.isSimulated ? 0.8 : 1}
              />
            ))}
          </g>
        </svg>

        {/* Value labels beside chart */}
        <div className="flex gap-3">
          {pts.map((p, i) => (
            <div key={i} className="text-center min-w-[36px]">
              <div
                className="text-sm font-black leading-none"
                style={{ color: p.isSimulated ? '#8b5cf6' : p.color }}
              >
                {p.value}{metric.unit}
              </div>
              <div className="text-[9px] text-th-faint mt-0.5">{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Progress bar metric (existing style for live/actions) ─────────────────

interface BarMetric {
  label: string;
  beforeLabel: string;
  afterLabel: string;
  beforePct: number;
  afterPct: number;
  higherIsBetter: boolean;
  isLive?: boolean;
}

function MetricRow({ metric }: { metric: BarMetric }) {
  const barBefore = metric.higherIsBetter ? metric.beforePct : 100 - metric.beforePct;
  const barAfter = metric.isLive
    ? metric.afterPct
    : metric.higherIsBetter ? metric.afterPct : 100 - metric.afterPct;

  return (
    <div className="bg-th-hover rounded-lg px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-th-muted text-xs font-medium">{metric.label}</span>
        {metric.isLive ? (
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 text-sm font-semibold tabular-nums">{metric.beforeLabel}</span>
            <span className="text-th-faint text-xs mx-0.5">→</span>
            <span className="text-green-400 text-sm font-semibold tabular-nums">{metric.afterLabel}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-red-400 text-sm font-semibold tabular-nums">{metric.beforeLabel}</span>
            <span className="text-th-faint text-xs mx-0.5">→</span>
            <span className="text-green-400 text-sm font-semibold tabular-nums">{metric.afterLabel}</span>
            {metric.higherIsBetter
              ? <TrendingUp size={12} className="text-green-400 ml-0.5" />
              : <TrendingDown size={12} className="text-green-400 ml-0.5" />
            }
          </div>
        )}
      </div>

      <div className="h-1.5 bg-th-surface rounded-full overflow-hidden relative">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${barAfter}%`,
            background: 'linear-gradient(90deg, #ef4444 0%, #22c55e 100%)',
            opacity: 0.25,
          }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-red-500/50 rounded-full transition-all duration-700"
          style={{ width: `${barBefore}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-green-500 rounded-full transition-all duration-700"
          style={{ width: `${barAfter}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function OutcomeComparison() {
  const { stats, actions, dataMode, projectedMetrics } = useDashboard();
  const { activeFunnelCount, followUpCount, atRiskValue, pipelineValue, byStage, total } = stats;

  const completedCount = useMemo(
    () => actions.filter(a => a.status === 'completed').length,
    [actions]
  );

  const before = useMemo(() => {
    const followUpDelay =
      followUpCount > 0
        ? Math.round((followUpCount / Math.max(activeFunnelCount, 1)) * 8 + 3)
        : 3;

    const wonCount = byStage
      .filter(r => r.stage.includes('Complet') || r.stage.includes('Won'))
      .reduce((s, r) => s + r.count, 0);
    const conversionRate =
      total > 0 ? Math.round((wonCount / total) * 1000) / 10 : 0;

    return { followUpDelay, revenueAtRisk: atRiskValue, conversionRate };
  }, [followUpCount, activeFunnelCount, atRiskValue, byStage, total]);

  const after = useMemo(() => ({
    followUpDelay: Math.round(Math.max(1.5, before.followUpDelay - 4.2) * 10) / 10,
    revenueAtRisk: Math.round(before.revenueAtRisk * 0.38),
    conversionRate: Math.round(Math.min(45, before.conversionRate + 5.2) * 10) / 10,
  }), [before]);

  const current = useMemo(() => ({
    followUpDelay: Math.round(Math.max(before.followUpDelay - 1.5, before.followUpDelay * 0.8) * 10) / 10,
    revenueAtRisk: Math.round(before.revenueAtRisk - projectedMetrics.recoveredValue),
    conversionRate: Math.round(Math.min(before.conversionRate + projectedMetrics.winRateBoost, 45) * 10) / 10,
  }), [before, projectedMetrics]);

  const showRevenue = atRiskValue > 0 || pipelineValue > 0;
  const actionsPct = actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0;
  const hasProgress = completedCount > 0;

  const actionsMetric: BarMetric = {
    label: 'Actions Complete',
    beforeLabel: `${completedCount} done`,
    afterLabel: `${actions.length} total`,
    beforePct: 0,
    afterPct: actionsPct,
    higherIsBetter: true,
    isLive: true,
  };

  if (activeFunnelCount === 0 && dataMode === 'live') {
    return (
      <div className="bg-th-surface border border-th-border rounded-xl p-5">
        <h2 className="text-th-heading font-bold text-base mb-1">Outcome Tracking</h2>
        <p className="text-th-muted text-xs">Upload lead data to start tracking outcomes.</p>
      </div>
    );
  }

  if (dataMode === 'live') {
    return (
      <div className="bg-th-surface border border-th-border rounded-xl p-5">
        <div className="mb-4">
          <h2 className="text-th-heading font-bold text-base">Outcome Tracking</h2>
          <p className="text-th-muted text-xs mt-0.5">
            Outcome tracking starts after actions are completed and the next dataset is analysed.
          </p>
        </div>
        <div className="space-y-2">
          <MetricRow metric={actionsMetric} />
        </div>
        {completedCount > 0 && (
          <div className="flex items-center gap-1.5 mt-3 text-green-400 text-xs">
            <CheckCircle2 size={12} />
            <span>{completedCount} of {actions.length} actions completed</span>
          </div>
        )}
      </div>
    );
  }

  // Demo mode — Outcome Story with slope charts
  const fmtRisk = (v: number) => v >= 100 ? `₹${(v / 100).toFixed(1)}Cr` : `₹${v}L`;

  const slopeMetrics: SlopeMetric[] = [
    {
      title: 'Follow-up Delay',
      unit: 'd',
      higherIsBetter: false,
      points: [
        { label: 'Before', value: before.followUpDelay, color: '#ef4444' },
        { label: 'Current', value: current.followUpDelay, color: '#f59e0b', isSimulated: false },
        { label: 'Projected', value: after.followUpDelay, color: '#22c55e', isSimulated: true },
      ],
    },
    ...(before.conversionRate > 0 ? [{
      title: 'Win Rate',
      unit: '%',
      higherIsBetter: true,
      points: [
        { label: 'Before', value: before.conversionRate, color: '#ef4444' },
        { label: 'Current', value: current.conversionRate, color: '#f59e0b', isSimulated: false },
        { label: 'Projected', value: after.conversionRate, color: '#22c55e', isSimulated: true },
      ] as [SlopePoint, SlopePoint, SlopePoint],
    } as SlopeMetric] : []),
  ];

  const barMetrics: BarMetric[] = [
    {
      label: 'Follow-up Delay',
      beforeLabel: `${before.followUpDelay}d avg`,
      afterLabel: `${after.followUpDelay}d avg`,
      beforePct: Math.min(100, (before.followUpDelay / 14) * 100),
      afterPct: Math.min(100, (after.followUpDelay / 14) * 100),
      higherIsBetter: false,
    },
    ...(showRevenue
      ? [{
          label: 'Revenue at Risk',
          beforeLabel: fmtRisk(Math.round(before.revenueAtRisk)),
          afterLabel: fmtRisk(Math.round(after.revenueAtRisk)),
          beforePct: pipelineValue > 0 ? Math.min(100, Math.round((before.revenueAtRisk / pipelineValue) * 100)) : 60,
          afterPct: pipelineValue > 0 ? Math.min(100, Math.round((after.revenueAtRisk / pipelineValue) * 100)) : 23,
          higherIsBetter: false,
        } satisfies BarMetric]
      : []),
    {
      label: 'Win Rate',
      beforeLabel: `${before.conversionRate}%`,
      afterLabel: `${after.conversionRate}%`,
      beforePct: before.conversionRate,
      afterPct: after.conversionRate,
      higherIsBetter: true,
    },
  ];

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-1 gap-2 flex-wrap">
        <h2 className="text-th-heading font-bold text-base">Outcome Story</h2>
        <span className="text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
          Demo Projection
        </span>
      </div>
      <p className="text-th-muted text-xs mb-4">Before → Current → Projected after completing all actions</p>

      {/* Slope charts */}
      {hasProgress && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-3 bg-th-hover rounded-xl">
          <div className="text-[10px] font-bold text-th-faint uppercase tracking-wider mb-1 col-span-full">
            Simulated Impact · {completedCount} action{completedCount !== 1 ? 's' : ''} completed
          </div>
          {slopeMetrics.map(m => (
            <SlopeChart key={m.title} metric={m} />
          ))}
          {showRevenue && projectedMetrics.recoveredValue > 0 && (
            <div>
              <div className="text-th-muted text-[10px] font-medium mb-1">Revenue at Risk</div>
              <div className="flex items-baseline gap-2">
                <span className="text-red-400 text-sm font-black">{fmtRisk(Math.round(before.revenueAtRisk))}</span>
                <span className="text-th-faint text-xs">→</span>
                <span className="text-amber-400 text-sm font-black">{fmtRisk(Math.round(current.revenueAtRisk))}</span>
                <span className="text-th-faint text-xs">→</span>
                <span className="text-violet-400 text-sm font-black">{fmtRisk(Math.round(after.revenueAtRisk))}</span>
              </div>
              <div className="flex gap-2 mt-0.5 text-[9px] text-th-faint">
                <span>Before</span><span>Current</span><span>Projected</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress bar metrics */}
      <div className="space-y-2">
        {barMetrics.map(m => <MetricRow key={m.label} metric={m} />)}
        <MetricRow metric={actionsMetric} />
      </div>

      <p className="text-th-faint text-[10px] mt-3 leading-relaxed">
        Projections are estimates based on completing all recommended actions. Dashed lines indicate simulated impact. Actual results depend on execution.
      </p>
    </div>
  );
}

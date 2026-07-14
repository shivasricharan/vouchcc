'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react';

interface Metric {
  label: string;
  beforeLabel: string;
  afterLabel: string;
  beforePct: number;
  afterPct: number;
  higherIsBetter: boolean;
  isLive?: boolean;
}

function MetricRow({ metric }: { metric: Metric }) {
  const barBefore = metric.higherIsBetter ? metric.beforePct : 100 - metric.beforePct;
  const barAfter = metric.higherIsBetter ? metric.afterPct : 100 - metric.afterPct;

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

export default function OutcomeComparison() {
  const { stats, actions, dataMode } = useDashboard();
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

  const showRevenue = atRiskValue > 0 || pipelineValue > 0;

  const revenueBeforeL = Math.round(before.revenueAtRisk);
  const revenueAfterL = Math.round(after.revenueAtRisk);

  const actionsPct = actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0;
  const actionsAfterPct = 100;

  const metrics: Metric[] = [
    {
      label: 'Follow-up Delay',
      beforeLabel: `${before.followUpDelay}d avg`,
      afterLabel: `${after.followUpDelay}d avg`,
      beforePct: Math.min(100, (before.followUpDelay / 14) * 100),
      afterPct: Math.min(100, (after.followUpDelay / 14) * 100),
      higherIsBetter: false,
    },
    ...(showRevenue
      ? [
          {
            label: 'Revenue at Risk',
            beforeLabel: revenueBeforeL >= 100 ? `₹${(revenueBeforeL/100).toFixed(1)}Cr` : `₹${revenueBeforeL}L`,
            afterLabel: revenueAfterL >= 100 ? `₹${(revenueAfterL/100).toFixed(1)}Cr` : `₹${revenueAfterL}L`,
            beforePct: pipelineValue > 0 ? Math.min(100, Math.round((before.revenueAtRisk / pipelineValue) * 100)) : 60,
            afterPct: pipelineValue > 0 ? Math.min(100, Math.round((after.revenueAtRisk / pipelineValue) * 100)) : 23,
            higherIsBetter: false,
          } satisfies Metric,
        ]
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

  const actionsMetric: Metric = {
    label: 'Actions Complete',
    beforeLabel: `${completedCount} done`,
    afterLabel: `${actions.length} total`,
    beforePct: actionsPct,
    afterPct: actionsAfterPct,
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

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-1 gap-2 flex-wrap">
        <h2 className="text-th-heading font-bold text-base">Outcome Tracking</h2>
        <span className="text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
          Demo Projection
        </span>
      </div>
      <p className="text-th-muted text-xs mb-4">Did actions improve outcomes?</p>

      <div className="space-y-2">
        {metrics.map(m => (
          <MetricRow key={m.label} metric={m} />
        ))}
        <MetricRow metric={actionsMetric} />
      </div>

      <p className="text-th-faint text-[10px] mt-3 leading-relaxed">
        Projections are estimates based on completing all recommended actions. Actual results depend on execution.
      </p>
    </div>
  );
}

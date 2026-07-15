'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import BusinessHealthScore from './BusinessHealthScore';

function fmt(v: number): string {
  if (v >= 100) return `₹${(v / 100).toFixed(1)}Cr`;
  return `₹${Math.round(v)}L`;
}

interface MetricProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  dot?: string;
  delay?: string;
  delta?: string;
  deltaColor?: string;
}

function Metric({ label, value, sub, color = 'text-th-heading', dot, delay = '', delta, deltaColor }: MetricProps) {
  return (
    <div className={`animate-fade-up ${delay}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {dot && <div className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />}
        <span className="text-th-muted text-[11px] font-medium leading-tight">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <div className={`text-2xl font-black leading-none ${color}`}>{value}</div>
        {delta && (
          <span className={`text-[10px] font-semibold ${deltaColor ?? 'text-green-400'} transition-all duration-500`}>
            {delta}
          </span>
        )}
      </div>
      {sub && <div className="text-th-faint text-[10px] mt-0.5">{sub}</div>}
    </div>
  );
}

export default function ExecutiveSummary() {
  const { stats, actions, role, projectedMetrics } = useDashboard();

  const priorityActions = actions.filter(a => a.status === 'recommended' || a.status === 'assigned' || a.status === 'in_progress');
  const completedActions = actions.filter(a => a.status === 'completed');
  const hasProjection = projectedMetrics.recoveredValue > 0 || projectedMetrics.healthBoost > 0;

  const metrics = useMemo(() => {
    const recVal = projectedMetrics.recoveredValue;
    const riskDelta = hasProjection && stats.atRiskValue > 0
      ? `-${recVal >= 100 ? `₹${(recVal / 100).toFixed(1)}Cr` : `₹${recVal}L`} projected`
      : undefined;
    const healthDelta = hasProjection && projectedMetrics.healthBoost > 0
      ? `+${projectedMetrics.healthBoost} projected`
      : undefined;
    const winDelta = hasProjection && projectedMetrics.winRateBoost > 0
      ? `+${projectedMetrics.winRateBoost}% projected`
      : undefined;

    if (role === 'finance') {
      return [
        { label: 'Pipeline Value', value: stats.hasValues ? fmt(stats.pipelineValue) : String(stats.activeFunnelCount), sub: 'total active value', color: 'text-blue-500', dot: 'bg-blue-400' },
        { label: 'Revenue at Risk', value: stats.hasValues && stats.atRiskValue > 0 ? fmt(stats.atRiskValue) : String(stats.stuckCount), sub: 'stuck 7+ days', color: 'text-red-500', dot: 'bg-red-400', delta: riskDelta, deltaColor: 'text-green-400' },
        { label: 'Stuck Deals', value: String(stats.stuckCount), sub: 'need decisions', color: 'text-amber-500', dot: 'bg-amber-400' },
        { label: 'Active Opportunities', value: String(stats.activeFunnelCount), sub: 'in pipeline', color: 'text-green-500', dot: 'bg-green-400' },
        { label: 'Priority Actions', value: String(priorityActions.length), sub: 'finance-related', color: 'text-violet-500', dot: 'bg-violet-400' },
      ];
    }
    if (role === 'marketing') {
      const sources = Object.keys(stats.sourceCounts).length;
      const topSrc = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1])[0];
      return [
        { label: 'Total Leads', value: String(stats.total), sub: 'all sources', color: 'text-blue-500', dot: 'bg-blue-400' },
        { label: 'Top Source', value: topSrc ? topSrc[0] : '—', sub: topSrc ? `${topSrc[1]} leads` : 'no data', color: 'text-violet-500', dot: 'bg-violet-400' },
        { label: 'Active Sources', value: String(sources), sub: 'lead channels', color: 'text-green-500', dot: 'bg-green-400' },
        { label: 'Follow-up Needed', value: String(stats.followUpCount), sub: '3+ days inactive', color: 'text-amber-500', dot: 'bg-amber-400' },
        { label: 'Actions Pending', value: String(priorityActions.filter(a => a.department === 'Marketing').length), sub: 'marketing actions', color: 'text-red-500', dot: 'bg-red-400' },
      ];
    }
    if (role === 'sales') {
      return [
        { label: 'Active Pipeline', value: String(stats.activeFunnelCount), sub: 'opportunities', color: 'text-blue-500', dot: 'bg-blue-400' },
        { label: 'Pipeline Value', value: stats.hasValues ? fmt(stats.pipelineValue) : String(stats.activeFunnelCount), sub: 'estimated total', color: 'text-green-500', dot: 'bg-green-400' },
        { label: 'Need Follow-up', value: String(stats.followUpCount), sub: '3+ days without activity', color: 'text-amber-500', dot: 'bg-amber-400', delta: winDelta, deltaColor: 'text-green-400' },
        { label: 'Stuck Deals', value: String(stats.stuckCount), sub: 'inactive 7+ days', color: 'text-red-500', dot: 'bg-red-400', delta: riskDelta, deltaColor: 'text-green-400' },
        { label: 'Actions Today', value: String(priorityActions.filter(a => a.dueDate === 'Today').length), sub: 'due today', color: 'text-violet-500', dot: 'bg-violet-400' },
      ];
    }
    if (role === 'operations') {
      const unassigned = actions.filter(a => a.department === 'Operations').length;
      return [
        { label: 'Total Leads', value: String(stats.total), sub: 'in system', color: 'text-blue-500', dot: 'bg-blue-400' },
        { label: 'Unresolved Actions', value: String(priorityActions.length), sub: 'need attention', color: 'text-amber-500', dot: 'bg-amber-400' },
        { label: 'Stuck in Pipeline', value: String(stats.stuckCount), sub: '7+ days stalled', color: 'text-red-500', dot: 'bg-red-400' },
        { label: 'Ops Actions', value: String(unassigned), sub: 'operations tasks', color: 'text-violet-500', dot: 'bg-violet-400' },
        { label: 'Completed', value: String(completedActions.length), sub: 'actions done', color: 'text-green-500', dot: 'bg-green-400', delta: healthDelta, deltaColor: 'text-green-400' },
      ];
    }
    // Executive (default)
    const executionRate = actions.length > 0 ? Math.round((completedActions.length / actions.length) * 100) : 0;
    return [
      { label: 'Revenue at Risk', value: stats.hasValues && stats.atRiskValue > 0 ? fmt(stats.atRiskValue) : String(stats.stuckCount), sub: 'stuck 7+ days', color: 'text-red-500', dot: 'bg-red-400', delta: riskDelta, deltaColor: 'text-green-400' },
      { label: 'Priority Actions', value: String(priorityActions.length), sub: 'need attention', color: 'text-amber-500', dot: 'bg-amber-400' },
      { label: 'Execution Rate', value: `${executionRate}%`, sub: `${completedActions.length} actions completed`, color: 'text-teal-500', dot: 'bg-teal-400', delta: healthDelta, deltaColor: 'text-green-400' },
    ];
  }, [role, stats, priorityActions, completedActions, actions, projectedMetrics, hasProjection]);

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Health score ring */}
        <div className="shrink-0 flex items-center justify-center sm:border-r sm:border-th-border sm:pr-5">
          <BusinessHealthScore projectedBoost={hasProjection ? projectedMetrics.healthBoost : 0} />
        </div>

        {/* KPI grid — key={role} triggers re-animation on role switch (Phase 11) */}
        <div key={role} className={`flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 ${role === 'executive' ? 'lg:grid-cols-3' : 'lg:grid-cols-5'}`}>
          {metrics.map((m, i) => (
            <Metric
              key={m.label}
              label={m.label}
              value={m.value}
              sub={m.sub}
              color={m.color}
              dot={m.dot}
              delay={`delay-${[0, 100, 200, 300, 400][i] ?? 400}`}
              delta={m.delta}
              deltaColor={m.deltaColor}
            />
          ))}
        </div>
      </div>

      {/* Projected improvement banner */}
      {hasProjection && (
        <div className="mt-4 pt-3 border-t border-th-border flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
            Simulated Impact
          </span>
          <span className="text-th-faint text-[10px]">
            Based on {completedActions.length} completed action{completedActions.length !== 1 ? 's' : ''}.
            {projectedMetrics.winRateBoost > 0 && ` Win rate +${projectedMetrics.winRateBoost}%.`}
            {' '}Actual results depend on execution.
          </span>
        </div>
      )}
    </div>
  );
}

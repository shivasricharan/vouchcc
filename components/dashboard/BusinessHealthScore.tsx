'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

const CIRC = 2 * Math.PI * 40; // r=40, circumference ≈ 251.3

function scoreToColor(s: number): string {
  if (s >= 80) return '#22c55e';
  if (s >= 60) return '#f59e0b';
  if (s >= 40) return '#f97316';
  return '#ef4444';
}

function scoreToLabel(s: number): string {
  if (s >= 80) return 'Healthy';
  if (s >= 60) return 'Fair';
  if (s >= 40) return 'At Risk';
  return 'Critical';
}

function scoreToTextColor(s: number): string {
  if (s >= 80) return 'text-green-500';
  if (s >= 60) return 'text-amber-500';
  if (s >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export default function BusinessHealthScore({ projectedBoost = 0 }: { projectedBoost?: number }) {
  const { stats, leads } = useDashboard();

  const score = useMemo(() => {
    if (stats.total === 0) return 0;
    const active = Math.max(stats.activeFunnelCount, 1);
    const unassigned = leads.filter(l =>
      (!l.owner || l.owner === 'Unassigned') &&
      !['Lost', 'Completed', 'Closed Won', 'Closed Lost'].some(s => l.stage.includes(s))
    ).length;

    let penalty = 0;
    penalty += (stats.stuckCount / active) * 25;
    penalty += (stats.followUpCount / active) * 45;
    penalty += (unassigned / Math.max(stats.total, 1)) * 15;
    if (stats.pipelineValue > 0) {
      penalty += (stats.atRiskValue / stats.pipelineValue) * 15;
    }

    return Math.max(0, Math.min(100, Math.round(100 - penalty)));
  }, [stats, leads]);

  const projectedScore = Math.min(100, score + projectedBoost);
  const offset = CIRC - (score / 100) * CIRC;
  const projectedOffset = projectedBoost > 0 ? CIRC - (projectedScore / 100) * CIRC : null;
  const color = scoreToColor(score);
  const label = scoreToLabel(score);
  const textColor = scoreToTextColor(score);

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100" aria-label={`Business health score: ${score}`}>
          {/* Track */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--th-hover)" strokeWidth="7" />
          {/* Projected ring (behind active) */}
          {projectedOffset !== null && (
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="#22c55e"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${CIRC}`}
              strokeDashoffset={projectedOffset}
              transform="rotate(-90 50 50)"
              opacity={0.2}
              style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.34,1.56,0.64,1)' }}
            />
          )}
          {/* Active progress */}
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${CIRC}`}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            className="animate-ring-fill"
            style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
          {/* Score text */}
          <text
            x="50" y="47"
            textAnchor="middle"
            fontSize="22"
            fontWeight="800"
            fill={color}
            fontFamily="Inter, system-ui, sans-serif"
          >
            {score}
          </text>
          <text
            x="50" y="62"
            textAnchor="middle"
            fontSize="8"
            fill="var(--th-muted)"
            fontFamily="Inter, system-ui, sans-serif"
          >
            / 100
          </text>
        </svg>
      </div>
      <span className={`text-xs font-bold ${textColor}`}>{label}</span>
      <span className="text-th-faint text-[10px]">Business Health</span>
      {projectedBoost > 0 && (
        <span className="text-[9px] text-green-400 font-semibold">+{projectedBoost} projected</span>
      )}
    </div>
  );
}

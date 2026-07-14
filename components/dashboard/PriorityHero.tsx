'use client';

import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { URGENCY_COLORS, URGENCY_LABELS } from '@/lib/actionTypes';
import { ArrowRight, AlertTriangle, Target, Users } from 'lucide-react';

export default function PriorityHero() {
  const { actions, stats } = useDashboard();

  const topAction = useMemo(() => {
    const active = actions.filter(a => a.status !== 'completed' && a.status !== 'dismissed');
    const critical = active.filter(a => a.urgency === 'critical');
    return critical[0] ?? active[0] ?? null;
  }, [actions]);

  if (!topAction) {
    return (
      <div className="bg-th-surface border border-green-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-green-500 text-xs font-bold uppercase tracking-wide">Pipeline Healthy</span>
        </div>
        <div className="text-th-heading font-bold text-lg mb-1">No critical priorities detected.</div>
        <p className="text-th-muted text-sm">Your pipeline is in good shape. Keep follow-up intervals under 3 days to maintain momentum.</p>
      </div>
    );
  }

  const urgencyColor = URGENCY_COLORS[topAction.urgency];
  const urgencyLabel = URGENCY_LABELS[topAction.urgency];

  // Confidence approximation from impactScore
  const confidence = Math.min(95, 60 + topAction.impactScore * 3);

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        <span className="text-th-muted text-[10px] font-bold uppercase tracking-widest">#1 Priority</span>
        <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${urgencyColor}`}>
          {urgencyLabel}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-th-heading font-bold text-base leading-snug mb-3">
        {topAction.title}
      </h2>

      {/* Impact row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2.5">
          <div className="text-th-faint text-[10px] uppercase tracking-wide mb-0.5">Potential Impact</div>
          <div className="text-red-400 font-bold text-sm">{topAction.businessImpact}</div>
        </div>
        <div className="bg-th-hover rounded-lg px-3 py-2.5">
          <div className="text-th-faint text-[10px] uppercase tracking-wide mb-0.5">Due</div>
          <div className="text-th-heading font-bold text-sm">{topAction.dueDate}</div>
        </div>
      </div>

      {/* Source + why */}
      <div className="flex items-start gap-2 mb-3">
        <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-th-muted text-xs leading-relaxed">{topAction.sourceInsight}</p>
      </div>

      {/* Owner + outcome */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs">
          <Users size={11} className="text-th-faint shrink-0" />
          <span className="text-th-muted">{topAction.owner}</span>
          <span className="text-th-faint mx-1">·</span>
          <span className="text-th-muted">{topAction.department}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Target size={11} className="text-th-faint shrink-0" />
          <span className="text-th-muted">{topAction.expectedOutcome}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-th-border">
        <span className="text-th-faint text-[10px]">Confidence: {confidence}%</span>
        <a href="#action-centre" className="flex items-center gap-1 text-blue-500 hover:text-blue-400 text-xs font-semibold transition-colors">
          Review in Action Centre <ArrowRight size={11} />
        </a>
      </div>
    </div>
  );
}

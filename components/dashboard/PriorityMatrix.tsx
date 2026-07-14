'use client';

import { useState, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import type { DemoAction } from '@/lib/actionTypes';
import { URGENCY_COLORS, URGENCY_LABELS } from '@/lib/actionTypes';
import { X, Target } from 'lucide-react';

const BUBBLE_COLORS: Record<DemoAction['urgency'], string> = {
  critical: 'text-red-500 bg-red-500/10 border-red-500/25 hover:bg-red-500/20',
  high: 'text-amber-500 bg-amber-500/10 border-amber-500/25 hover:bg-amber-500/20',
  medium: 'text-blue-500 bg-blue-500/10 border-blue-500/25 hover:bg-blue-500/20',
};

interface QuadrantDef {
  label: string;
  sub: string;
  bgClass: string;
  highImpact: boolean;
  highEffort: boolean;
  // inner-border classes to create the center dividing lines
  innerBorder: string;
}

const QUADRANTS: QuadrantDef[] = [
  {
    label: 'Quick Wins',
    sub: '(High Impact, Low Effort)',
    bgClass: 'bg-green-500/5',
    highImpact: true,
    highEffort: false,
    innerBorder: 'border-r border-b',
  },
  {
    label: 'Major Projects',
    sub: '(High Impact, High Effort)',
    bgClass: 'bg-blue-500/5',
    highImpact: true,
    highEffort: true,
    innerBorder: 'border-b',
  },
  {
    label: 'Fill-ins',
    sub: '(Low Impact, Low Effort)',
    bgClass: 'bg-th-hover',
    highImpact: false,
    highEffort: false,
    innerBorder: 'border-r',
  },
  {
    label: 'Time Sinks',
    sub: '(Low Impact, High Effort)',
    bgClass: 'bg-red-500/5',
    highImpact: false,
    highEffort: true,
    innerBorder: '',
  },
];

function ActionBubble({
  action,
  onSelect,
  isSelected,
}: {
  action: DemoAction;
  onSelect: (a: DemoAction) => void;
  isSelected: boolean;
}) {
  const colorClass = BUBBLE_COLORS[action.urgency];
  const displayTitle =
    action.title.length > 18 ? action.title.slice(0, 18) + '…' : action.title;

  return (
    <button
      onClick={() => onSelect(action)}
      title={action.title}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-semibold border cursor-pointer transition-all hover:scale-105 ${colorClass} ${
        isSelected ? 'ring-1 ring-current' : ''
      }`}
    >
      <span className="opacity-60 font-bold">{action.department[0]}</span>
      {displayTitle}
    </button>
  );
}

export default function PriorityMatrix() {
  const { actions } = useDashboard();
  const [selectedAction, setSelectedAction] = useState<DemoAction | null>(null);

  const activeActions = useMemo(
    () => actions.filter(a => a.status !== 'dismissed' && a.status !== 'completed'),
    [actions],
  );

  function getQuadrantActions(highImpact: boolean, highEffort: boolean): DemoAction[] {
    return activeActions.filter(a => {
      const isHighImpact = a.impactScore >= 6;
      const isHighEffort = a.effortScore >= 6;
      return isHighImpact === highImpact && isHighEffort === highEffort;
    });
  }

  function handleSelect(action: DemoAction) {
    setSelectedAction(prev => (prev?.id === action.id ? null : action));
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target size={16} className="text-blue-500 shrink-0" />
        <div>
          <h2 className="text-th-heading font-bold text-base leading-none">Priority Matrix</h2>
          <p className="text-th-faint text-[11px] mt-0.5">Impact vs. Effort</p>
        </div>
      </div>

      {activeActions.length === 0 ? (
        <div className="bg-th-surface border border-th-border rounded-xl p-8 text-center">
          <p className="text-th-muted text-sm">
            No active actions to display. All actions are completed or dismissed.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Matrix + Y-axis label */}
          <div className="flex items-stretch gap-2">
            {/* Y-axis label — rotated, reads bottom-to-top */}
            <div className="flex items-center justify-center w-4 shrink-0">
              <span
                className="text-[9px] font-bold uppercase tracking-widest text-th-faint whitespace-nowrap select-none"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Low Impact &nbsp;&#8597;&nbsp; High Impact
              </span>
            </div>

            {/* 2×2 quadrant grid */}
            <div className="flex-1 min-w-0 border border-th-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                {QUADRANTS.map(q => {
                  const items = getQuadrantActions(q.highImpact, q.highEffort);
                  return (
                    <div
                      key={q.label}
                      className={`relative p-2.5 min-h-[160px] border-th-border ${q.bgClass} ${q.innerBorder}`}
                    >
                      {/* Corner label */}
                      <div className="mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-th-heading leading-none">
                          {q.label}
                        </p>
                        <p className="text-[9px] text-th-faint mt-0.5">{q.sub}</p>
                      </div>

                      {/* Action bubbles */}
                      <div className="flex flex-wrap gap-1">
                        {items.length === 0 ? (
                          <span className="text-[9px] text-th-faint italic">None</span>
                        ) : (
                          items.map(action => (
                            <ActionBubble
                              key={action.id}
                              action={action}
                              onSelect={handleSelect}
                              isSelected={selectedAction?.id === action.id}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-axis label */}
          <p className="text-center text-[9px] font-bold uppercase tracking-widest text-th-faint mt-2 pl-6">
            Low Effort &nbsp;&#8596;&nbsp; High Effort
          </p>

          {/* Urgency legend */}
          <div className="flex items-center gap-2 mt-3 flex-wrap pl-6">
            <span className="text-[9px] text-th-faint uppercase tracking-wide font-medium">
              Urgency:
            </span>
            {(['critical', 'high', 'medium'] as const).map(u => (
              <span
                key={u}
                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border ${BUBBLE_COLORS[u]}`}
              >
                {URGENCY_LABELS[u]}
              </span>
            ))}
          </div>

          {/* Detail panel */}
          {selectedAction && (
            <div className="mt-4 bg-th-surface border border-th-border rounded-xl p-4 animate-fade-in">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-th-heading font-semibold text-sm leading-snug">
                    {selectedAction.title}
                  </p>
                  <p className="text-th-faint text-[10px] mt-0.5">{selectedAction.department}</p>
                </div>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="text-th-faint hover:text-th-muted transition-colors shrink-0 p-0.5"
                  aria-label="Dismiss detail"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-th-muted text-xs leading-relaxed mb-3">
                {selectedAction.businessImpact}
              </p>

              <div className="flex flex-wrap gap-1.5 items-center">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${URGENCY_COLORS[selectedAction.urgency]}`}
                >
                  {URGENCY_LABELS[selectedAction.urgency]}
                </span>
                <span className="text-[10px] text-th-faint bg-th-hover border border-th-border px-1.5 py-0.5 rounded-full">
                  Owner: {selectedAction.owner}
                </span>
                <span className="text-[10px] text-th-faint bg-th-hover border border-th-border px-1.5 py-0.5 rounded-full">
                  Effort: {selectedAction.effort}
                </span>
                <span className="text-[10px] text-th-faint bg-th-hover border border-th-border px-1.5 py-0.5 rounded-full">
                  Impact: {selectedAction.impactScore}/10
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

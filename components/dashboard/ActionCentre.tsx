'use client';

import { useState, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import type { ActionStatus, ActionPriority } from '@/lib/actionTypes';
import { STATUS_LABELS, STATUS_COLORS, URGENCY_COLORS, URGENCY_LABELS } from '@/lib/actionTypes';
import { ChevronDown, ChevronUp, CheckCircle2, Clock, X, ArrowRight, Zap } from 'lucide-react';

type FilterTab = ActionStatus | 'all';

const DEPT_ICONS: Record<string, string> = {
  Sales: '◎',
  Marketing: '◇',
  Finance: '◆',
  Operations: '⊕',
};

function ActionCard({ action }: { action: ReturnType<typeof useDashboard>['actions'][0] }) {
  const { updateActionStatus } = useDashboard();
  const [expanded, setExpanded] = useState(false);
  const isDone = action.status === 'completed' || action.status === 'dismissed';

  function nextStatus(current: ActionStatus): ActionStatus | null {
    const flow: ActionStatus[] = ['recommended', 'assigned', 'in_progress', 'completed'];
    const idx = flow.indexOf(current);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  }

  const next = nextStatus(action.status);
  const nextLabel: Record<ActionStatus, string> = {
    recommended: 'Assign',
    assigned: 'Start',
    in_progress: 'Complete',
    completed: '',
    dismissed: '',
  };

  return (
    <div className={`bg-th-surface border border-th-border rounded-xl p-4 transition-all duration-200 ${isDone ? 'opacity-50' : 'hover:border-blue-500/20'} animate-fade-up`}>
      {/* Header row */}
      <div className="flex items-start gap-2 mb-2">
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${URGENCY_COLORS[action.urgency]}`}>
            {URGENCY_LABELS[action.urgency]}
          </span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-th-hover border border-th-border text-th-muted">
            {DEPT_ICONS[action.department] ?? '●'} {action.department}
          </span>
          <span className="text-[10px] font-medium text-th-faint">{action.dueDate}</span>
        </div>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[action.status]}`}>
          {STATUS_LABELS[action.status]}
        </span>
      </div>

      {/* Title */}
      <p className={`text-sm font-semibold leading-snug mb-1.5 ${isDone ? 'line-through text-th-muted' : 'text-th-heading'}`}>
        {action.title}
      </p>

      {/* Impact */}
      <p className="text-xs text-th-muted mb-2">{action.businessImpact}</p>

      {/* Expandable why */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="flex items-center gap-1 text-th-faint hover:text-th-muted text-[11px] transition-colors mb-2"
      >
        {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        Why this matters
      </button>

      {expanded && (
        <div className="bg-th-hover rounded-lg px-3 py-2 mb-3 animate-fade-in">
          <p className="text-th-muted text-xs leading-relaxed mb-1">{action.sourceInsight}</p>
          <p className="text-th-body text-xs leading-relaxed">
            <span className="text-th-faint">Expected: </span>{action.expectedOutcome}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-th-faint">
            <span>Owner: {action.owner}</span>
            <span>Effort: {action.effort}</span>
            <span>Impact: {action.impactScore}/10</span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!isDone && (
        <div className="flex items-center gap-2 flex-wrap">
          {next && (
            <button
              onClick={() => updateActionStatus(action.id, next)}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowRight size={11} /> {nextLabel[action.status]}
            </button>
          )}
          {action.status === 'recommended' && (
            <button
              onClick={() => updateActionStatus(action.id, 'completed')}
              className="flex items-center gap-1 text-green-500 hover:text-green-400 text-xs font-medium px-2 py-1.5 transition-colors"
            >
              <CheckCircle2 size={11} /> Done
            </button>
          )}
          <button
            onClick={() => updateActionStatus(action.id, 'dismissed')}
            className="flex items-center gap-1 text-th-faint hover:text-th-muted text-xs px-2 py-1.5 transition-colors ml-auto"
          >
            <X size={10} /> Dismiss
          </button>
        </div>
      )}

      {action.status === 'completed' && (
        <div className="flex items-center gap-1.5 text-green-500 text-xs">
          <CheckCircle2 size={12} /> Completed
        </div>
      )}
    </div>
  );
}

export default function ActionCentre() {
  const { actions, role } = useDashboard();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  const roleToDepart: Record<string, string> = {
    sales: 'Sales',
    marketing: 'Marketing',
    finance: 'Finance',
    operations: 'Operations',
    executive: 'all',
  };

  const effectiveDept = deptFilter === 'all' && role !== 'executive' ? roleToDepart[role] ?? 'all' : deptFilter;

  const filtered = useMemo(() => {
    return actions.filter(a => {
      const matchStatus = filter === 'all' || a.status === filter;
      const matchDept = effectiveDept === 'all' || a.department === effectiveDept;
      return matchStatus && matchDept;
    });
  }, [actions, filter, effectiveDept]);

  const counts = useMemo(() => ({
    recommended: actions.filter(a => a.status === 'recommended').length,
    assigned: actions.filter(a => a.status === 'assigned').length,
    in_progress: actions.filter(a => a.status === 'in_progress').length,
    completed: actions.filter(a => a.status === 'completed').length,
    dismissed: actions.filter(a => a.status === 'dismissed').length,
  }), [actions]);

  const totalActive = counts.recommended + counts.assigned + counts.in_progress;
  const completedPct = actions.length > 0 ? Math.round((counts.completed / actions.length) * 100) : 0;

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'recommended', label: 'Recommended' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'dismissed', label: 'Dismissed' },
  ];

  const DEPTS = ['all', ...Array.from(new Set(actions.map(a => a.department)))];

  return (
    <div id="action-centre">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-500" />
          <h2 className="text-th-heading font-bold text-base">Action Centre</h2>
          {totalActive > 0 && (
            <span className="bg-amber-500/15 text-amber-500 text-xs font-bold px-2 py-0.5 rounded-full">
              {totalActive} active
            </span>
          )}
        </div>
        <div className="flex-1" />
        {/* Department filter */}
        <div className="flex items-center gap-1">
          {DEPTS.map(d => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`text-[10px] font-medium px-2 py-1 rounded-lg transition-colors ${
                effectiveDept === d
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                  : 'text-th-faint hover:text-th-muted'
              }`}
            >
              {d === 'all' ? 'All Depts' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Progress summary */}
      <div className="bg-th-surface border border-th-border rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4 text-xs flex-wrap">
            <span className="text-th-muted">Recommended: <strong className="text-blue-400">{counts.recommended}</strong></span>
            <span className="text-th-muted">In Progress: <strong className="text-amber-400">{counts.in_progress}</strong></span>
            <span className="text-th-muted">Completed: <strong className="text-green-400">{counts.completed}</strong></span>
          </div>
          <span className="text-th-muted text-xs">{completedPct}%</span>
        </div>
        <div className="h-1.5 bg-th-hover rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full animate-progress-fill transition-all duration-700"
            style={{ width: `${completedPct}%` }}
          />
        </div>
        {counts.completed > 0 && (
          <p className="text-th-faint text-[10px] mt-1.5">{counts.completed} of {actions.length} actions completed</p>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {TABS.map(t => {
          const count = t.key === 'all' ? actions.length : counts[t.key as ActionStatus];
          return (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === t.key
                  ? 'bg-th-elevated text-th-heading border border-th-border'
                  : 'text-th-muted hover:text-th-heading hover:bg-th-hover'
              }`}
            >
              {t.label}
              {count > 0 && (
                <span className="text-[10px] bg-th-hover px-1.5 py-0.5 rounded-full text-th-faint">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action grid */}
      {filtered.length === 0 ? (
        <div className="bg-th-surface border border-th-border rounded-xl p-8 text-center">
          <p className="text-th-muted text-sm">
            {filter === 'completed'
              ? 'No completed actions yet. Take action to see progress here.'
              : 'No actions match this filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(action => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>
      )}

      {actions.length === 0 && (
        <div className="bg-th-surface border border-th-border rounded-xl p-8 text-center">
          <p className="text-th-muted text-sm">Upload data or try the sample dataset to generate recommended actions.</p>
        </div>
      )}
    </div>
  );
}

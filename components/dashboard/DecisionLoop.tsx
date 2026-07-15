'use client';

import { useEffect, useState } from 'react';
import { Check, Play, RotateCcw } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

const steps = ['Detected', 'Recommended', 'Assigned', 'Completed', 'Measured', 'Next priority'];

export default function DecisionLoop() {
  const { actions } = useDashboard();
  const assigned = actions.some(action => ['assigned', 'in_progress', 'completed'].includes(action.status));
  const inProgress = actions.some(action => ['in_progress', 'completed'].includes(action.status));
  const completed = actions.some(action => action.status === 'completed');
  const realStep = completed ? 4 : inProgress ? 3 : assigned ? 2 : 1;
  const [active, setActive] = useState(realStep);
  const [replaying, setReplaying] = useState(false);

  useEffect(() => {
    if (!replaying) setActive(realStep);
  }, [realStep, replaying]);

  useEffect(() => {
    if (!replaying) return;
    if (active >= realStep) {
      const done = window.setTimeout(() => setReplaying(false), 650);
      return () => window.clearTimeout(done);
    }
    const timer = window.setTimeout(() => setActive(value => value + 1), 520);
    return () => window.clearTimeout(timer);
  }, [active, replaying, realStep]);

  const replay = () => { setActive(0); setReplaying(true); };

  return (
    <section className="rounded-xl border border-th-border bg-th-surface px-4 py-3" aria-label="Vouch decision loop">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold text-th-heading">Current decision cycle</h2>
          <p className="text-[10px] text-th-faint">Live action state · measurement begins with the next analysed dataset</p>
        </div>
        <button onClick={replay} disabled={replaying} className="flex items-center gap-1.5 rounded-lg border border-th-border bg-th-hover px-2.5 py-1.5 text-[10px] font-semibold text-th-body transition-colors hover:text-th-heading disabled:opacity-60">
          {replaying ? <RotateCcw size={11} className="animate-spin" /> : <Play size={11} />}
          {replaying ? 'Replaying' : 'Replay cycle'}
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        {steps.map((step, index) => (
          <div key={step} className={`flex items-center gap-1.5 rounded-lg border px-2 py-2 transition-all duration-300 ${index <= active ? 'border-blue-500/25 bg-blue-500/10 text-th-heading' : 'border-th-border bg-th-page text-th-faint'}`}>
            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${index < active ? 'bg-green-500 text-white' : index === active ? 'bg-blue-600 text-white' : 'bg-th-hover text-th-faint'}`}>
              {index < active ? <Check size={9} /> : index + 1}
            </span>
            <span className="truncate text-[9px] font-semibold sm:text-[10px]">{step}</span>
          </div>
        ))}
      </div>
      {replaying && <button onClick={() => setReplaying(false)} className="mt-2 text-[10px] text-th-faint hover:text-th-body">Skip replay</button>}
    </section>
  );
}

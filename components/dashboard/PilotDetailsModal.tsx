'use client';

import { useEffect } from 'react';
import { CheckCircle2, ExternalLink, ShieldCheck, X } from 'lucide-react';

interface PilotDetailsModalProps {
  onClose: () => void;
}

const TALK_URL = 'https://yourvouch.com/?from=pilot-details#discuss-results';

const INCLUDED = [
  'Kick-off, data mapping and setup for one priority business workflow',
  'A leadership decision brief plus up to two relevant functional views',
  'Prioritised actions with owners, due dates and email decision briefs',
  'A mid-pilot review and a final outcome review with recommendations',
];

const ROLE_VIEWS = [
  { role: 'Owner / CEO', answer: 'What needs attention, value affected, who owns it and whether action is happening.' },
  { role: 'Sales', answer: 'Which opportunities need follow-up today, which deals are stalled and the next best action.' },
  { role: 'Marketing', answer: 'Which sources produce useful leads and where conversion or follow-up breaks—when source data exists.' },
  { role: 'Finance', answer: 'Open value, risk concentration and missing financial visibility—when reliable amount fields exist.' },
  { role: 'Operations', answer: 'Unowned work, delays and action completion across the selected workflow.' },
];

export default function PilotDetailsModal({ onClose }: PilotDetailsModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div role="dialog" aria-modal="true" aria-labelledby="pilot-details-title" className="max-h-[94vh] w-full overflow-y-auto rounded-t-2xl border border-th-border bg-th-surface shadow-2xl sm:max-w-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-th-border bg-th-surface px-5 py-4 sm:px-6">
          <div>
            <h2 id="pilot-details-title" className="text-lg font-bold text-th-heading">₹9,999 guided pilot · 14 days</h2>
            <p className="mt-1 text-xs leading-relaxed text-th-muted">A focused working pilot—not a library of generic dashboards.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close pilot details" className="rounded-lg p-2 text-th-muted transition-colors hover:bg-th-hover hover:text-th-heading"><X size={18} /></button>
        </div>

        <div className="space-y-6 px-5 py-5 sm:px-6">
          <section>
            <h3 className="text-sm font-bold text-th-heading">What you receive</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {INCLUDED.map(item => (
                <div key={item} className="flex items-start gap-2 rounded-lg border border-th-border bg-th-hover/40 p-3 text-xs leading-relaxed text-th-body">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-green-500" /> {item}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-th-heading">Different people see different decisions</h3>
            <p className="mt-1 text-xs leading-relaxed text-th-muted">Vouch configures only the views supported by your data. Finance does not receive sales clutter; Sales does not receive finance detail it cannot act on.</p>
            <div className="mt-3 divide-y divide-th-border overflow-hidden rounded-lg border border-th-border">
              {ROLE_VIEWS.map(item => (
                <div key={item.role} className="grid gap-1 p-3 sm:grid-cols-[110px_1fr] sm:gap-4">
                  <div className="text-xs font-semibold text-th-heading">{item.role}</div>
                  <div className="text-xs leading-relaxed text-th-muted">{item.answer}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-start gap-2 rounded-lg border border-blue-500/15 bg-blue-500/5 p-3 text-[11px] leading-relaxed text-th-muted">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-blue-500" />
            <span>The current guided pilot uses one shared browser workspace for nominated decision-makers. Separate individual logins, advanced permissions and production integrations are scoped after the pilot rather than silently included.</span>
          </div>

          <div className="flex flex-col gap-3 border-t border-th-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-xs leading-relaxed text-th-muted">The goal after 14 days: prove whether Vouch helped your team spot an important issue earlier and move a real decision forward.</p>
            <a href={TALK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500">Discuss the pilot <ExternalLink size={13} /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

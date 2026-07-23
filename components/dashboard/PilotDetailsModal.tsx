'use client';

import { useEffect } from 'react';
import { CheckCircle2, ExternalLink, ShieldCheck, X } from 'lucide-react';

interface PilotDetailsModalProps { onClose: () => void; }

const TALK_URL = 'https://yourvouch.com/?from=pilot-details#contact';

const INCLUDED = [
  'One recurring business flow selected and mapped to the data you already use',
  'Attention, ownership, urgency and next-action rules configured for that flow',
  'Daily operating briefs and action tracking during the working period',
  'Mid-pilot refinement plus a final evidence review and automation roadmap',
];

const FLOW = [
  { step: 'Days 1–2', answer: 'Choose one flow, agree the data source and define what “needs attention” means in your business.' },
  { step: 'Days 3–5', answer: 'Configure the working view, required fields, owners, thresholds and briefing format.' },
  { step: 'Days 6–12', answer: 'Run daily briefs, surface real attention items, track actions and refine the workflow from usage.' },
  { step: 'Days 13–14', answer: 'Review saves, faster movement, reduced owner chasing, unresolved gaps and what should be automated next.' },
];

export default function PilotDetailsModal({ onClose }: PilotDetailsModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', handleKeyDown); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="pilot-details-title" className="max-h-[94vh] w-full overflow-y-auto rounded-t-2xl border border-th-border bg-th-surface shadow-2xl sm:max-w-2xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-th-border bg-th-surface px-5 py-4 sm:px-6">
          <div>
            <h2 id="pilot-details-title" className="text-lg font-bold text-th-heading">₹9,999 working pilot · 14 days</h2>
            <p className="mt-1 text-xs leading-relaxed text-th-muted">Not a dashboard delivery. One real business flow operated, measured and prepared for automation.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close pilot details" className="rounded-lg p-2 text-th-muted transition-colors hover:bg-th-hover hover:text-th-heading"><X size={18} /></button>
        </div>

        <div className="space-y-6 px-5 py-5 sm:px-6">
          <section>
            <h3 className="text-sm font-bold text-th-heading">What ₹9,999 includes</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {INCLUDED.map(item => <div key={item} className="flex items-start gap-2 rounded-lg border border-th-border bg-th-hover/40 p-3 text-xs leading-relaxed text-th-body"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-green-500" /> {item}</div>)}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-th-heading">How the 14 days work</h3>
            <div className="mt-3 divide-y divide-th-border overflow-hidden rounded-lg border border-th-border">
              {FLOW.map(item => <div key={item.step} className="grid gap-1 p-3 sm:grid-cols-[110px_1fr] sm:gap-4"><div className="text-xs font-semibold text-th-heading">{item.step}</div><div className="text-xs leading-relaxed text-th-muted">{item.answer}</div></div>)}
            </div>
          </section>

          <div className="flex items-start gap-2 rounded-lg border border-blue-500/15 bg-blue-500/5 p-3 text-[11px] leading-relaxed text-th-muted">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-blue-500" />
            <span>The pilot may run through a shared Google Sheet, existing exports and a guided Vouch workspace. Production integrations, WhatsApp automation, individual logins and advanced permissions are scoped only after the workflow proves useful.</span>
          </div>

          <div className="rounded-lg border border-green-500/15 bg-green-500/5 p-3 text-[11px] leading-relaxed text-th-muted">
            The success test is evidence: an important item noticed earlier, an action moved faster, clearer ownership, reduced manual chasing, or a measurable business save. If the workflow does not prove useful, Vouch should not recommend a longer engagement.
          </div>

          <div className="flex flex-col gap-3 border-t border-th-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-xs leading-relaxed text-th-muted">₹9,999 is an early validation price for one business flow. Future implementation and subscription pricing depend on integrations, users, volume and automation depth.</p>
            <a href={TALK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500">Discuss the pilot <ExternalLink size={13} /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

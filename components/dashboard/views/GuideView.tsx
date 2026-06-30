'use client';

import { useDashboard } from '@/context/DashboardContext';

const STEPS: { icon: string; title: string; body: string }[] = [
  { icon: '📤', title: 'Upload your CSV', body: 'Bring data from your CRM, ERP, website, Google Sheets, Excel, or any lead management system.' },
  { icon: '🧭', title: 'Vouch understands your columns automatically', body: 'Smart field detection maps your column names to the right fields, even if they look nothing like ours.' },
  { icon: '🗂️', title: 'Your data is standardized', body: 'Every row is normalised into a single, consistent structure so it can be analysed reliably.' },
  { icon: '📈', title: 'Opportunity Score is calculated', body: 'Vouch scores the health of your pipeline based on movement, follow-up speed, and stuck leads.' },
  { icon: '💡', title: 'Vouch Insights identify follow-up gaps and missed opportunities', body: 'Patterns in your data surface what is silently costing you revenue.' },
  { icon: '✅', title: 'Suggested Actions help improve conversions', body: 'A short, prioritised list of what to do next — no guesswork required.' },
];

const GUIDE_CONTENT = `HOW VOUCH WORKS
==============================

1. Upload your CSV — from your CRM, ERP, website, Google Sheets, Excel, or any lead management system.
2. Vouch understands your columns automatically — smart field detection maps your data to the right fields.
3. Your data is standardized — every row is normalised into one consistent structure.
4. Opportunity Score is calculated — a health score based on movement, follow-up speed, and stuck leads.
5. Vouch Insights identify follow-up gaps and missed opportunities — patterns surfaced from your data.
6. Suggested Actions help improve conversions — a short, prioritised list of what to do next.

THE CORE RULE
--------------
If leads are coming but revenue is not growing, the problem is usually not
lead generation. It is lead movement, follow-up discipline, and ownership.

Powered by Vouch · yourvouch.com
`;

export default function GuideView() {
  const { setView, leads } = useDashboard();
  const backTarget = leads.length > 0 ? 'dashboard' : 'upload';
  const backLabel = leads.length > 0 ? '← Back to Dashboard' : '← Back to Start';

  function downloadGuide() {
    const blob = new Blob([GUIDE_CONTENT], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'how-vouch-works.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 pb-12 max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-10 flex-wrap">
        <div>
          <button
            onClick={() => setView(backTarget)}
            className="flex items-center gap-1.5 text-th-muted hover:text-th-body text-xs mb-3 transition-colors"
          >
            {backLabel}
          </button>
          <h1 className="text-th-heading font-bold text-2xl">How Vouch Works</h1>
          <p className="text-th-body text-sm mt-2 max-w-md">
            Six steps from raw CSV to clear, actionable opportunity insights.
          </p>
        </div>
        <button
          onClick={downloadGuide}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          ↓ Download Guide
        </button>
      </div>

      <div className="flex flex-col items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={i} className="w-full flex flex-col items-center">
            <div className="w-full max-w-md bg-th-surface border border-th-border rounded-xl px-5 py-4 flex items-start gap-3">
              <span className="text-2xl shrink-0 leading-none">{s.icon}</span>
              <div>
                <div className="text-th-heading font-semibold text-sm">{s.title}</div>
                <div className="text-th-body text-sm mt-0.5 leading-relaxed">{s.body}</div>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="text-th-faint text-lg py-1.5 leading-none">↓</div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-th-surface border border-th-border rounded-xl p-5 mb-8">
        <div className="text-th-muted text-[10px] uppercase tracking-widest font-semibold mb-3">Why this matters</div>
        <blockquote className="text-th-heading text-base font-semibold leading-snug border-l-2 border-blue-500 pl-4">
          If leads are coming but revenue is not growing, the problem is usually not lead generation — it is lead movement, follow-up discipline, and ownership.
        </blockquote>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => setView(backTarget)}
          className="flex items-center gap-2 bg-th-hover border border-th-border text-th-body text-sm font-medium px-4 py-2.5 rounded-lg transition-colors hover:text-th-heading"
        >
          {backLabel}
        </button>
        <button
          onClick={downloadGuide}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          ↓ Download Guide
        </button>
      </div>
    </div>
  );
}

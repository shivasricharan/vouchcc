'use client';

import { useDashboard } from '@/context/DashboardContext';

function GithubIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

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

      <div className="bg-th-surface border border-th-border rounded-xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <GithubIcon size={14} className="text-th-heading" />
          <div className="text-th-heading font-semibold text-sm">Build with Vouch</div>
        </div>
        <p className="text-th-body text-sm leading-relaxed mb-4">
          The Vouch Starter Kit is open source. Fork it to run your own version — customise the scoring logic, connect your own data sources, and deploy it for your business.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="https://github.com/yourvouch/vouch-starter-kit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-th-hover border border-th-border text-th-heading text-xs font-semibold px-4 py-2 rounded-lg hover:border-th-muted transition-colors"
          >
            <GithubIcon size={13} /> View Starter Kit on GitHub
          </a>
          <a
            href="https://yourvouch.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-th-muted hover:text-th-heading text-xs transition-colors"
          >
            Back to Vouch →
          </a>
        </div>
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

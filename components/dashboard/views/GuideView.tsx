'use client';

import { useDashboard } from '@/context/DashboardContext';

const METRICS: { icon: string; title: string; oneLiner: string }[] = [
  { icon: '📊', title: 'Total Leads', oneLiner: 'Total enquiries captured — high volume alone does not mean healthy pipeline.' },
  { icon: '🎯', title: 'High-Intent Leads', oneLiner: 'Leads most likely to convert — prioritise these over cold inquiries.' },
  { icon: '⏸️', title: 'Stuck Leads', oneLiner: 'Leads with no movement for 7+ days — silent revenue leaks that rarely self-resolve.' },
  { icon: '💰', title: 'Revenue / Opportunities at Risk', oneLiner: 'Value of stuck or delayed leads — money sitting on the table.' },
  { icon: '📉', title: 'Stage Drop-off', oneLiner: 'Where leads pile up in your pipeline — a bottleneck at any stage means the process is breaking down.' },
  { icon: '📡', title: 'Source Quality', oneLiner: 'Which channels bring leads and how well they convert — invest in quality, not just volume.' },
  { icon: '⏰', title: 'Follow-up Delay', oneLiner: 'How long leads wait before getting a response — speed of follow-up directly impacts conversion.' },
  { icon: '💡', title: 'What We Found', oneLiner: 'Automated findings from your data — revenue leaks, missed follow-ups, and conversion patterns.' },
  { icon: '📋', title: 'What To Do Next', oneLiner: 'Prioritised action items — pick one per week and implement it consistently.' },
  { icon: '⚠️', title: 'Priority Follow-ups', oneLiner: 'Leads needing urgent attention ranked by intent, value, and delay.' },
];

const GUIDE_CONTENT = `VOUCH INSIGHTS — QUICK GUIDE
==============================

Total Leads: Total enquiries captured — high volume alone does not mean healthy pipeline.
High-Intent Leads: Leads most likely to convert — prioritise these over cold inquiries.
Stuck Leads: Leads with no movement for 7+ days — silent revenue leaks.
Revenue at Risk: Value of stuck or delayed leads — money sitting on the table.
Stage Drop-off: Where leads pile up in your pipeline — bottlenecks break the process.
Source Quality: Which channels bring leads and how well they convert.
Follow-up Delay: How long leads wait before getting a response.
What We Found: Automated findings — revenue leaks, missed follow-ups, patterns.
What To Do Next: Prioritised action items — pick one per week.
Priority Follow-ups: Leads needing urgent attention ranked by intent, value, delay.

THE CORE RULE
--------------
If leads are coming but revenue is not growing, the problem is usually not
lead generation. It is lead movement, follow-up discipline, and ownership.

Powered by Vouch · yourvouch.com
`;

export default function GuideView() {
  const { setView } = useDashboard();

  function downloadGuide() {
    const blob = new Blob([GUIDE_CONTENT], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vouch-insights-guide.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 pb-12 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-1.5 text-th-muted hover:text-th-body text-xs mb-3 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-th-heading font-bold text-2xl">How to Read Your Dashboard</h1>
          <p className="text-th-body text-sm mt-2 max-w-xl">
            One sentence per metric. Understand everything in under a minute.
          </p>
        </div>
        <button
          onClick={downloadGuide}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          ↓ Download Guide
        </button>
      </div>

      <div className="space-y-3 mb-8">
        {METRICS.map((m, i) => (
          <div key={i} className="bg-th-surface border border-th-border rounded-xl px-5 py-4 flex items-start gap-3">
            <span className="text-lg shrink-0">{m.icon}</span>
            <div>
              <div className="text-th-heading font-semibold text-sm">{m.title}</div>
              <div className="text-th-body text-sm mt-0.5 leading-relaxed">{m.oneLiner}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-th-surface border border-th-border rounded-xl p-5 mb-8">
        <div className="text-th-muted text-[10px] uppercase tracking-widest font-semibold mb-3">The core rule</div>
        <blockquote className="text-th-heading text-base font-semibold leading-snug border-l-2 border-blue-500 pl-4">
          If leads are coming but revenue is not growing, the problem is usually not lead generation — it is lead movement, follow-up discipline, and ownership.
        </blockquote>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 bg-th-hover border border-th-border text-th-body text-sm font-medium px-4 py-2.5 rounded-lg transition-colors hover:text-th-heading"
        >
          ← Back to Dashboard
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

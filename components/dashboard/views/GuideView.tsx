'use client';

import { useDashboard } from '@/context/DashboardContext';

interface Section {
  icon: string;
  title: string;
  meaning: string;
  interpret: string;
  action: string;
}

const SECTIONS: Section[] = [
  {
    icon: '📊',
    title: 'Total Leads',
    meaning: 'Total enquiries and opportunities captured across all channels.',
    interpret: 'High lead count does not mean high revenue. Volume without movement is just noise.',
    action: 'Compare total leads with active leads, stuck leads, and converted leads to understand real pipeline health.',
  },
  {
    icon: '🎯',
    title: 'High-Intent Leads',
    meaning: 'Leads with a high probability of converting based on their stage and activity.',
    interpret: 'These are your best chances at revenue. Losing even one high-intent lead is a direct revenue loss.',
    action: 'Prioritise these over cold inquiries. Ensure they have a named owner and a clear next action within 24 hours.',
  },
  {
    icon: '⏸️',
    title: 'Stuck Leads',
    meaning: 'Leads that have not moved for several days with no recorded activity.',
    interpret: 'Stuck leads are silent revenue leaks. They rarely self-resolve.',
    action: 'Call, WhatsApp, reassign, or formally close them with a documented reason. Do not let them sit.',
  },
  {
    icon: '🔁',
    title: 'Delayed Follow-ups',
    meaning: 'Leads that need contact today or are overdue for follow-up.',
    interpret: 'This is your daily worklist. Start here every morning, not with new leads.',
    action: 'Assign specific next actions with owners and deadlines. A follow-up without a clear owner will not happen.',
  },
  {
    icon: '📡',
    title: 'Source Quality',
    meaning: 'Where your leads are coming from and how well each channel converts.',
    interpret: 'Some sources bring quantity. Others bring quality. Referrals typically close faster and at higher value.',
    action: 'Identify which sources convert best and invest more effort in those. Do not optimise for volume from low-quality sources.',
  },
  {
    icon: '📉',
    title: 'Stage Drop-off',
    meaning: 'How many leads are sitting in each sales stage and where they drop off.',
    interpret: 'A large pile-up at any stage indicates a bottleneck. The sales process is breaking down at that point.',
    action: 'Identify the most congested stage. Improve the handoff, script, or process at that specific stage.',
  },
  {
    icon: '💰',
    title: 'Revenue Leakage',
    meaning: 'The estimated value of leads that are stuck, delayed, or at risk.',
    interpret: 'This is money sitting on the table. Every day without action increases the chance of losing it.',
    action: 'Focus effort on high-value stuck leads. Protect your pipeline from silent attrition.',
  },
  {
    icon: '⚠️',
    title: 'Opportunities at Risk',
    meaning: 'Leads with potential that are not being actively worked on.',
    interpret: 'When no revenue value is available, this shows the count of opportunities that could be lost.',
    action: 'Review these weekly. Each at-risk opportunity should have a clear next step.',
  },
  {
    icon: '📋',
    title: 'Priority Follow-ups',
    meaning: 'A ranked list of leads that need the most urgent attention.',
    interpret: 'This table combines intent, value, and delay to surface the most important actions.',
    action: 'Work through this list daily. Each lead should have an assigned action before end of day.',
  },
  {
    icon: '💡',
    title: 'Recommendations',
    meaning: 'Practical, data-driven suggestions based on patterns in your pipeline.',
    interpret: 'These are not generic tips — they are generated from your actual lead data.',
    action: 'Pick one recommendation each week and implement it. Small consistent improvements compound.',
  },
];

const GUIDE_CONTENT = `HOW TO READ AND USE YOUR VOUCH INSIGHTS DASHBOARD
====================================================

This dashboard is not just for seeing leads. It is for understanding where
revenue is getting stuck, which leads need action, which team members are
overloaded, and what decisions to take daily.

WHAT EACH METRIC MEANS
------------------------

Total Leads
  Meaning: Total enquiries captured across all channels.
  Interpret: High leads does not mean high revenue.
  Action: Compare with active, stuck, and converted leads.

High-Intent Leads
  Meaning: Leads with high conversion probability.
  Interpret: Your best revenue opportunities.
  Action: Prioritise these. Ensure they have clear owners and next steps.

Stuck Leads
  Meaning: Leads with no movement for several days.
  Interpret: Silent revenue leaks. They rarely self-resolve.
  Action: Call, WhatsApp, reassign, or close with a reason.

Delayed Follow-ups
  Meaning: Leads needing contact today or overdue.
  Interpret: Your daily worklist. Start here, not with new leads.
  Action: Assign specific next actions with owners and deadlines.

Source Quality
  Meaning: Where leads come from and how they convert.
  Interpret: Some sources bring volume; others bring quality.
  Action: Invest more in sources that convert, not just attract.

Stage Drop-off
  Meaning: How many leads are in each stage.
  Interpret: Pile-up in one stage = bottleneck.
  Action: Fix the handoff or process at the congested stage.

Revenue Leakage
  Meaning: Value of stuck, delayed, or at-risk leads.
  Interpret: Money sitting on the table.
  Action: Focus on high-value stuck leads to protect pipeline.

Opportunities at Risk
  Meaning: Count of opportunities that could be lost.
  Interpret: Shows risk even when revenue values are unavailable.
  Action: Review weekly. Assign clear next steps.

Priority Follow-ups
  Meaning: Ranked list of leads needing urgent attention.
  Interpret: Combines intent, value, and delay for prioritisation.
  Action: Work through daily. Every lead should have a next action.

Recommendations
  Meaning: Data-driven suggestions from your pipeline patterns.
  Interpret: Not generic tips, but specific to your data.
  Action: Pick one per week and implement it.

DAILY ROUTINE
--------------
Every morning:
  1. Check Delayed Follow-ups
  2. Check Stuck Leads
  3. Check Priority Follow-ups
  4. Review High-Intent Leads
  5. Assign clear next actions

Every week:
  1. Review funnel bottlenecks
  2. Review team workload
  3. Check source quality
  4. Review recommendations
  5. Decide what to improve next week

THE CORE BUSINESS RULE
------------------------
If leads are coming but revenue is not growing, the problem is usually
not lead generation. The problem is lead movement, follow-up discipline,
ownership, and visibility.

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
    <div className="p-5 pb-12 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-1.5 text-th-muted hover:text-th-body text-xs mb-3 transition-colors"
          >
            ‹ Back to Dashboard
          </button>
          <h1 className="text-th-heading font-bold text-2xl leading-tight">How to Read Your Dashboard</h1>
          <p className="text-th-body text-sm mt-2 leading-relaxed max-w-xl">
            This dashboard helps you find revenue leaks, stuck leads, missed follow-ups, and conversion opportunities.
            Here is how to read every metric and what action to take.
          </p>
        </div>
        <button
          onClick={downloadGuide}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <span>↓</span> Download Guide
        </button>
      </div>

      <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <div className="text-th-heading font-semibold text-sm mb-1.5">Why this dashboard exists</div>
            <p className="text-th-body text-sm leading-relaxed">
              Most businesses lose revenue not because they lack leads — but because leads get stuck, go silent,
              or are never properly followed up. This dashboard gives you a single place to see what
              is happening, who owns what, and what action to take right now.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-th-heading font-bold text-base mb-1">What Each Metric Means</h2>
        <p className="text-th-muted text-xs mb-4">How to read every number on your dashboard</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map((s, i) => (
            <div key={i} className="bg-th-surface border border-th-border rounded-xl p-4 hover:border-blue-500/15 transition-colors">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xl">{s.icon}</span>
                <div className="text-th-heading font-semibold text-sm">{s.title}</div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-th-faint text-[10px] uppercase tracking-wide font-semibold">Meaning</span>
                  <p className="text-th-body text-xs mt-0.5 leading-relaxed">{s.meaning}</p>
                </div>
                <div>
                  <span className="text-th-faint text-[10px] uppercase tracking-wide font-semibold">How to interpret</span>
                  <p className="text-th-body text-xs mt-0.5 leading-relaxed">{s.interpret}</p>
                </div>
                <div>
                  <span className="text-blue-500 text-[10px] uppercase tracking-wide font-semibold">What to do</span>
                  <p className="text-th-body text-xs mt-0.5 leading-relaxed">{s.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-th-surface border border-amber-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">☀️</span>
            <div className="text-th-heading font-semibold text-sm">Every Morning</div>
          </div>
          <ol className="space-y-2">
            {[
              'Check Delayed Follow-ups',
              'Check Stuck Leads',
              'Review Priority Follow-ups',
              'Check High-Intent Leads',
              'Assign clear next actions',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-amber-500 font-bold text-xs shrink-0 mt-0.5">{i + 1}.</span>
                <span className="text-th-body text-xs leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-th-surface border border-violet-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📅</span>
            <div className="text-th-heading font-semibold text-sm">Every Week</div>
          </div>
          <ol className="space-y-2">
            {[
              'Review funnel bottlenecks by stage',
              'Review team workload and redistribution',
              'Check source quality and conversion rates',
              'Review recommendations',
              'Decide one thing to improve next week',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-violet-400 font-bold text-xs shrink-0 mt-0.5">{i + 1}.</span>
                <span className="text-th-body text-xs leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bg-th-surface border border-th-border rounded-xl p-6 mb-8">
        <div className="text-th-muted text-[10px] uppercase tracking-widest font-semibold mb-3">The core business rule</div>
        <blockquote className="text-th-heading text-lg font-semibold leading-snug border-l-2 border-blue-500 pl-4">
          If leads are coming but revenue is not growing, the problem is usually not lead generation.
        </blockquote>
        <p className="text-th-body text-sm mt-3 leading-relaxed pl-4 border-l-2 border-th-border">
          The problem is lead movement, follow-up discipline, ownership, and visibility.
          This dashboard exists to make all four visible — and fixable.
        </p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-th-border">
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 bg-th-hover border border-th-border text-th-body text-sm font-medium px-4 py-2.5 rounded-lg transition-colors hover:text-th-heading"
        >
          ‹ Back to Dashboard
        </button>
        <button
          onClick={downloadGuide}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <span>↓</span> Download Guide
        </button>
      </div>
    </div>
  );
}

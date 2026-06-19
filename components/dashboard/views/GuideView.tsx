'use client';

import { useDashboard } from '@/context/DashboardContext';

interface Section {
  id: number;
  icon: string;
  title: string;
  meaning: string;
  interpret: string;
  action: string;
}

const SECTIONS: Section[] = [
  {
    id: 2,
    icon: '📊',
    title: 'Total Leads',
    meaning: 'Total enquiries and opportunities captured across all channels.',
    interpret: 'High lead count does not mean high revenue. Volume without movement is just noise.',
    action: 'Compare total leads with active leads, stuck leads, and converted leads to understand real pipeline health.',
  },
  {
    id: 3,
    icon: '🔄',
    title: 'Active in Funnel',
    meaning: 'Leads still in progress with potential to convert.',
    interpret: 'These are your current revenue opportunities. Every day without action is a day lost.',
    action: 'Move each active lead to the next stage with a clear follow-up task assigned to a named person.',
  },
  {
    id: 4,
    icon: '⏸️',
    title: 'Stuck Leads',
    meaning: 'Leads that have not moved for several days with no recorded activity.',
    interpret: 'Stuck leads are silent revenue leaks. They rarely self-resolve.',
    action: 'Call, WhatsApp, reassign, or formally close them with a documented reason. Do not let them sit.',
  },
  {
    id: 5,
    icon: '💰',
    title: 'Pipeline Value',
    meaning: 'The combined possible revenue of all open, active leads.',
    interpret: 'This is not confirmed revenue. It is potential revenue. Track how much is active, how much is stuck, and how much is at risk.',
    action: 'Focus effort on leads with high value that are close to conversion. Protect your pipeline from silent attrition.',
  },
  {
    id: 6,
    icon: '🔁',
    title: 'Follow-ups Due',
    meaning: 'Leads that need contact today or are overdue for follow-up.',
    interpret: 'This is your daily worklist. Start here every morning, not with new leads.',
    action: 'Assign specific next actions with owners and deadlines. A follow-up without a clear owner will not happen.',
  },
  {
    id: 7,
    icon: '📄',
    title: 'Quotations Sent',
    meaning: 'Leads where pricing or a proposal has already been shared.',
    interpret: 'This is a critical decision stage. Clients are evaluating you right now. Silence is not neutral — it favours the competition.',
    action: 'Follow up within 48 hours. Understand objections. Offer clarification. Improve your closure rate here and you improve overall revenue.',
  },
  {
    id: 8,
    icon: '🤝',
    title: 'Negotiations',
    meaning: 'Leads close to conversion, discussing scope, price, or timelines.',
    interpret: 'These need the most senior attention available. They are also the most time-sensitive.',
    action: 'Prioritise negotiations over cold leads. A founder or senior team member should be directly involved.',
  },
  {
    id: 9,
    icon: '❌',
    title: 'Lost Leads',
    meaning: 'Opportunities formally closed and marked as lost.',
    interpret: 'Lost leads are not failures. They are learning data. Repeated loss patterns point to fixable business problems.',
    action: 'Review lost reasons monthly. If the same reason appears more than twice, fix the process — not just the lead.',
  },
  {
    id: 10,
    icon: '📉',
    title: 'Funnel by Stage',
    meaning: 'How many leads are sitting in each sales stage right now.',
    interpret: 'A large pile-up at any stage indicates a bottleneck. The sales process is breaking down at that point.',
    action: 'Identify the most congested stage. Improve the handoff, script, or process at that specific stage before pushing more leads in.',
  },
  {
    id: 11,
    icon: '📡',
    title: 'Lead Source Breakdown',
    meaning: 'Where your leads are coming from — WhatsApp, referral, Instagram, website, walk-in, etc.',
    interpret: 'Some sources bring quantity. Others bring quality. Referrals typically close faster and at higher value.',
    action: 'Identify which sources convert best and invest more effort in those. Do not optimise for volume from low-quality sources.',
  },
  {
    id: 12,
    icon: '👥',
    title: 'Team Workload',
    meaning: 'How many leads each team member is currently handling.',
    interpret: 'Overloaded team members miss follow-ups, give poor attention, and lose deals. An unbalanced team is a revenue problem.',
    action: 'Redistribute leads when one person is significantly overloaded. Track who is most effective with which lead types.',
  },
  {
    id: 13,
    icon: '🔴',
    title: 'Stuck Leads List',
    meaning: 'Individual leads with no movement, sorted by value.',
    interpret: 'This is where real money may be hiding. High-value leads that go quiet rarely come back on their own.',
    action: 'Review this list daily. Each stuck lead should have a specific next action assigned before end of day.',
  },
  {
    id: 14,
    icon: '⚠️',
    title: 'High-Value Leads at Risk',
    meaning: 'Large deal-value leads showing no recent movement.',
    interpret: 'These can materially impact monthly revenue. They deserve disproportionate attention.',
    action: 'Founder or senior leadership should personally review and act on these. Do not delegate and forget.',
  },
  {
    id: 15,
    icon: '📋',
    title: 'Lost Reason Analysis',
    meaning: 'Why deals are being lost — price, timing, competition, unresponsiveness.',
    interpret: 'Repeated lost reasons are business process problems, not individual lead problems.',
    action: 'Fix the repeated reason systematically. If you keep losing on price, it is a positioning or qualification problem, not a negotiation problem.',
  },
  {
    id: 16,
    icon: '🧠',
    title: 'Insights Summary',
    meaning: 'Auto-generated plain-English summary of what your pipeline data is saying.',
    interpret: 'Use it before daily standups, weekly reviews, or founder check-ins. It converts data into decisions.',
    action: 'Download or email the summary to your team. Make it a weekly habit. Data you do not review cannot improve your business.',
  },
];

const GUIDE_CONTENT = `HOW TO READ AND USE YOUR VOUCH COMMAND CENTER
================================================

This dashboard is not just for seeing leads. It is for understanding where
revenue is getting stuck, which leads need action, which team members are
overloaded, and what decisions to take daily.

WHAT EACH METRIC MEANS
------------------------

Total Leads
  Meaning: Total enquiries captured across all channels.
  Interpret: High leads does not mean high revenue.
  Action: Compare with active, stuck, and converted leads.

Active in Funnel
  Meaning: Leads still in progress with conversion potential.
  Interpret: These are your current revenue opportunities.
  Action: Move each to the next stage with a clear follow-up.

Stuck Leads
  Meaning: Leads with no movement for several days.
  Interpret: Silent revenue leaks. They rarely self-resolve.
  Action: Call, WhatsApp, reassign, or close with a reason.

Pipeline Value
  Meaning: Combined possible revenue of all open leads.
  Interpret: Potential revenue — not confirmed revenue.
  Action: Protect it. Focus on high-value leads close to closing.

Follow-ups Due
  Meaning: Leads needing contact today or overdue.
  Interpret: Your daily worklist. Start here, not with new leads.
  Action: Assign specific next actions with owners and deadlines.

Quotations Sent
  Meaning: Proposals already shared, awaiting client decision.
  Interpret: Critical decision stage. Silence favours competition.
  Action: Follow up within 48 hours. Understand objections.

Negotiations
  Meaning: Leads close to conversion — discussing scope or price.
  Interpret: Most time-sensitive leads. Need senior attention.
  Action: Prioritise before cold leads. Founder should be involved.

Lost Leads
  Meaning: Opportunities formally closed as lost.
  Interpret: Learning data. Repeated patterns = fixable problems.
  Action: Review reasons monthly. Fix the pattern, not just the lead.

Funnel by Stage
  Meaning: How many leads are in each sales stage.
  Interpret: Pile-up in one stage = bottleneck.
  Action: Fix the handoff or process at the congested stage.

Lead Source Breakdown
  Meaning: Where leads are coming from.
  Interpret: Some sources bring volume; others bring quality.
  Action: Invest more in sources that convert, not just sources that attract.

Team Workload
  Meaning: Leads per team member.
  Interpret: Overloaded team = missed follow-ups = lost revenue.
  Action: Redistribute when workload is severely unbalanced.

Stuck Leads List
  Meaning: Individual leads needing attention, sorted by value.
  Interpret: Real money may be hiding here.
  Action: Review daily. Every stuck lead needs a next action today.

High-Value Leads at Risk
  Meaning: Large deal-value leads with no recent movement.
  Interpret: Can materially impact monthly revenue.
  Action: Founder or senior team should personally review these.

Insights Summary
  Meaning: Auto-generated summary of what the data is saying.
  Interpret: Use before meetings and reviews.
  Action: Download or email to team. Make it a weekly habit.

DAILY ROUTINE
--------------
Every morning:
  1. Check Follow-ups Due
  2. Check Stuck Leads
  3. Check High-Value Leads at Risk
  4. Check Negotiations
  5. Assign clear next actions

Every week:
  1. Review funnel bottlenecks
  2. Review team workload
  3. Review lost reasons
  4. Review best lead sources
  5. Decide what to improve next week

THE CORE BUSINESS RULE
------------------------
If leads are coming but revenue is not growing, the problem is usually
not lead generation. The problem is lead movement, follow-up discipline,
ownership, and visibility.

Powered by Vouch · vouchcc.netlify.app
`;

export default function GuideView() {
  const { setView } = useDashboard();

  function downloadGuide() {
    const blob = new Blob([GUIDE_CONTENT], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vouch-dashboard-guide.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-5 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-1.5 text-th-muted hover:text-th-body text-xs mb-3 transition-colors"
          >
            ‹ Back to Dashboard
          </button>
          <h1 className="text-th-heading font-bold text-2xl leading-tight">How to Read and Use This Dashboard</h1>
          <p className="text-th-body text-sm mt-2 leading-relaxed max-w-xl">
            This dashboard is not just for seeing leads. It is for understanding where revenue is getting stuck,
            which leads need action, which team members are overloaded, and what decisions to take daily.
          </p>
        </div>
        <button
          onClick={downloadGuide}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-th-heading text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <span>↓</span> Download Guide
        </button>
      </div>

      {/* Intro card */}
      <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <div className="text-th-heading font-semibold text-sm mb-1.5">Why this dashboard exists</div>
            <p className="text-th-body text-sm leading-relaxed">
              Most businesses lose revenue not because they lack leads — but because leads get stuck, go silent,
              or are never properly followed up. This dashboard gives you and your team a single place to see what
              is happening, who owns what, and what action to take right now.
            </p>
          </div>
        </div>
      </div>

      {/* Metric sections */}
      <div className="mb-8">
        <h2 className="text-th-heading font-bold text-base mb-1">What Each Metric Means</h2>
        <p className="text-th-muted text-xs mb-4">How to read every number on your dashboard</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map((s) => (
            <div key={s.id} className="bg-th-surface border border-th-border rounded-xl p-4 hover:border-white/12 transition-colors">
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
                  <p className="text-blue-300/80 text-xs mt-0.5 leading-relaxed">{s.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily routine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-th-surface border border-amber-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">☀️</span>
            <div className="text-th-heading font-semibold text-sm">Every Morning</div>
          </div>
          <ol className="space-y-2">
            {[
              'Check Follow-ups Due',
              'Check Stuck Leads',
              'Check High-Value Leads at Risk',
              'Check Negotiations',
              'Assign clear next actions to team',
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
              'Review team workload and redistribution needs',
              'Review lost reasons for patterns',
              'Review best-converting lead sources',
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

      {/* Core rule */}
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

      {/* Footer actions */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-th-border">
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-th-border text-th-body text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          ‹ Back to Dashboard
        </button>
        <button
          onClick={downloadGuide}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-th-heading text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <span>↓</span> Download Guide
        </button>
      </div>
    </div>
  );
}

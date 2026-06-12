const insights = [
  {
    type: 'warning',
    icon: '⚠️',
    title: 'Negotiation stage is your biggest bottleneck',
    body: '3 of 7 leads in Negotiation have been stuck for 7+ days. Total at-risk value: ₹245L. Kavitha and Pradeep are the assigned owners — direct founder conversations could unlock these.',
  },
  {
    type: 'critical',
    icon: '🔴',
    title: 'Referral leads convert at 3× — but are under-followed',
    body: '22 leads came via Referral. Only 6 have been contacted within 48 hrs. Referral leads have the highest close rate across all sources — faster first response will directly increase revenue.',
  },
  {
    type: 'insight',
    icon: '📈',
    title: 'WhatsApp is your top acquisition channel (38%)',
    body: '38 leads originated on WhatsApp, but 11 are unassigned and 7 haven\'t had a first contact. Every day of delay drops response quality significantly for high-intent leads.',
  },
  {
    type: 'positive',
    icon: '✅',
    title: 'Kavitha is handling disproportionate load',
    body: 'Kavitha R. is assigned 23+ active leads including 4 of the 5 highest-value deals. Consider distributing Negotiation support to Pradeep to reduce single-point risk.',
  },
  {
    type: 'insight',
    icon: '💡',
    title: '7 quotations sent have had no response in >5 days',
    body: 'These represent ₹390L+ in pending decisions. A structured follow-up sequence (call + revised quote if needed) within the next 48 hours could move 3–4 of these to Negotiation.',
  },
  {
    type: 'positive',
    icon: '🏆',
    title: '3 completed projects this period — all via Referral',
    body: 'DZH-092 to 094 were all referral-originated. Requesting testimonials and referrals from completed clients now can seed 5–8 new high-quality leads in the next 30 days.',
  },
];

const typeStyles: Record<string, string> = {
  critical: 'border-red-500/20 bg-red-500/5',
  warning:  'border-orange-500/20 bg-orange-500/5',
  insight:  'border-blue-500/15 bg-blue-500/5',
  positive: 'border-green-500/15 bg-green-500/5',
};

export default function AIInsights() {
  return (
    <div className="bg-[#0d1530] border border-white/6 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🧠</span>
        <div>
          <div className="text-white font-semibold text-sm">Pipeline Insights</div>
          <div className="text-slate-500 text-xs">Pattern analysis across 100 leads</div>
        </div>
      </div>

      <div className="space-y-2.5">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`border rounded-lg px-3.5 py-2.5 ${typeStyles[insight.type]}`}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-sm shrink-0 mt-0.5">{insight.icon}</span>
              <div>
                <div className="text-white text-xs font-semibold mb-1">{insight.title}</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">{insight.body}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
